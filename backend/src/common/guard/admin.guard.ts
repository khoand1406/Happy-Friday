import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { supabaseAdmin } from 'src/config/database.config';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;
    if (!user?.sub) {
      throw new ForbiddenException('Unauthorized');
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('role_id')
      .eq('id', user.sub)
      .single();

    if (error) {
      throw new ForbiddenException('Cannot verify role');
    }

    if (Number(data?.role_id) !== 1) {
      throw new ForbiddenException('Admin only');
    }

    return true;
  }
}


