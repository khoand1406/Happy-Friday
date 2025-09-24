import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { supabase } from 'src/config/database.config';

@Injectable()
export class AuthService {
  constructor(private readonly JWTService: JwtService) {}

  async validateUser(email: string, password: string) {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (
        error.status === 400 &&
        error.message.includes('Invalid login credentials')
      ) {
        throw new UnauthorizedException('Wrong email or password');
      }

      if (
        error.status === 400 &&
        error.message.includes('Email not confirmed')
      ) {
        throw new ForbiddenException('Email not confirmed');
      }

      throw new InternalServerErrorException('Internal Error' + error);
    }
    if (!data.user) {
      throw new UnauthorizedException('User not found');
    }

    return data.user;
  }

  async getAuthenticated(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.JWTService.sign(payload),
      user,
    };
  }
}
