import {IsArray, IsString } from 'class-validator';

export  class indexAccountDTO{
    @IsString()
    calendarId!: string;
    
    @IsString()
    eventId!: string;
    
    @IsArray()
    novosParticipantes!: []
}