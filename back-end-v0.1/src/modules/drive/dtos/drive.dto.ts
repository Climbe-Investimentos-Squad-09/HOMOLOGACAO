import { IsString } from 'class-validator';

export class SendDriveDTO {
    @IsString()
    name!: string;
    
    @IsString()
    arquivo!: string; 
    
    @IsString()
    tipo_documento!: string;
    
    @IsString()
    empresa_id!: string;
}