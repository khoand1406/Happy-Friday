import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModules } from './modules/user/user.module';

@Module({
  imports: [AuthModule, UserModules],
})
export class AppModule {}
