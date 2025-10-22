import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guard/auth.guard";
import { NotificationServices } from "./notification.service";

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController{
    constructor(private readonly NotiService: NotificationServices){}
    @Get('/')
    async GetNotification(@Req() req){
        const userId= req.user.sub;
        const result= await this.NotiService.getNotification(userId);
        return result;
    }

}