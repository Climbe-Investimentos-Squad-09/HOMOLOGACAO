import apiClient from '../client';

const BASE = "/api/v1/contracts";

//Listar Contratos
export async function getAllContracts() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Contrato
export async function getContractById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Atribuir usuário ao Contrato -- AssignContractDto
export async function applyUserContract(data: any) {
  return (await apiClient.post(`${BASE}/assign`, data)).data;
}

//Atribuir vários usuários ao Contrato -- AssignManyContractDto
export async function applyBulkUserContract(data: any) {
  return (await apiClient.post(`${BASE}/assign/bulk`, data)).data;
}

//Criar Contrato -- CreateContractDto
export async function createContract(data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Atualizar Contrato -- UpdateContractDto
export async function updateContract(id: number) {
  return (await apiClient.put(`${BASE}/${id}`)).data;
}

//Remove Contrato
export async function removeContract(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}

//Alterar Status da Contrato (Encerrar/Rescindir) -- UpdateContractStatusDto
export async function patchContract(id: number) {
  return (await apiClient.patch(`${BASE}/${id}/status`)).data;
}