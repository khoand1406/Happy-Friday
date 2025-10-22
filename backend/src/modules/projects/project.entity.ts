import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { ProjectMemberEntity } from './projectmember.entity';
import { ProjectUpdateEntity } from './projectupdate.entity';

@Entity({ name: 'projects' })
export class ProjectEntity {
  // In DB, id is uuid
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'date', nullable: true })
  start_date: Date | null;

  @Column({ type: 'date', nullable: true })
  end_date: Date | null;

  @Column({ type: 'varchar', length: 36, unique: true, nullable: true })
  uuid: string | null;

  // Relationships
  @OneToMany(() => ProjectMemberEntity, member => member.project)
  members: ProjectMemberEntity[];

  @OneToMany(() => ProjectUpdateEntity, update => update.project)
  updates: ProjectUpdateEntity[];
}