import apiClient from '../client';

import { AssignContractDto } from '../interfaces/contracts/assign-contract.dto';
import { AssignManyContractDto } from '../interfaces/contracts/assign-contract.dto';
import { CreateContractDto } from '../interfaces/contracts/create-contract.dto';
import { UpdateContractDto } from '../interfaces/contracts/update-contract.dto';
import { UpdateContractStatusDto } from '../interfaces/contracts/update-contract-status.dto';

const BASE = "/api/contracts";

//Listar Contratos
export async function getAllContracts() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Contrato
export async function getContractById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Atribuir usuário ao Contrato -- AssignContractDto
export async function applyUserContract():Promise<AssignContractDto> {
  return (await apiClient.post(`${BASE}/assign`, Promise)).data;
}

//Atribuir vários usuários ao Contrato -- AssignManyContractDto
export async function applyBulkUserContract():Promise<AssignManyContractDto> {
  return (await apiClient.post(`${BASE}/assign/bulk`, Promise)).data;
}

//Criar Contrato -- CreateContractDto
export async function createContract():Promise<CreateContractDto> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Atualizar Contrato -- UpdateContractDto
export async function updateContract(id: number):Promise<UpdateContractDto> {
  return (await apiClient.put(`${BASE}/${id}`, Promise)).data;
}

//Remove Contrato
export async function removeContract(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}

//Alterar Status da Contrato (Encerrar/Rescindir) -- UpdateContractStatusDto
export async function patchContract(id: number):Promise<UpdateContractStatusDto> {
  return (await apiClient.patch(`${BASE}/${id}/status`, Promise)).data;
}