import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { UpdateUserProfileDTO, UserProfileResponse } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpLoadToCloundinary } from '../upload/upload.service';
import { File as MulterFile } from 'multer';
import { ChangePasswordDto } from './dto/change_password.dto';


@Controller('users')
export class UserController {
  constructor(private readonly userServices: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getListUser(
  ) {
    const result = await this.userServices.getUsersList();
    return result;
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/')
  async getUserProfile(@Req() req) {
    const user = req.user;
    if (!user) {
      return new NotFoundException('User not found');
    }

    const userId = user.sub;
    const result = await this.userServices.getUserProfile(userId);
    return result as UserProfileResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/member-list/:depId')
  async getMemberbyDep(@Param('depId') depId){
    const result= await this.userServices.GetMembesrByDep(depId);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update_profile')
  @UseInterceptors(FileInterceptor('avatar_url'))
  async updateUserProfile(
    @Req() req,
    @Body() updatePayload: UpdateUserProfileDTO,
    @UploadedFile() file?: MulterFile,
  ) {
    const user = req.user;
    if (!user) {
      return new NotFoundException('User not found');
    }
    const userId = user.sub;
    let avatar_url: string | undefined;
    if (file) {
      avatar_url = await UpLoadToCloundinary(file.buffer, 'happy-friday');
    }

    const result = await this.userServices.UpdateUserProfile(userId, {
      ...updatePayload,
      avatar_url,
    });
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() payload: ChangePasswordDto){
    const result= await this.userServices.changePassword(payload);
    return result;
  }
}
