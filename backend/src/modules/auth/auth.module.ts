
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './stragegies/jwt.strategy';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? '',
      signOptions: { expiresIn: '1d' }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})

export class AuthModule {}