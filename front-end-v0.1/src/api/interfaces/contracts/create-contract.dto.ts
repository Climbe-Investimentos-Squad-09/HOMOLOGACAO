import { StatusContrato } from '../entities/contracts.entity';

export interface CreateContractDto {
  idProposta: number;

  idCompliance?: number;

  statusContrato?: StatusContrato;

  dataEncerramento?: string;
}
