import { CreateContractDto } from './create-contract.dto';

// Não permite trocar idProposta (1:1) nem status por aqui
export interface UpdateContractDto extends Partial<CreateContractDto> {}
