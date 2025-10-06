import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModules } from './modules/user/user.module';
import { DepartmentModule } from './modules/department/department.module';
import { AccountsModule } from './modules/accounts/account.module';

@Module({
  imports: [AuthModule, UserModules, DepartmentModule, AccountsModule],
})
export class AppModule {}
