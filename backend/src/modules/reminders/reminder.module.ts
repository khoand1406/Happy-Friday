import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ReminderServices } from "./reminder.service";
import { ReminderController } from "./reminder.controller";

@Module({
    imports: [AuthModule],
    providers: [ReminderServices],
    controllers: [ReminderController],
    exports: [ReminderServices]
})
export class ReminderModules{
}