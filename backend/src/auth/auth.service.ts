import { Injectable, UnauthorizedException } from "@nestjs/common";
import { supabase } from "src/config/database.config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly JWTService: JwtService){}
    
    async validateUser(email: string, password: string){
        const {error, data}= await supabase.auth.signInWithPassword({
            email,
            password
        })
        if(error || !data.user){
            throw new UnauthorizedException("Invalid Credentials")
        }
        return data.user;
    }

    async getAuthenticated(user: any){
        const payload= {sub: user.id};
        return {
            access_token: this.JWTService.sign(payload),
            user
        }
    }
}