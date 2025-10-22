import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'project_updates' })
export class ProjectUpdateEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid' })
  project_id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'uuid', nullable: true })
  author_id: string | null;

  @ManyToOne(() => ProjectEntity, project => project.updates)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, user => user.projectUpdates)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}