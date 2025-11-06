export interface SendEmailDTO {
    toEmailAddress: string;
    
    messageSubject?: string;
    
    bodyText?: string;
}