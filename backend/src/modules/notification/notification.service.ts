import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabaseAdmin } from 'src/config/database.config';
import { CreateNotificationRequest, NotificationResponse } from './dto/notification.dto';

@Injectable()
export class NotificationServices {
  async getNotification(userId: string): Promise<NotificationResponse[]> {
    const { data, error } = await supabaseAdmin
      .from('notification')
      .select('*')
      .order('id', { ascending: true })
      .eq('user_id', userId);

      

    if (error) {
      throw new InternalServerErrorException(
        `Internal Server Error: ${error?.message ?? error}`,
      );
    }
    return data as NotificationResponse[];
  }
  async createNotification(
    model: CreateNotificationRequest,
  ): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('notification')
      .insert(model)
      .select()
      .single();
    if (error) {
      throw new InternalServerErrorException(
        `Internal Server Error: ${error?.message ?? error}`,
      );
    }
    
    return data;
  }

  async updateReadStatus():Promise<any>{
    const {error}= await supabaseAdmin.from('notification').update("");
  }

  async getNotificationWithStatus(userId: string): Promise<(NotificationResponse & { status: boolean | null })[]> {
  const { data, error } = await supabaseAdmin
    .from('notification')
    .select('*')
    .eq('user_id', userId)
    .order('id', { ascending: true });

  if (error) {
    throw new InternalServerErrorException(
      `Internal Server Error: ${error?.message ?? error}`,
    );
  }

  const enriched = await Promise.all(
    data.map(async (notif) => {
      if (!notif.eventId) return { ...notif, status: null };

      const { data: attendence } = await supabaseAdmin
        .from('attendences')
        .select('status')
        .eq('eventId', notif.eventId)
        .eq('userid', userId)
        .single();

      return {
        ...notif,
        status: attendence?.status ?? null,
      };
    })
  );

  return enriched;
}

}
