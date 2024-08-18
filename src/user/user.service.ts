import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Meeting } from '../meeting/meeting.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Meeting)
        private readonly meetingRepository: Repository<Meeting>,
    ) { }

    async create(email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ email, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }
kl
    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null; 
    }
    async getUserMeetings(userId: string): Promise<Meeting[]> {
        return this.meetingRepository.find({ where: { userId: Number(userId) } });
    }  
}
