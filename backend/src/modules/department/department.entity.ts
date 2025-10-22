import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DepartmentTransferEntity } from './departmenttransfer.entity';

@Entity({name: 'department'})
export class DepartmentEntity {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({type:'text'})
    name: string

    @OneToMany(() => UserEntity, user => user.department)
    // Nói cho TypeORM biết: 
    // bên UserEntity có field department để nối quan hệ ngược lại với DepartmentEntity
    users: UserEntity[] // Một Department có nhiều User
    

    @OneToMany(() => DepartmentTransferEntity, transfer => transfer.fromDepartment)
    fromTransfers: DepartmentTransferEntity[];

    @OneToMany(() => DepartmentTransferEntity, transfer => transfer.toDepartment)
    toTransfers: DepartmentTransferEntity[];

}