import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";

@Module({
    imports: [AuthModule],
    providers: [EventService],
    controllers: [EventController],
    exports: [EventService]
})
export class EventModule{}