import { Module } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { DepartmentService } from "./department.services";
import { DepartmentController } from "./department.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    providers: [DepartmentService],
    controllers: [DepartmentController],
    exports:[DepartmentService]
})
export class DepartmentModule {}