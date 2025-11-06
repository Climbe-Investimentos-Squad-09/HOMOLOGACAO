export enum StatusContrato {
  Ativo = 'Ativo',
  Encerrado = 'Encerrado',
  Rescindido = 'Rescindido',
}
export interface UpdateContractStatusDto {
  statusContrato: StatusContrato;

  dataEncerramento?: string;
}
