// src/modules/contracts/dtos/update-contract.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateContractDto } from './create-contract.dto';

// Não permite trocar idProposta (1:1) nem status por aqui
export class UpdateContractDto extends PartialType(CreateContractDto) {}
