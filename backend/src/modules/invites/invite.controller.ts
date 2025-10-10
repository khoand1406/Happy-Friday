import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { InviteService } from "./invite.services";
import { JwtAuthGuard } from "src/common/guard/auth.guard";


@Controller('invite')
@UseGuards(JwtAuthGuard)
export class InviteController{
    constructor(private readonly inviteService: InviteService){}

    @Get('/')
    async getInvite(@Req() req){
        const userId= req.user.sub;
        const response= await this.inviteService.getInvites(userId);
        return response;
    }
    
}