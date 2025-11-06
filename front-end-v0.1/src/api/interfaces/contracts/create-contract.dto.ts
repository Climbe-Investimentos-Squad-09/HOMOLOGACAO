export enum StatusContrato {
  Ativo = 'Ativo',
  Encerrado = 'Encerrado',
  Rescindido = 'Rescindido',
}
export interface CreateContractDto {
  idProposta: number;

  idCompliance?: number;

  statusContrato?: StatusContrato;

  dataEncerramento?: string;
}
