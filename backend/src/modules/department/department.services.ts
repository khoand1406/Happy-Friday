import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { supabaseAdmin } from "src/config/database.config";

@Injectable()
export class DepartmentService {
  async getDepartment() {
    const { data, error } = await supabaseAdmin
    .from('department')
    .select(`
      id,
      name,
      users(count)
    `);

  if (error) {
    throw new InternalServerErrorException(error.message);
  }

  return data.map((dept: any) => ({
    id: dept.id,
    name: dept.name,
    memberCount: dept.users[0]?.count ?? 0,
  }));
  }
}