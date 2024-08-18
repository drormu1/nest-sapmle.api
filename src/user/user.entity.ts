import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Meeting } from '../meeting/meeting.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Meeting, meeting => meeting.user)
    meetings: Meeting[];
}