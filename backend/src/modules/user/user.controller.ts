import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/common/guard/auth.guard";

@Controller('users')
export class UserController{
    constructor(private readonly userServices: UserService){
    }
    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getListUser(@Query('page') page= '1', @Query('perpage') perpage= '10'){
        const result= await this.userServices.getProfilesFull(Number(page), Number(perpage));
        return result;
    }
    @UseGuards(JwtAuthGuard)
    @Get('me/:userId')
    async getUserProfile(@Param('userId') userId: string){
        const result= await this.userServices.getUserProfile(userId);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile/:userId')
    async updateUserProfile(@Param('userId') userId: string, @Body() updatePayload: any){
        const result= await this.userServices.UpdateUserProfile(userId, updatePayload);
        return result;
    }
    

}