import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { ProjectsService } from 'src/modules/projects/projects.service';

class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}

class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async list(@Query('page') page = '1', @Query('perpage') perpage = '10', @Query('status') status?: string, @Query('search') search?: string) {
    return this.projectsService.list(Number(page), Number(perpage), { status, search });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.projectsService.detail(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() payload: CreateProjectDto) {
    return this.projectsService.create(payload);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateProjectDto) {
    return this.projectsService.update(id, payload);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // FEED
  @Get(':id/updates')
  async listUpdates(@Param('id') id: string) {
    return this.projectsService.listUpdates(id);
  }

  @Post(':id/updates')
  async createUpdate(@Param('id') id: string, @Req() req: any, @Body() payload: { title: string; content: string }) {
    const authorId = req?.user?.sub;
    return this.projectsService.createUpdate(id, authorId, payload);
  }

  // STATUS (PM/Owner)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Req() req: any, @Body() payload: { status: string }) {
    const userId = req?.user?.sub;
    return this.projectsService.updateStatus(id, userId, payload.status);
  }
}


