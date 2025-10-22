import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DepartmentEntity } from './department.entity';

@Entity({ name: 'department_transfers' })
export class DepartmentTransferEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'int', nullable: true })
  from_department_id: number | null;

  @Column({ type: 'int' })
  to_department_id: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  effective_date: Date | null;

  @Column({ type: 'text', default: 'scheduled' })
  status: string;

  // Relationships
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => DepartmentEntity, department => department.fromTransfers)
  @JoinColumn({ name: 'from_department_id' })
  fromDepartment: DepartmentEntity;

  @ManyToOne(() => DepartmentEntity, department => department.toTransfers)
  @JoinColumn({ name: 'to_department_id' })
  toDepartment: DepartmentEntity;
}