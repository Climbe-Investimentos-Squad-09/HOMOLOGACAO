import { StatusContrato } from '../entities/contracts.entity';

export interface UpdateContractStatusDto {
  statusContrato: StatusContrato;

  dataEncerramento?: string;
}
