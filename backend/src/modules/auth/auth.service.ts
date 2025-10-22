import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/modules/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    console.log('[Auth] login attempt email=', email, 'found user id=', user?.id);
    if (!user) throw new UnauthorizedException('Wrong email or password');
    if (user.is_disabled) throw new ForbiddenException('Account disabled');
    const ok = user.password_hash ? await bcrypt.compare(password, user.password_hash) : false;
    console.log('[Auth] compare result=', ok);
    if (!ok) throw new UnauthorizedException('Wrong email or password');
    return user;
  }

  async getAuthenticated(user: any) {
    const payload = { sub: user.id };
    return { access_token: this.JWTService.sign(payload), user };
  }
}