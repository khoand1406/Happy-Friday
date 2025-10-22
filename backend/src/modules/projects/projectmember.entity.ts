import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'project_members' })
export class ProjectMemberEntity {
  // Composite key (project_id + user_id); no single auto id column exists in DB
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  project_id: string;

  @Column({ type: 'text' })
  project_role: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'joined_at' })
  joined_at: Date;

  @ManyToOne(() => UserEntity, user => user.projectMembers)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, project => project.members)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}