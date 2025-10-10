import { Module } from "@nestjs/common";
import { InviteService } from "./invite.services";
import { InviteController } from "./invite.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    providers: [InviteService],
    controllers: [InviteController],
    exports: [InviteService]
})
export class InviteModule{
}