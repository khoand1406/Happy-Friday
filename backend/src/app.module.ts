import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModules } from './modules/user/user.module';
import { DepartmentModule } from './modules/department/department.module';
import { AccountsModule } from './modules/accounts/account.module';
import { EventModule } from './modules/events/event.module';
import { InviteModule } from './modules/invites/invite.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [AuthModule, UserModules, DepartmentModule, AccountsModule, EventModule, InviteModule,ProjectsModule ],
})
export class AppModule {}
