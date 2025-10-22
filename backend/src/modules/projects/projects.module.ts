import { Module } from '@nestjs/common';
import { ProjectService } from 'src/modules/projects/projects.service';
import { ProjectsController } from 'src/modules/projects/projects.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from './project.entity';
import { ProjectMemberEntity } from './projectmember.entity';
import { ProjectUpdateEntity } from './projectupdate.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectMemberEntity, ProjectUpdateEntity])],
  controllers: [ProjectsController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectsModule {}


