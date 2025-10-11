import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { supabaseAdmin } from 'src/config/database.config';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET ?? ''
        });
    }
    async validate(payload: any)  {
        const {data, error}= await supabaseAdmin.from('users').select('*').eq('id', payload.sub).single();
        if(error || !data){
            return null;
        }
        return data;
    }
}