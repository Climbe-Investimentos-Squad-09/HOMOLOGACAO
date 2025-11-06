import apiClient from '../client';

const BASE = "/api/v1/proposals";

//Listar Propostas
export async function getAllProposals() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Proposta
export async function getProposalById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Atribuir usuário à Proposta -- AssignProposalDto
export async function applyUserProposal(data: any) {
  return (await apiClient.post(`${BASE}/assign`, data)).data;
}

//Criar Proposta -- CreateProposalsDto
export async function createProposal(data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Atualizar Proposta -- UpdateProposalsDto
export async function updateProposal(id: number) {
  return (await apiClient.put(`${BASE}/${id}`)).data;
}

//Remove Proposta
export async function removeProposal(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}

//Alterar Status da proposta -- UpdateProposalStatusDto
export async function patchProposal(id: number) {
  return (await apiClient.patch(`${BASE}/${id}/status`)).data;
}