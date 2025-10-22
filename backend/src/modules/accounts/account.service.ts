import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common'
// badrequestexception là mã http 400 cho request sai dữ liệu, thiếu thông tin, 
// notfoundexception là lỗi 401 không tìm thấy dữ liệu trong db 
// internalservererrorexception là lỗi 500 server không xác định 
import { randomBytes } from 'crypto'
// module crypto dùng đã mã hóa, tạo token, hash mật khẩu, sinh dữ liệu ngẫu nhiên
// randomBytes để tạo chuỗi bytes ngẫu nhiên
import { sendMail } from 'src/common/mailer'
import { InjectRepository } from '@nestjs/typeorm'
// dùng để inject tiêm 1 repository của 1 entity vào trong service
import { Repository, SelectQueryBuilder } from 'typeorm'
// repository đại diện cho 1 bảng trong database có các hàm CRUD dùng để thao tác với dữ liệu
// selectquerybuilder cho phép viết query linh hoạt hơn khi cần join, filter nâng cao
import * as bcrypt from 'bcrypt'
// * as nghĩa là import tất cả các hàm được export từ thư viện bcrypt và đặt tên cho chúng là bcrypt
import { UserEntity } from '../user/user.entity';
import { DepartmentEntity } from '../department/department.entity';
import { DepartmentTransferEntity } from '../department/departmenttransfer.entity';

interface CreateAccountPayload {
  email: string,
  password?: string,
  full_name?: string,
  phone?: string,
  role_id?: number,
  department_id?: number
}
// đây là 1 interface trong typescript định nghĩa kiểu dữ liệu cho 1 object 
// thường dùng để tạo kiểu cho DTO (data transfer object), tạo request body khi api tạo tài khoản, và giúp code an toàn hơn vì typescript kiểm tra kiểu

interface UpdateAccountPayload {
  full_name?: string,
  phone?: string,
  role_id?: number,
  department_id?: number
}

@Injectable()
export class AccountService {
  constructor(
   @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
   @InjectRepository(DepartmentEntity) private readonly deptRepo: Repository<DepartmentEntity>,
   @InjectRepository(DepartmentTransferEntity) private readonly transferRepo: Repository<DepartmentTransferEntity>,
  ) {}
  
  async list(page = 1, perPage = 5) {
    try {
      await this.applyDueDepartmentTransfers()
    } catch(e) { // e là lỗi bị error ném ra
    }
    const skip = (page - 1) * perPage; 
    // tính số bản ghi cần bỏ qua để phân trang
    // vd: page 2 → skip = (2-1)*10 = 10
    const queryBuilder = this.usersRepo
      .createQueryBuilder('u') // u là alias cho bảng user
      // use relation join so TypeORM will load the Department entity into u.department
      .leftJoinAndSelect('u.department', 'd')
      .orderBy('u.name', 'ASC') // sắp xếp theo thứ tự tăng dần
      .addOrderBy('u.id', 'DESC') // nếu trùng id thì sắp xếp theo giảm dần
      .skip(skip) // bỏ qua các record trước để phân trang 
      .take(perPage) // giới hạn số bản ghi trả về mỗi Page
    const [items, total] = await queryBuilder.getManyAndCount()
    // getManyAndCount dùng để truy vấn dữ liệu có phân trang trả về items danh sách bản ghi tìm thấy cho từng trang và total chứa tổng số bản ghi trong db
    const formattedItems = items.map((u: any) => ({ // format lại để tránh trả về dữ liệu dư thừa, có vài field không nên trả về như kiểu password 
      id: u.id,
      name: u.name,
      phone: u.phone,
      email: u.email,
      department_name: u.department?.name || null,
      // use loaded relation department.name
      avatar_url: u.avatar_url || null,
      // normalize dữ liệu vì nếu 1 số field mà null thì sẽ trả về undefined gây lỗi trên crash trên frontend 
      is_disabled: !!u.is_disabled // ép kiểu boolean sang true/false 
    })) 
    return { items: formattedItems, total }
  }

  async create(payload: CreateAccountPayload) {
    if(!payload.email) {
      throw new BadRequestException('Email is required')
    }
    const passwordToUse = payload.password && payload.password.length >= 6
      ? payload.password
      : randomBytes(9).toString("base64")
      // tạo ra 9 bytes binary dữ liệu random và bytes thì không đọc được nên đổi sang dạng chuỗi ngẫu nhiên base64 
    const exists = await this.usersRepo.findOne({ where: {email: payload.email} })
    // findOne nghĩa là tìm user có mail giống mail mà client gửi lên 
    if(exists) throw new BadRequestException("This email has already been registered")
    const passwordHash = await bcrypt.hash(passwordToUse, 10)
    // password người dùng nhập + random salt tự được thêm vào để chống trùng hash giữa các mật khẩu giống nhau + salt rounds = 10 là 1024 số vòng tính toán nội bộ 
    // = hash là kết quả cuối cùng trong database 
    const newUser = this.usersRepo.create({
      email: payload.email,
      password_hash: passwordHash,
      name: payload.full_name ?? null, 
      phone: payload.phone ?? null,
      role_id: payload.role_id ?? 2, // 2 ở đây mặc định là user, còn 1 là admin
      department_id: payload.department_id ?? null
    })  
    const created = await this.usersRepo.save(newUser)
    try {
      await this.sendWelcomeEmail(payload.email, payload.full_name || 'Colleague')
    } catch (emailError) {
      console.error("[AccountsService] Failed to send welcome email:", emailError)
    }
    return created
  }

  async update(userId: string, payload: UpdateAccountPayload) {
    const found = await this.usersRepo.findOneOrFail({where:{id: userId}})
    if(payload.full_name !== undefined) found.name = payload.full_name
    if (payload.phone !== undefined) found.phone = payload.phone;
    if (payload.role_id !== undefined) found.role_id = payload.role_id;
    if (payload.department_id !== undefined) found.department_id = payload.department_id;
    // field ở FE ko gửi data lên thì nó là undefined
    const saved = await this.usersRepo.save(found)
    return saved
  }

  async updateByEmail(email: string, payload: UpdateAccountPayload) {
    const found = await this.usersRepo.findOneOrFail({ where: { email } });
    return this.update(found.id, payload);
  }

  async disable(userId: string) {
    await this.usersRepo.findOneOrFail({ where: { id: userId } });
    // findOne khi không tìm thấy thì trả về null còn findOneOrFail thì ném luôn lỗi EntityNotFoundError
    await this.usersRepo.update({ id: userId }, { is_disabled: true });
    return { message: 'User disabled' };
  }

  async enable(userId: string) {
    await this.usersRepo.findOneOrFail({ where: { id: userId } });
    await this.usersRepo.update({ id: userId }, { is_disabled: false });
    return { message: 'User enabled' };
  }
  
  async banWithDuration(userId: string, hours: number) {
    const safeHours = Math.max(1, Math.floor(hours || 1))
    // Math.max so sánh 2 số và lấy số lớn hơn
    // Math.floor làm tròn xuống số nguyên gần nhất
    await this.usersRepo.findOneOrFail({ where: { id: userId} })
    await this.usersRepo.update( {id: userId}, { is_disabled: true} )
    return { message: `User banned for ${safeHours} hour` }
  }

  async remove(userId: string) {
    await this.usersRepo.findOneOrFail({ where: { id: userId } });
    await this.usersRepo.delete({ id: userId });
    return { message: 'User deleted' };
  }

  async resetPassword(userId: string, newPassword: string) {
    try {
      await this.usersRepo.findOneOrFail({ where: {id: userId} })
      if(typeof newPassword !== 'string' || newPassword.trim().length < 6) {
        throw new BadRequestException("Password must be at least 6 characters")
      }
      const password_hash = await bcrypt.hash(newPassword.trim(), 10)
      await this.usersRepo.update({id: userId}, { password_hash })
    } catch (err) {
      console.error("[AccountsService.resetpassword] error", err)
      throw err
    }
  }

  async importAccounts(accounts: CreateAccountPayload[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    for(const account of accounts) {
      try {
       await this.create(account) 
       results.success++
       // this ở đây là đại diện cho cả class AccountService, nó cùng hàm create() ở trong service
      } catch(error) {
        results.failed++
        results.errors.push(`${account.email} : ${error.message}`)
      }
    }
    return results
  }

  async scheduleDepartmentTransfer(userId: string, toDepartmentId: number, effectiveDateISO: string) {
    const current = await this.usersRepo.findOneOrFail({ where: { id: userId }})
    const fromDepartmentId = current.department_id ?? null
    const parsed = new Date(effectiveDateISO)  // tạo đối tượng date
    if(Number.isNaN(parsed.getTime())) {
      // getTime() đổi thời gian sang miliseconds để kiểm tra tính hợp lệ của thời gian và trả về NaN (Not a number)
      throw new BadRequestException("Invalid effectiveDateISO")
    }
    const hasOffset = /[zZ]|[+\-]\d{2}:\d{2}$/.test(effectiveDateISO)
    // kiểm tra xem múi giờ có chứa timezone offset hay ko là độ chêch lệch múi giờ
    // .test(effectiveDateISO) giúp trả về true nếu nếu chuỗi effectiveDateISO khớp với chuỗi Regex
    const storedUTC = hasOffset ? parsed : new Date(parsed.getTime() - 7 * 60 * 60 * 1000) 
    // xử lí trường hợp effectiveDateISO truyền vào không có múi giờ, tự hiểu là giờ vn thì trừ đi 7 để lưu đồng nhất nhất giờ UTC vào db
    const transfer = this.transferRepo.create({
      user_id: userId,
      from_department_id: fromDepartmentId,
      to_department_id: toDepartmentId,
      effective_date: storedUTC,
      status: 'scheduled'
    })
    const saved = await this.transferRepo.save(transfer)
    if(storedUTC.getTime() <= Date.now()) {
      await this.applyDueDepartmentTransfersForUser(userId);
    }
    return saved
  }

  async applyDueDepartmentTransfers(): Promise<{ applied: number }> {
    const transfers = await this.transferRepo.find({where: {status: 'scheduled'}})
    let applied = 0
    const now = Date.now()
    for(const transfer of transfers) {
      try {
        if (!transfer.effective_date) {
          // Skip transfers without an effective date (data inconsistency)
          continue;
        }
        const utcEffectiveDate = new Date(transfer.effective_date);
        const vietnamEffectiveDate = new Date(utcEffectiveDate.getTime() + (7 * 60 * 60 * 1000));
        if(vietnamEffectiveDate.getTime() <= now) {
          await this.usersRepo.update({id: transfer.user_id}, {department_id: transfer.to_department_id});
          await this.transferRepo.update({id: transfer.id}, {status: 'applied'});
          applied++;
        }
      } catch(e) {
        console.error(e);
      }
    }
    return  {applied}
  }

  private async applyDueDepartmentTransfersForUser(userId: string): Promise<void> {
    const transfers = await this.transferRepo.find({
      where: { 
        status: 'scheduled',
        user_id: userId 
      }
    });
    
    const now = Date.now();
    for (const transfer of transfers) {
      if (!transfer.effective_date) continue; // skip if null
      const utcEffectiveDate = new Date(transfer.effective_date);
      const vietnamEffectiveDate = new Date(utcEffectiveDate.getTime() + (7 * 60 * 60 * 1000)); 
      if (vietnamEffectiveDate.getTime() <= now) {
        await this.usersRepo.update({ id: transfer.user_id }, { department_id: transfer.to_department_id });
        await this.transferRepo.update({ id: transfer.id }, { status: 'applied' });
      }
    }
  }

  private async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    await sendMail({
      to: email,
      subject: '[Zen8labs] Welcome to Zen8labs!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Zen8labs</h1>
            <h2 style="color: #1f2937; margin: 10px 0;">Welcome aboard!</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 16px; color: #374151;">Hi <strong>${fullName}</strong>,</p>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: #374151;">We're excited to have you at Zen8labs! Your account has been created successfully. You can start using the Happy Friday system now.</p>
          </div>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0;">Account info</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Status:</strong> Activated</p>
            <p style="margin: 5px 0; color: #374151;"><strong>System:</strong> Happy Friday</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/login" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Sign in
            </a>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">If you have any questions, please contact IT or your line manager.</p>
            <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">We wish you great experiences at Zen8labs!</p>
          </div>
        </div>
      `
    });
  }

}








