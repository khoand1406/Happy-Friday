import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { supabase, supabaseAdmin } from 'src/config/database.config';

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
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error } = await supabaseAdmin
      .from('profiles_full')
      .select('*')
      .range(from, to);

    if (error) throw new InternalServerErrorException(error.message);
    return data;
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
      throw new BadRequestException(adminErr.message);
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
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: '876000h',
    } as any);
    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'User disabled' };
  }

  async enable(userId: string) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: 'none',
    } as any);
    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'User enabled' };
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
}







