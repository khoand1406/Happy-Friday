import { Module } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { DepartmentService } from "./department.services";
import { DepartmentController } from "./department.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { DepartmentEntity } from './department.entity';
import { DepartmentTransferEntity } from './departmenttransfer.entity';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([
        UserEntity,
        DepartmentEntity,
        DepartmentTransferEntity
    ])],
    providers: [DepartmentService],
    controllers: [DepartmentController],
    exports:[DepartmentService]
})
export class DepartmentModule {}