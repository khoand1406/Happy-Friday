import { Controller, Module } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { SearchController } from "./search.controller";
import { SearchServices } from "./search.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [SearchController],
    providers: [SearchServices],
    exports: [SearchServices]
})
    

export class SearchModule{}