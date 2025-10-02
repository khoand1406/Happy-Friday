import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { supabaseAdmin } from "src/config/database.config";

@Injectable()
export class DepartmentService {
  async getDepartment() {
    const { data, error } = await supabaseAdmin
    .from('department')
    .select('*');
    
    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
}