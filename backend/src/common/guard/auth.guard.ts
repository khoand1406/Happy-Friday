import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing token from headers');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
      const userId = (payload as any)?.sub;
      if (!userId) throw new UnauthorizedException('Invalid token payload');
      const user = await this.usersRepo.findOne({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('User not found');
      (request as any).user = user;
      return true;
    } catch (error) {
      console.error('JWT verify error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authToken = request.headers['authorization'];
    return authToken && authToken.split(' ')[1];
  }
}
