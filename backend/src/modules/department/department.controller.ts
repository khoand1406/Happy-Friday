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

  @Get('/list')
  async GetDepartmentList(){
    const response= await this.DepartmentService.getDepartmentList()
    return response;
  }
  

  
}
