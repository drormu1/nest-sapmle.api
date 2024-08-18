import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MeetingModule } from '../meeting/meeting.module';
import { Meeting } from 'src/meeting/meeting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Meeting]),
    forwardRef(() => AuthModule),
    forwardRef(() => MeetingModule), // Import AuthModule
  ],
  providers: [UserService], 
  controllers: [UserController],
  exports: [UserService], // Export UserService if needed in other modules
})
export class UserModule { }