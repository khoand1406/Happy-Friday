import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/user.entity';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
    constructor(
      @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
    ){
        super({
            jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET ?? ''
        });
    }
    async validate(payload: any)  {
        const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
        if(!user || user.is_disabled){
            return null;
        }
        return user;
    }
}