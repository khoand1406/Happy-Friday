import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateEventRequest,
  CreateEventResponse,
  EventDetailResponse,
  EventResponse,
  UpdateEventRequest,
} from './dto/event.dto';
import { supabaseAdmin } from 'src/config/database.config';

@Injectable()
export class EventService {
  async getEvents(userId: string, startDate: Date, endDate: Date): Promise<EventResponse[]> {
    const { data, error } = await supabaseAdmin
      .rpc("get_user_events", {uid: userId, start_d: new Date(startDate).toISOString(), end_d: new Date(endDate).toISOString()})
    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }
    return data as EventResponse[];
  }
  async getIncomingEvents(): Promise<EventResponse[]> {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .gte('startDate', new Date().toISOString());
    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }
    return data as EventResponse[];
  }

  async getPastEvents(): Promise<EventResponse[]> {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .lt('endDate', new Date().toISOString());
    if (error) {
      throw new InternalServerErrorException(
        'Internal Server Error: ' + error.message,
      );
    }
    return data as EventResponse[];
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
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
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

      const attendancesPayload= [...model.invitees, model.creatorId];
      
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
    

    return eventData as CreateEventResponse;
  }

  async updateEvent(eventId: number, model: UpdateEventRequest): Promise<void> {
    const toUTC = (date: any) => {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
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
