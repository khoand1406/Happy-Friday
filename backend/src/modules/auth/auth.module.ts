import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './stragegies/jwt.strategy';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/user.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: (() => {
          const s = config.get<string>('JWT_SECRET');
          console.log('[AuthModule] JWT_SECRET loaded?', !!s);
          return s ?? '';
        })(),
        signOptions: { expiresIn: '1d' }
      })
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}