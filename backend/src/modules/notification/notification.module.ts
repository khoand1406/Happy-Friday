import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationServices } from "./notification.service";
import { NotificationController } from "./notification.controller";

@Module({
    imports: [AuthModule],
    providers: [NotificationServices],
    controllers: [NotificationController],
    exports: [NotificationServices]
})
export class NotificationModule{
}