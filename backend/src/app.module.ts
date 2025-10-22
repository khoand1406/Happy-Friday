import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModules } from './modules/user/user.module';
import { DepartmentModule } from './modules/department/department.module';
import { AccountsModule } from './modules/accounts/account.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'myapp',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      // Disable automatic schema synchronization in runtime to avoid unsafe ALTERs
      // Use migrations or manual schema updates instead.
      synchronize: false,
      logging: false,
    }),
    AuthModule, UserModules, DepartmentModule, AccountsModule, ProjectsModule,
  ],
})
export class AppModule {}