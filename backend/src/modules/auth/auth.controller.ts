import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, OauthLoginRequest } from './dto/auth.dto';
import { use } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginRequestDto) {
    const user = await this.authService.validateUser(
      request.email,
      request.password,
    );
    return this.authService.getAuthenticated(user);
  }

  @Post('supabase')
  async supabaseLogin(@Body() user: OauthLoginRequest){
    console.log('aaaaaaa'+ user.id + user.name)
    return this.authService.handleSupabaseReq(user);
  }
}
