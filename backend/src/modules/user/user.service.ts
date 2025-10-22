import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';
import { ChangePasswordDto } from './dto/change_password.dto';
import { UpdateUserProfileDTO } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private readonly rolesRepo: Repository<RoleEntity>,
  ) {}

  async getUsersList() {
    try {
      const users = await this.usersRepo.find({
        select: ['id', 'name', 'avatar_url'],
        relations: ['department'],
        order: { name: 'ASC' }
      })
      return users.map(user => ({
        user_id: user.id,
        name: user.name,
        avatar_url: user.avatar_url,
        department_name: user.department?.name || null,
      }))
    } catch (e: any) {
      throw new InternalServerErrorException(e.message)
    }
  }

  // Lấy danh sách nhiều user cùng lúc
  async getProfilesFull(page = 1, perPage = 10) {
    const skip = (page - 1) * perPage
    try {
      const [users, total] = await this.usersRepo.findAndCount({
        relations: ['department', 'role'],
        order: { name: 'ASC' },
        skip,
        take: perPage
      })
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        department_name: user.department?.name || null,
        role_name: user.role?.role_name || null,
        is_disabled: user.is_disabled,
      }))
    } catch (e: any) {
      throw new InternalServerErrorException(e.message)
    }
  }

  // Lấy profile chi tiết của một người dùng cụ thể
  async getUserProfile(userId: string) {
    try {
      const user = await this.usersRepo.findOne({ 
        where: { id: userId }, 
        relations: ['department', 'role', 'projectMembers', 'projectMembers.project'] 
      })
      if(!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        department_name: user.department ? {
          id: user.department.id,
          name: user.department.name
        } : null,
        role: user.role ? {
          id: user.role.id,
          name: user.role.role_name
        } : null,
        projects: user.projectMembers?.map(member => ({
          project_id: member.project.id,
          project_role: member.project_role,
          project_name: member.project?.name
        })) || [],
        is_disabled: user.is_disabled,
      }
    } catch (e: any) {
      throw new InternalServerErrorException(e.message)
    }
  }

  async UpdateUserProfile(userId: string, payload: UpdateUserProfileDTO) {
    const found = await this.usersRepo.findOneOrFail({ where: { id: userId }})
    if(!found) throw new NotFoundException("User not found")
    const updated = await this.usersRepo.save({
      ...found,
      ...payload
    })
    // đây là object spread syntax 
    // tạo ra 1 thuộc tính mới bằng cách copy các thuộc tính từ found và payload 
    // found là bản ghi cũ, payload chứa các giá trị cần cập nhật 
    return updated 
  }

  async GetMembersByDep(depId: string) {
    try {
      const users = await this.usersRepo.find({
        where: { department_id: parseInt(depId) },
        select: ['department'],
        order: { name: 'ASC' }
      })
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        department_name: user.department?.name || null,
        is_disabled: user.is_disabled,
      }))
    } catch (e: any) {
      throw new InternalServerErrorException(e.message)
    }
  }
  
  async changePassword(model: ChangePasswordDto) {
    if(model.newPassword !== model.confirmPassword) throw new BadRequestException("New password and confirm password do not match")
    const user = await this.usersRepo.findOneOrFail({ where: { email: model.email }})
    if(!user) throw new NotFoundException("User not found")
    const bcrypt = await import('bcrypt')
    const ok = user.password_hash ? await bcrypt.compare(model.currentPassword, user.password_hash) : false;
    if(!ok) throw new BadRequestException("Current password is incorrect")
    const newHash = await bcrypt.hash(model.newPassword, 10)
    await this.usersRepo.update({ id: user.id }, { password_hash: newHash })
    return { message: "Password changed successfully" }
  }
  
}



