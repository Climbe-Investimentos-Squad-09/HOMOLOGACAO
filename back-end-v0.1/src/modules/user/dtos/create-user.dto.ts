import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// export class LoginDto {
//   @ApiProperty({
//     description: "Email do usuário",
//     example: "usuario@exemplo.com",
//   })
//   @IsEmail({}, { message: "Email deve ter um formato válido" })
//   email!: string;

//   @ApiProperty({
//     description: "Senha do usuário",
//     example: "senha123",
//     minLength: 6,
//   })
//   @IsString({ message: "Senha deve ser uma string" })
//   @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
//   senha!: string;
// }

// export class RegisterDto {
//   @ApiProperty({
//     description: "Email do usuário",
//     example: "usuario@exemplo.com",
//   })
//   @IsEmail({}, { message: "Email deve ter um formato válido" })
//   email!: string;

//   @ApiProperty({
//     description: "Nome completo do usuário",
//     example: "João Silva",
//   })
//   @IsString({ message: "Nome deve ser uma string" })
//   nome!: string;

//   @ApiProperty({
//     description: "Senha do usuário",
//     example: "senha123",
//     minLength: 6,
//   })
//   @IsString({ message: "Senha deve ser uma string" })
//   @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
//   senha!: string;

//   @ApiProperty({
//     description: "ID do cargo do usuário",
//     example: 1,
//     required: false,
//   })
//   @IsOptional()
//   @IsNumber({}, { message: "ID do cargo deve ser um número" })
//   idCargo?: number;
// }

export class SendUserDTO {
  @ApiProperty({
    description: "Nome completo do usuário",
    example: "João Silva",
  })
  @IsString({ message: "Nome deve ser uma string" })
  nomeCompleto!: string;

  @ApiProperty({
    description: "Email do usuário",
    example: "usuario@exemplo.com",
  })
  @IsEmail({}, { message: "Email deve ter um formato válido" })
  email!: string;

  @ApiProperty({
    description: "ID do cargo do usuário",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: "ID do cargo deve ser um número" })
  idCargo?: number;
}
