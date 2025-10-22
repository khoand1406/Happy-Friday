import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { DepartmentEntity } from '../department/department.entity';
import { RoleEntity } from './role.entity';
import { ProjectMemberEntity } from '../projects/projectmember.entity';
import { ProjectUpdateEntity } from '../projects/projectupdate.entity';


@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  password_hash: string | null;

  @Column({ type: 'text', nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  phone: string | null;

  @Column({ type: 'int', nullable: true })
  role_id: number | null;

  @Column({ type: 'int', nullable: true })
  department_id: number | null;

  @Column({ type: 'text', nullable: true })
  avatar_url: string | null;

  @Column({ type: 'boolean', default: false })
  is_disabled: boolean;

  @ManyToOne(() => DepartmentEntity, department => department.users) 
  // Nói cho TypeORM biết: 
  // bên DepartmentEntity có field users để nối quan hệ ngược lại với UserEntity
  @JoinColumn({ name: "department_id" })
  department: DepartmentEntity; // Một User thuộc về 1 Department
  
  @ManyToOne(() => RoleEntity, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @OneToMany(() => ProjectMemberEntity, member => member.user)
  projectMembers: ProjectMemberEntity[];

  @OneToMany(() => ProjectUpdateEntity, update => update.author)
  projectUpdates: ProjectUpdateEntity[];

}