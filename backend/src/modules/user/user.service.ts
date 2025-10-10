import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { supabase, supabaseAdmin } from 'src/config/database.config';
import { ChangePasswordDto } from './dto/change_password.dto';
import { UpdateUserProfileDTO } from './dto/profile.dto';

@Injectable()
export class UserService {
  async getUsersList(){
    const {data, error}= await supabaseAdmin.from('users_with_dep').select('user_id, name, department_name, avatar_url');
    if(error){
      throw new InternalServerErrorException(error.message)
    }
    return data;

  }


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
    if (error)
      throw new InternalServerErrorException(
        'Internal Server Error ' + error.message,
      );
    return data;
  }

  async changePassword(model: ChangePasswordDto) {
    if (model.newPassword !== model.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: model.email,
      password: model.currentPassword,
    });
    if (verifyError) {
      throw new BadRequestException('Current password is incorrect');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: model.newPassword,
    });

    if (error) {
      throw new BadRequestException(
        `Change password failed, reason: ${error.message}`,
      );
    }

    await supabase.auth.signOut();

    return { message: 'Password changed successfully' };
  }
}
