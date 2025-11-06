export enum ContractAssigneeRoleDto {
  ANALISTA = 'ANALISTA',
  CSO = 'CSO',
  CMO = 'CMO',
}

export interface AssignContractDto {
  idUsuario: number;

  role: ContractAssigneeRoleDto;
}

export interface AssignManyContractDto {
  items: AssignContractDto[];

  replaceExisting?: boolean;
}
