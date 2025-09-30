import { Body, Controller, Get, NotFoundException, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/common/guard/auth.guard";
import { UserProfileResponse } from "./dto/profile.dto";

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
    @Get('me/')
    async getUserProfile(@Req() req){
        const user= req.user;
        if(!user){
            return new NotFoundException("User not found");
        }
        
        const userId= user.sub;
        const result= await this.userServices.getUserProfile(userId);
        return result as UserProfileResponse;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me/:userId')
    async updateUserProfile(@Param('userId') userId: string, @Body() updatePayload: any){
        const result= await this.userServices.UpdateUserProfile(userId, updatePayload);
        return result;
    }
    

}