import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';
import { AccountsService } from './account.service';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { AdminGuard } from 'src/common/guard/admin.guard';

class CreateAccountDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  role_id?: number;

  @IsOptional()
  @IsNumber()
  department_id?: number;
}

class UpdateAccountDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  role_id?: number;

  @IsOptional()
  @IsNumber()
  department_id?: number;
}

class ResetPasswordDto {
  newPassword: string;
}

class UpdateByEmailDto extends UpdateAccountDto {
  @IsEmail()
  email: string;
}

class ScheduleTransferDto {
  @IsString()
  user_id: string;

  @IsNumber()
  to_department_id: number;

  @IsString()
  effective_date: string; // ISO string
}

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async list(@Query('page') page = '1', @Query('perpage') perpage = '10') {
    return this.accountsService.list(Number(page), Number(perpage));
  }

  @Post()
  async create(@Body() payload: CreateAccountDto) {
    return this.accountsService.create(payload);
  }

  @Patch('by-email')
  async updateByEmail(@Body() payload: UpdateByEmailDto) {
    return this.accountsService.updateByEmail(payload.email, payload);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateAccountDto) {
    return this.accountsService.update(id, payload);
  }


  @Post(':id/disable')
  async disable(@Param('id') id: string) {
    return this.accountsService.disable(id);
  }

  @Post(':id/enable')
  async enable(@Param('id') id: string) {
    return this.accountsService.enable(id);
  }

  @Post(':id/ban')
  async banForDuration(@Param('id') id: string, @Body('hours') hours: number) {
    return this.accountsService.banWithDuration(id, Number(hours));
  }

  @Post(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Body() body: ResetPasswordDto) {
    return this.accountsService.resetPassword(id, body.newPassword);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }

  @Post('import')
  async importAccounts(@Body() payload: { accounts: CreateAccountDto[] }) {
    return this.accountsService.importAccounts(payload.accounts);
  }

  // Department transfer scheduling
  @Post('transfer/schedule')
  async scheduleDepartmentTransfer(@Body() payload: ScheduleTransferDto) {
    return this.accountsService.scheduleDepartmentTransfer(
      payload.user_id,
      Number(payload.to_department_id),
      payload.effective_date,
    );
  }

  @Post('transfer/apply-due')
  async applyDueTransfers() {
    return this.accountsService.applyDueDepartmentTransfers();
  }
}





