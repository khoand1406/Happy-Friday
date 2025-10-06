import { Module } from '@nestjs/common';
import { AccountsController } from './account.controller';
import { AccountsService } from './account.service';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from 'src/common/guard/admin.guard';

@Module({
  imports: [AuthModule],
  controllers: [AccountsController],
  providers: [AccountsService, AdminGuard],
  exports: [AccountsService],
})
export class AccountsModule {}


