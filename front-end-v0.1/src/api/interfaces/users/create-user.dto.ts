export interface CreateUserDto {
  nomeCompleto: string;

  cpf?: string;

  email: string;

  contato?: string;

  senha?: string; // pode ser omitida em OAuth

  idCargo?: number;
}
