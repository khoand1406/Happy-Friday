import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { supabase, supabaseAdmin } from 'src/config/database.config';
import { UpdateUserProfileDTO } from './dto/profile.dto';
import { changePasswordDto } from './dto/change_password.dto';

@Injectable()
export class UserService {
  async getProfilesFull(page = 1, perPage = 10) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error } = await supabaseAdmin
      .from('profiles_full')
      .select('*')
      .range(from, to);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async getUserProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('profile_with_projects_json')
      .select('*')
      .eq('id', userId)
      .single();

    if (error)
      throw new InternalServerErrorException(
        'Internal Server Error:' + error.message,
      );
    return data;
  }

  async UpdateUserProfile(userId: string, payload: UpdateUserProfileDTO) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(payload)
      .eq('id', userId)
      .select('*')
      .single();

    if (error)
      throw new InternalServerErrorException(
        'Internal Server error: ' + error.message,
      );
    if (!data) throw new NotFoundException('User not found');

    return data;
  }

  async GetMembesrByDep(depId: number) {
    const { data, error } = await supabaseAdmin
      .from('members_with_dep')
      .select('*')
      .eq('department_id', depId);
    if(error) throw new InternalServerErrorException("Internal Server Error "+ error.message);
    return data;
  }

  async changePassword(model:changePasswordDto){
    const {data, error}=await supabase.auth.updateUser({
      password: model.newPassword
    })
  }
}
