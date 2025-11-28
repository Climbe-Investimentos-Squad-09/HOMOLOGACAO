// src/modules/user/dtos/update-user.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'João da Silva', required: false })
  @IsOptional() @IsString() nomeCompleto?: string;

  @ApiProperty({ example: '(11) 98888-8888', required: false })
  @IsOptional() @IsString() contato?: string;

  @ApiProperty({ example: 'novoemail@exemplo.com', required: false })
  @IsOptional() @IsEmail() email?: string;

  @ApiProperty({ example: '12345678900', required: false })
  @IsOptional() @IsString() cpf?: string;

  @ApiProperty({ example: 'novasenha123', required: false })
  @IsOptional() @IsString() @MinLength(6) senha?: string;
}
