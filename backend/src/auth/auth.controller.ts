import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./dto/auth.dto";

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){
    }

    @Post('login')
    async login(@Body() request: LoginRequestDto ){
        const user= await this.authService.validateUser(request.email, request.password)
        return this.authService.getAuthenticated(user);
    }
}