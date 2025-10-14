import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { supabase, supabaseAdmin } from 'src/config/database.config';
import { sendMail } from 'src/common/mailer';

interface CreateAccountPayload {
  email: string;
  password?: string;
  full_name?: string;
  phone?: string;
  role_id?: number;
  department_id?: number;
}

interface UpdateAccountPayload {
  full_name?: string;
  phone?: string;
  role_id?: number;
  department_id?: number;
}

@Injectable()
export class AccountsService {
  async list(page = 1, perPage = 10) {
    // Apply any due department transfers before listing
    try {
      await this.applyDueDepartmentTransfers();
    } catch (e) {
      // non-blocking
    }
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Lấy danh sách users từ bảng users
    const { data: users, count, error } = await supabaseAdmin
      .from('users')
      .select('id,name,phone,role_id,department_id,avatar_url', { count: 'exact' })
      .range(from, to);
    
    if (error) throw new InternalServerErrorException(error.message);

    // Lấy email từ auth.users cho từng user
    const userIds = (users || []).map((u: any) => u.id);
    const idToEmail = new Map<string, string>();
    const idToDisabled = new Map<string, boolean>();
    
    if (userIds.length > 0) {
      try {
        // Lấy tất cả auth users
        const { data: authUsers, error: authErr } = await (supabaseAdmin as any)
          .auth.admin.listUsers();
        
        if (!authErr && authUsers?.users) {
          authUsers.users.forEach((u: any) => {
            if (u?.id && userIds.includes(u.id)) {
              idToEmail.set(u.id, u.email);
              const bannedUntil = (u as any)?.banned_until || (u as any)?.ban_until || (u as any)?.banExpiresAt;
              const isDisabled = bannedUntil ? new Date(bannedUntil).getTime() > Date.now() : false;
              idToDisabled.set(u.id, !!isDisabled);
            }
          });
        }
      } catch (e) {
        console.warn('Could not fetch auth users:', e);
      }
    }

    // Lấy thông tin department
    const departmentIds = [...new Set((users || []).map((u: any) => u.department_id).filter(Boolean))];
    const idToDepartment = new Map<number, string>();
    
    if (departmentIds.length > 0) {
      const { data: departments } = await supabaseAdmin
        .from('department')
        .select('id,name')
        .in('id', departmentIds);
      
      (departments || []).forEach((d: any) => {
        idToDepartment.set(d.id, d.name);
      });
    }

    const items = (users || []).map((u: any) => ({
      id: u.id,
      name: u.name,
      phone: u.phone,
      email: idToEmail.get(u.id) || null,
      department_name: idToDepartment.get(u.department_id) || null,
      avatar_url: u.avatar_url || null,
      is_disabled: idToDisabled.get(u.id) ?? false,
    }));

    return { items, total: typeof count === 'number' ? count : items.length };
  }

  async create(payload: CreateAccountPayload) {
    if (!payload.email) {
      throw new BadRequestException('Email is required');
    }
    const passwordToUse = payload.password && payload.password.length >= 6
      ? payload.password
      : randomBytes(9).toString('base64');
    // Create auth user using service role (server-side)
    const { data: created, error: adminErr } = await (supabaseAdmin as any).auth.admin.createUser({
      email: payload.email,
      password: passwordToUse,
      email_confirm: true,
    });

    if (adminErr) {
      // Chuyển đổi thông báo lỗi từ Supabase sang tiếng Việt
      let errorMessage = adminErr.message;
      if (errorMessage.includes('A user with this email address has already been registered')) {
        errorMessage = 'Email này đã được đăng ký trong hệ thống';
      } else if (errorMessage.includes('Invalid email address')) {
        errorMessage = 'Địa chỉ email không hợp lệ';
      } else if (errorMessage.includes('Password should be at least')) {
        errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      throw new BadRequestException(errorMessage);
    }
    const userId: string | undefined = created?.user?.id;
    if (!userId) {
      throw new InternalServerErrorException('Failed to create auth user');
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        name: payload.full_name ?? null,
        phone: payload.phone,
        role_id: payload.role_id ?? 2,
        department_id: payload.department_id ?? null,
      })
      .select('*')
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    
    // Send welcome email
    try {
      await this.sendWelcomeEmail(payload.email, payload.full_name || 'Nhân viên');
    } catch (emailError) {
      console.error('[AccountsService] Failed to send welcome email:', emailError);
      // Don't throw error - account creation should succeed even if email fails
    }
    
    return data;
  }

  async update(userId: string, payload: UpdateAccountPayload) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        name: payload.full_name,
        phone: payload.phone,
        role_id: payload.role_id,
        department_id: payload.department_id,
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new NotFoundException('User not found');
    return data;
  }

  async updateByEmail(email: string, payload: UpdateAccountPayload) {
    // Email không có ở bảng users -> tra id từ view profiles_full rồi update theo id
    const { data: found, error: findErr } = await supabaseAdmin
      .from('profiles_full')
      .select('*')
      .eq('email', email)
      .single();

    if (findErr) throw new InternalServerErrorException(findErr.message);
    const uid = (found as any)?.id ?? (found as any)?.user_id ?? (found as any)?.uid ?? (found as any)?.UUID ?? (found as any)?.sub;
    if (!uid) throw new NotFoundException('User not found');

    return this.update(uid, payload);
  }

  async disable(userId: string) {
    const { error } = await (supabaseAdmin as any).auth.admin.updateUserById(userId, {
      ban_duration: '876000h',
    } as any);
    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'User disabled' };
  }

  async enable(userId: string) {
    const { error } = await (supabaseAdmin as any).auth.admin.updateUserById(userId, {
      ban_duration: 'none',
    } as any);
    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'User enabled' };
  }

  async banWithDuration(userId: string, hours: number) {
    const safeHours = Math.max(1, Math.floor(hours || 1));
    const { error } = await (supabaseAdmin as any).auth.admin.updateUserById(userId, {
      ban_duration: `${safeHours}h`,
    } as any);
    if (error) throw new InternalServerErrorException(error.message);
    return { message: `User banned for ${safeHours} hours` };
  }

  async remove(userId: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new InternalServerErrorException(error.message);

    const { error: dbError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);
    if (dbError) throw new InternalServerErrorException(dbError.message);
    return { message: 'User deleted' };
  }

  async resetPassword(userId: string, newPassword: string) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Password reset successfully' };
  }

  async importAccounts(accounts: CreateAccountPayload[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const account of accounts) {
      try {
        await this.create(account);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${account.email}: ${error.message}`);
      }
    }

    return results;
  }

  // ===== Department transfer (scheduled) =====
  async scheduleDepartmentTransfer(userId: string, toDepartmentId: number, effectiveDateISO: string) {
    // Fetch current department
    const { data: current, error: curErr } = await supabaseAdmin
      .from('users')
      .select('department_id')
      .eq('id', userId)
      .single();
    if (curErr) throw new InternalServerErrorException(curErr.message);
    const fromDepartmentId = (current as any)?.department_id ?? null;

    // Convert Vietnam time (UTC+7) to UTC for database storage
    const vietnamDate = new Date(effectiveDateISO);
    const utcDate = new Date(vietnamDate.getTime() + (7 * 60 * 60 * 1000)); // Add 7 hours to get UTC

    // Insert schedule
    const { data, error } = await supabaseAdmin
      .from('department_transfers')
      .insert({
        user_id: userId,
        from_department_id: fromDepartmentId,
        to_department_id: toDepartmentId,
        effective_date: utcDate.toISOString(),
        status: 'scheduled',
      } as any)
      .select('*')
      .single();
    if (error) throw new InternalServerErrorException(error.message);

    // If effective date already reached (Vietnam time), apply immediately
    if (vietnamDate.getTime() <= Date.now()) {
      await this.applyDueDepartmentTransfersForUser(userId);
    }
    return data;
  }

  async applyDueDepartmentTransfers(): Promise<{ applied: number }> {
    // Get all scheduled transfers
    const { data: allScheduled, error } = await supabaseAdmin
      .from('department_transfers')
      .select('id,user_id,to_department_id,effective_date,status')
      .eq('status', 'scheduled');
    if (error) throw new InternalServerErrorException(error.message);
    const transfers = allScheduled || [];

    let applied = 0;
    const now = Date.now();
    
    for (const t of transfers as any[]) {
      try {
        // Convert UTC effective_date back to Vietnam time for comparison
        const utcEffectiveDate = new Date(t.effective_date);
        const vietnamEffectiveDate = new Date(utcEffectiveDate.getTime() - (7 * 60 * 60 * 1000)); // Subtract 7 hours to get Vietnam time
        
        // Check if Vietnam time has reached the effective date
        if (vietnamEffectiveDate.getTime() <= now) {
          await supabaseAdmin.from('users').update({ department_id: t.to_department_id }).eq('id', t.user_id);
          await supabaseAdmin.from('department_transfers').update({ status: 'applied' }).eq('id', t.id);
          applied++;
        }
      } catch (e) {
        // continue next
      }
    }
    return { applied };
  }

  private async applyDueDepartmentTransfersForUser(userId: string): Promise<void> {
    const { data: allScheduled, error } = await supabaseAdmin
      .from('department_transfers')
      .select('id,user_id,to_department_id,effective_date,status')
      .eq('status', 'scheduled')
      .eq('user_id', userId);
    if (error) throw new InternalServerErrorException(error.message);
    const transfers = allScheduled || [];
    
    const now = Date.now();
    for (const t of transfers as any[]) {
      // Convert UTC effective_date back to Vietnam time for comparison
      const utcEffectiveDate = new Date(t.effective_date);
      const vietnamEffectiveDate = new Date(utcEffectiveDate.getTime() - (7 * 60 * 60 * 1000)); // Subtract 7 hours to get Vietnam time
      
      // Check if Vietnam time has reached the effective date
      if (vietnamEffectiveDate.getTime() <= now) {
        await supabaseAdmin.from('users').update({ department_id: t.to_department_id }).eq('id', t.user_id);
        await supabaseAdmin.from('department_transfers').update({ status: 'applied' }).eq('id', t.id);
      }
    }
  }

  private async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    await sendMail({
      to: email,
      subject: '[Zen8labs] Chào mừng bạn đến với công ty Zen8labs!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Zen8labs</h1>
            <h2 style="color: #1f2937; margin: 10px 0;">Chào mừng bạn đến với công ty!</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 16px; color: #374151;">
              Xin chào <strong>${fullName}</strong>,
            </p>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: #374151;">
              Chúng tôi rất vui mừng chào đón bạn gia nhập đội ngũ Zen8labs! Tài khoản của bạn đã được tạo thành công và bạn có thể bắt đầu sử dụng hệ thống Happy Friday ngay bây giờ.
            </p>
          </div>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0;">Thông tin tài khoản</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Trạng thái:</strong> Đã kích hoạt</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Hệ thống:</strong> Happy Friday</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/login" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Đăng nhập ngay
            </a>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với bộ phận IT hoặc quản lý trực tiếp.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">
              Chúc bạn có những trải nghiệm tuyệt vời tại Zen8labs!
            </p>
          </div>
        </div>
      `
    });
  }
}







