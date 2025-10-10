import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import * as eventDto from './dto/event.dto';
import { STATUS_CODES } from 'http';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/')
  async getEvents(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    const response = await this.eventService.getEvents(startDate, endDate);
    return response;
  }
  @Get('/:eventId')
  async getEvent(@Param('eventId') eventId: string) {
    const response = await this.eventService.getDetailEvent(Number(eventId));
    return response;
  }

  @Get('/incoming')
  async getIncomingEvents() {
    const response = await this.eventService.getIncomingEvents();
    return response;
  }

  @Get('/past')
  async getPastEvents() {
    const response = await this.eventService.getPastEvents();
    return response;
  }

  @Post('/create')
  async createEvent(@Body() req: eventDto.CreateEventRequest, @Req() re) {
    const userId = re.user.sub;
    const payload = {
      title: req.title,
      content: req.content,
      startDate: req.startDate,
      endDate: req.endDate,
      creatorId: userId,
      invitees: req.invitees,
    } as eventDto.CreateEventRequest;
    const response = await this.eventService.createEvent(payload);
    return response;
  }

  @Patch('/update/:eventId')
  async updateEvent(
    @Param('eventId') eventId: number,
    @Body() req: eventDto.UpdateEventRequest,
  ) {
    await this.eventService.updateEvent(eventId, req);
    return { statusCode: HttpStatus.OK, message: 'Success' };
  }

  @Delete('/delete/:eventId')
  async deleteEvent(@Param('eventId') eventId: number) {
    const response = await this.eventService.deleteEvent(eventId);
    return { statusCode: HttpStatus.OK, message: 'Success' };
  }

  @Patch('/accept/:eventId')
  async acceptEvent(@Param('eventId') eventId: number, @Req() req) {
    const userId = req.user.sub;
    await this.eventService.rsvpEvent(eventId, userId, true);
    return { statusCode: HttpStatus.OK, message: 'Success' };
  }

  @Patch('/reject/:eventId')
  async rejectEvent(@Param('eventId') eventId: number, @Req() req) {
    const user_id = req.user?.userId.toString();
    await this.eventService.rsvpEvent(eventId, user_id, false);
    return { statusCode: HttpStatus.OK, message: 'Success' };
  }
}
