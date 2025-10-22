import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    const user = request.user;
    if (!user?.id) throw new ForbiddenException('Unauthorized');
    if (Number(user.role_id) !== 1) throw new ForbiddenException('Admin only');
    return true;
  }
}