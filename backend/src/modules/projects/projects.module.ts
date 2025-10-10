import { Module } from '@nestjs/common';
import { ProjectsService } from 'src/modules/projects/projects.service';
import { ProjectsController } from 'src/modules/projects/projects.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}


