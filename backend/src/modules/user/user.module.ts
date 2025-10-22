import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Module({
    imports:[AuthModule, TypeOrmModule.forFeature([
        UserEntity,
        RoleEntity
    ])],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})

export class UserModules{}