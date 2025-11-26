import {IsString, IsDate, IsBoolean } from 'class-validator';
import {Type} from 'class-transformer';

export  class sendCalendarDTO{
    @IsString()
    titulo!: string; 
    
    @IsString()
    empresa_id!: string;
    
    @Type(() => Date)
    @IsDate()
    data!: Date; 
    
    @IsString()
    hora!: string; 
    
    @IsBoolean()
    presencial!: boolean;
    
    @IsString()
    local!: string;
    
    @IsString()
    pauta!: string;
}