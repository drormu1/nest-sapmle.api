import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { Meeting } from './meeting.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('meetings')
export class MeetingController {
    constructor(private readonly meetingService: MeetingService) { }

    @Get()
    findAll(): Promise<Meeting[]> {
        return this.meetingService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Meeting> {
        return this.meetingService.findOne(id);

    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() meeting: Meeting, @Request() req): Promise<Meeting> {
        console.log('req.user', req.user);
        console.log('meeting', meeting);
        meeting.userId = req.user.userId;
        return this.meetingService.create(meeting);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() meeting: Meeting, @Request() req): Promise<void> {
        console.log(req.user);
        //meeting.userId = req.user.id;
        return this.meetingService.update(id, meeting);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.meetingService.remove(id);
    }
}
