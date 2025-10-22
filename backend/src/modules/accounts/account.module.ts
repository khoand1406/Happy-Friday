import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountsController } from './account.controller';
import { AccountService } from './account.service';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { UserEntity } from 'src/modules/user/user.entity';
import { DepartmentEntity } from '../department/department.entity';
import { DepartmentTransferEntity } from '../department/departmenttransfer.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([
    UserEntity,
    DepartmentEntity,
    DepartmentTransferEntity
  ])],
  controllers: [AccountsController],
  providers: [AccountService, AdminGuard],
  exports: [AccountService],
})
export class AccountsModule {}


