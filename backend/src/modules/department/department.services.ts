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

  async getDepartmentRes(depId: number): Promise<DepartmentResponse> {
    // 1️⃣ Gọi RPC để lấy thông tin phòng ban
    const { data, error } = await supabaseAdmin
      .rpc('get_department_detail', { dep_id: depId })
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new InternalServerErrorException('Department not found');
    }

    const depData = data as {
      department_id: number;
      department_name: string;
      leader: { id: string; name: string; avatar_url: string | null }[];
      members: { id: string; name: string; avatar_url: string | null }[];
    };

    // Lấy danh sách user (để map email)
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      throw new InternalServerErrorException(listError.message);
    }

    // Tạo map id → email
    const emailMap = new Map<string, string>();
    userList?.users?.forEach((u) => {
      if (u.id && u.email) {
        emailMap.set(u.id, u.email);
      }
    });

    // Format leader (chỉ 1 người)
    const leaderRaw = depData.leader[0];
    const leader = leaderRaw
      ? {
          user_id: leaderRaw.id,
          name: leaderRaw.name,
          phone: '',
          email: emailMap.get(leaderRaw.id) || '',
          avatar_url: leaderRaw.avatar_url || '',
        }
      : null;

    // Format members
    const members = (depData.members || []).map((m) => ({
      user_id: m.id,
      name: m.name,
      phone: '',
      email: emailMap.get(m.id) || '',
      avatar_url: m.avatar_url || '',
    }));

    // Trả về response đúng interface
    return {
      department_id: depData.department_id,
      department_name: depData.department_name,
      leader: leader!,
      members,
    };
  }
  }

