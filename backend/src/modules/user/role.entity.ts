import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'text' })
  role_name: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => UserEntity, user => user.role)
  users: UserEntity[];

}

