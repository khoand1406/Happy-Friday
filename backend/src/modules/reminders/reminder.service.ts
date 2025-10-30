import { Injectable, NotFoundException } from "@nestjs/common";
import { supabaseAdmin } from "src/config/database.config";

@Injectable()
export class ReminderServices{
    async createReminder(eventId: number, remindAt: Date, method = 'notification', userId: string) {
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single();

    if (eventError || !event) throw new NotFoundException('Event not found');

    const { data, error } = await supabaseAdmin
      .from('reminders')
      .insert([{ eventId: eventId, remind_at: remindAt, method, creatorId: userId }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getRemindersByEvent(eventId: string) {
    const { data, error } = await supabaseAdmin
      .from('reminders')
      .select('*')
      .eq('event_id', eventId)
      .order('remind_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteReminder(id: string) {
    const { error } = await supabaseAdmin.from('reminders').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }

  async checkAndSendReminders() {
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from('reminders')
      .select('id, event_id, remind_at, is_sent, events!inner(title, start_time, user_id)')
      .lte('remind_at', now)
      .eq('is_sent', false);

    if (error) throw new Error(error.message);

    for (const r of data || []) {

      // Mark as sent
      await supabaseAdmin.from('reminders').update({ is_sent: true }).eq('id', r.id);

      // TODO: gửi thông báo tới user r.events.user_id
    }
  }
}
