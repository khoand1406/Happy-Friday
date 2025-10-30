import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReminderServices } from './reminder.service';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderServices) {}

  @Post()
  async create(
    @Body('eventId') eventId: number,
    @Body('remindAt') remindAt: string,
    @Body('method') method: string,
    @Req() req
  ) {
    const user_id= req.user.sub;
    if(!user_id){
        return UnauthorizedException;
    }
    return this.reminderService.createReminder(
      eventId,
      new Date(remindAt),
      method,
      user_id,
    );
  }

  @Get('event/:eventId')
  async getByEvent(@Param('eventId') eventId: string) {
    return this.reminderService.getRemindersByEvent(eventId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reminderService.deleteReminder(id);
  }
}
