import { Module } from '@nestjs/common';
import { AccountsModule } from './modules/accounts/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { EventModule } from './modules/events/event.module';
import { InviteModule } from './modules/invites/invite.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ReminderModules } from './modules/reminders/reminder.module';
import { SearchModule } from './modules/search/search.module';
import { UserModules } from './modules/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModules,
    DepartmentModule,
    AccountsModule,
    EventModule,
    InviteModule,
    ProjectsModule,
    SearchModule,
    NotificationModule,
    ReminderModules
  ],
})
export class AppModule {}
