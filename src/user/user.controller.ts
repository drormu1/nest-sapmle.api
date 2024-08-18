import { Controller, Post, Body, UseGuards, Request, Param, Get,Inject } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,       
    ) { }

    @Post('signup')
    async signup(@Body() body: { email: string; password: string }) {
        return this.userService.create(body.email, body.password);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.userService.validateUser(body.email, body.password);
        if (user) {
            return this.authService.login(user);
        }
        return { message: 'Invalid credentials' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
        return req.user;
    }



    @UseGuards(JwtAuthGuard)
    @Get(':id/meetings')
    getUserMeetings(@Param('id') id: string) {
        return this.userService.getUserMeetings(id);
    }
}
