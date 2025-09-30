import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing token from headers');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
      (request as any).user = payload;
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
