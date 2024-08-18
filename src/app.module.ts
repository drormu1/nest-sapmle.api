import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MeetingModule } from './meeting/meeting.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 1433,
      username: process.env.DB_USERNAME || 'sa',
      password: process.env.DB_PASSWORD || 'Password_01',
      database: process.env.DB_DATABASE || 'meetings',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      options: { encrypt: false, useUTC: true },
    }),
    UserModule,
    AuthModule,
    MeetingModule,
  ],
})
export class AppModule { }
