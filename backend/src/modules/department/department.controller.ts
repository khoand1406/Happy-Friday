import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.services';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';

@Controller('/departments')
export class DepartmentController {
  constructor(private readonly DepartmentService: DepartmentService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getDepartments() {
    const response = await this.DepartmentService.getDepartment();
    return response;
  }

  @Get('/:id')
  async GetDepartment(@Param('id') id: number) {
    const response = await this.DepartmentService.getDepartmentRes(id);
    return response;
  }
}
