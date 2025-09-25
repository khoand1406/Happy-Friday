import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { supabaseAdmin } from 'src/config/database.config';

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
      .from('profile_full')
      .select('*')
      .eq('profile_id', userId)
      .single();

    if (error)
      throw new InternalServerErrorException(
        'Internal Server Error:' + error.message,
      );
    return data;
  }

  async UpdateUserProfile(userId: string, payload: any) {
    const { data, error } = await supabaseAdmin
      .from('profile_full')
      .update(payload)
      .eq('profile_id', userId)
      .select('*')
      .single();

    if(error) throw new InternalServerErrorException("Internal Server error: "+ error.message);
    if(!data) throw new NotFoundException("User not found");

    return data;
  }
}
