import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabaseAdmin } from 'src/config/database.config';
import { DepartmentResponse } from './dto/department.dto';

@Injectable()
export class DepartmentService {
  async getDepartment() {
    const { data, error } = await supabaseAdmin
      .from('department_with_users')
      .select('*')
      .order('department_id', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as DepartmentResponse[]
  }

  
  async getDepartmentList(){
    const {data, error}= await supabaseAdmin.from('dep_with_leaders').select('*').order('department_id', { ascending: true });
    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data.map((dept) => ({
      id: dept.department_id,
      name: dept.department_name,
      memberCount: dept.member_count ?? 0,
      leader: dept.leader_id
        ? {
            id: dept.leader_id,
            name: dept.leader_name,
            avatarUrl: dept.leader_avatar_url,
            role: dept.leader_role,
          }
        : null,
    }));
    
  }
  }



