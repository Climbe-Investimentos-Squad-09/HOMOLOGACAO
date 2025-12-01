import { IsString } from 'class-validator';

export class SendEmailDTO {
    @IsString()
    toEmailAddress!: string;
    
    @IsString()
    messageSubject?: string;
    
    @IsString()
    bodyText?: string;
}