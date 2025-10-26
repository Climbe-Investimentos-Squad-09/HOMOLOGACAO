import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: "Email do usuário",
    example: "usuario@exemplo.com",
  })
  @IsEmail({}, { message: "Email deve ter um formato válido" })
  email!: string;

  @ApiProperty({
    description: "Senha do usuário",
    example: "senha123",
    minLength: 6,
  })
  @IsString({ message: "Senha deve ser uma string" })
  @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  senha!: string;
}

export class RegisterDto {
  @ApiProperty({
    description: "Email do usuário",
    example: "usuario@exemplo.com",
  })
  @IsEmail({}, { message: "Email deve ter um formato válido" })
  email!: string;

  @ApiProperty({
    description: "Nome completo do usuário",
    example: "João Silva",
  })
  @IsString({ message: "Nome deve ser uma string" })
  nome!: string;

  @ApiProperty({
    description: "Senha do usuário",
    example: "senha123",
    minLength: 6,
  })
  @IsString({ message: "Senha deve ser uma string" })
  @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  senha!: string;

  @ApiProperty({
    description:
      "ID do cargo do usuário (opcional - será null se não informado)",
    example: 1,
    required: false,
  })
  @IsOptional()
  idCargo?: number;
}
