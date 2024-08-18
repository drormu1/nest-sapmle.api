import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class MeetingService {
    constructor(
        @InjectRepository(Meeting)
        private readonly meetingRepository: Repository<Meeting>,
    ) { }

    findAll(): Promise<Meeting[]> {
        return this.meetingRepository.find({ relations: ['user'] });
    }

    findOne(id: number): Promise<Meeting> {
        return this.meetingRepository.findOne({ where: { id }, relations: ['user'] });
    }

    create(meeting: Meeting): Promise<Meeting> {
        console.log('meeting:', meeting);
        return this.meetingRepository.save(meeting);
    }

    async update(id: number, meeting: Meeting): Promise<void> {
        await this.meetingRepository.update(id, meeting);
    }

    async remove(id: number): Promise<void> {
        await this.meetingRepository.delete(id);
    }
}
