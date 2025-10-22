import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from './department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly deptRepo: Repository<DepartmentEntity>
  ) {}
  async getDepartment() {
    try {
      const departments = await this.deptRepo
       .createQueryBuilder('d')
       .leftJoin('d.users', 'u')
       .select([
         'd.id', 
         'd.name', 
         'COUNT(u.id) as memberCount'
       ])
       .groupBy('d.id, d.name') 
       // cần group by để count hoạt động đúng 
       // gom nhóm đếm số user id của từng department id + name
       .orderBy('d.name', 'ASC')
       // xếp theo thứ tự tăng dần theo bảng chữ cái từ A -> Z
       .getRawMany()
       // entity chuẩn trong bảng thì dùng .getMany()
       // dữ liệu có tính toán như count() thì dùng .getRawMany()
      return departments.map((dept: any) => ({
        id: dept.d_id,
        name: dept.d_name,
        memberCount: parseInt(dept.memberCount) || 0
        
      }))
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch departments: " + error.message )
    }
  }
}