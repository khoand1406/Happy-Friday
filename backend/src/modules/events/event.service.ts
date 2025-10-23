import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { supabaseAdmin } from 'src/config/database.config';
import { NotificationServices } from '../notification/notification.service';
import {
  CreateEventRequest,
  CreateEventResponse,
  EventDetailResponse,
  EventResponse,
  EventResponseT,
  UpdateEventRequest,
} from './dto/event.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(private readonly notiService: NotificationServices) {}
  async getEvents(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<EventResponse[]> {
    const { data, error } = await supabaseAdmin.rpc('get_user_events', {
      uid: userId,
      start_d: new Date(startDate).toISOString(),
      end_d: new Date(endDate).toISOString(),
    });
    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }
    return data as EventResponse[];
  }
  async getIncomingEvents(): Promise<any> {
    const now = new Date().toISOString();
    try {
      this.logger.log(`Querying incoming events with startDate >= ${now}`);

      const { data, error, status } = await supabaseAdmin
        .from('events')
        .select('id, title, content, "startDate", "endDate", "creatorId"')
        .gte('startDate', now);

      if (error) {
        this.logger.error(
          'Supabase returned error',
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        );
        throw new InternalServerErrorException(
          'Supabase error: ' + (error.message ?? JSON.stringify(error)),
        );
      }

      const safeData = (data ?? []).filter((item, idx) => {
        const okId = item?.id !== undefined && item?.id !== null;
        const okStart = !!item?.startDate;
        const okEnd = !!item?.endDate;
        if (!okId || !okStart || !okEnd) {
          this.logger.warn(
            `Skipping invalid row at index ${idx}: id=${item?.id}, startDate=${item?.startDate}, endDate=${item?.endDate}`,
          );
          return false;
        }

        if (isNaN(Number(item.id))) {
          this.logger.warn(
            `Row id is not numeric: id=${String(item.id)} (type=${typeof item.id}) at index ${idx}`,
          );
        }
        return true;
      });

      const mapped = safeData.map((item) => ({
        id: typeof item.id === 'number' ? item.id : Number(item.id), 
        title: item.title ?? 'No Title',
        content: item.content ?? '',
        start: new Date(item.startDate),
        end: new Date(item.endDate),
        creatorId: String(item.creatorId),
      }));

      this.logger.log(`Returning ${mapped.length} incoming events`);
      return mapped;
    } catch (err) {
      this.logger.error('getIncomingEvents failed', err as any);
      throw new InternalServerErrorException(
        'Internal Server Error while fetching incoming events',
      );
    }
  }
  async getPastEvents(): Promise<EventResponseT[]> {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .lt('endDate', new Date().toISOString());
    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }
    const mapped= data.map((item)=>({
      id: typeof item.id === 'number' ? item.id : Number(item.id), 
        title: item.title ?? 'No Title',
        content: item.content ?? '',
        start: new Date(item.startDate),
        end: new Date(item.endDate),
        creatorid: String(item.creatorId),
    }));

    return mapped;
  }

  async getDetailEvent(eventId: number): Promise<EventDetailResponse> {
    const { data, error } = await supabaseAdmin
      .from('event_with_attendees_json')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data as EventDetailResponse;
  }

  async createEvent(model: CreateEventRequest): Promise<CreateEventResponse> {
    const toUTC = (date: any) => {
      const d = new Date(date);
      return new Date(
        d.getTime() - d.getTimezoneOffset() * 60000,
      ).toISOString();
    };

    const { data: eventData, error } = await supabaseAdmin
      .from('events')
      .insert({
        title: model.title ?? 'No title',
        content: model.content ?? 'No content',
        startDate: toUTC(model.startDate),
        endDate: toUTC(model.endDate),
        creatorId: model.creatorId,
      })
      .select()
      .single();

    const attendancesPayload = [...model.invitees, model.creatorId];

    const attendances = attendancesPayload.map((userId) => ({
      userid: userId,
      eventId: eventData.id,
      status: userId === model.creatorId,
      created_at: new Date().toISOString(),
      update_at: null,
    }));

    const { error: inviteError } = await supabaseAdmin
      .from('attendences')
      .insert(attendances);
    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }
    if (inviteError) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + inviteError.message,
      );
    }

    const notificationPromises = model.invitees.map((userId) =>
      this.notiService.createNotification({
        user_id: userId,
        type: 'event_invite',
        title: `Bạn được mời tham gia sự kiện "${model.title}"`,
        content: `${model.content ?? ''}\nThời gian: ${new Date(
          model.startDate,
        ).toLocaleString()} - ${new Date(model.endDate).toLocaleString()}`,
        is_read: false,
        created_at: new Date(),
        eventId: eventData.id ?? 0,
      }),
    );

    await Promise.all(notificationPromises);

    return eventData as CreateEventResponse;
  }

  async updateEvent(eventId: number, model: UpdateEventRequest): Promise<void> {
    const toUTC = (date: any) => {
      const d = new Date(date);
      return new Date(
        d.getTime() - d.getTimezoneOffset() * 60000,
      ).toISOString();
    };
    const { error } = await supabaseAdmin
      .from('events')
      .update({
        title: model.title ? model.title : 'No Title',
        content: model.content ? model.content : 'No Content',
        startDate: model.startDate ? toUTC(model.startDate) : new Date(),
        endDate: model.endDate ? toUTC(model.endDate) : new Date(),
      })
      .eq('id', eventId);

    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }

    if (model.invitees && model.invitees.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('attendences')
        .delete()
        .eq('eventId', eventId);
      if (deleteError) {
        throw new InternalServerErrorException(
          'Internal Server Error: ' + deleteError.message,
        );
      }
      const attendances = model.invitees.map((userId) => ({
        userid: userId,
        eventId: eventId,
        status: false,
        created_at: new Date().toISOString(),
        update_at: new Date().toISOString(),
      }));
      const { error: inviteError } = await supabaseAdmin
        .from('attendences')
        .insert(attendances);
      if (inviteError) {
        throw new InternalServerErrorException(
          'Internal Server Error: ' + inviteError.message,
        );
      }
    }
  }
  async deleteEvent(eventId: number): Promise<void> {
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', eventId);
    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }
  }

  async rsvpEvent(
    eventId: number,
    userId: string,
    status: boolean,
  ): Promise<void> {
    const { error } = await supabaseAdmin
      .from('attendences')
      .update({
        status: status,
        joined_at: status ? new Date() : null,
        update_at: new Date(),
      })
      .eq('eventId', eventId)
      .eq('userid', userId);
    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }
  }
}
