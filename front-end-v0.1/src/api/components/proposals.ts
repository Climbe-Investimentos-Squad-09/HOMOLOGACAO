import apiClient from '../client';

import { AssignProposalDto } from '../interfaces/proposals/assign-proposals.dto';
import { CreateProposalsDto } from '../interfaces/proposals/create-proposals.dto';
import { UpdateProposalsDto } from '../interfaces/proposals/update-proposals.dto';
import { UpdateProposalStatusDto } from '../interfaces/proposals/update-proposals-status.dto';

const BASE = "/api/proposals";

//Listar Propostas
export async function getAllProposals() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Proposta
export async function getProposalById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Atribuir usuário à Proposta -- AssignProposalDto
export async function applyUserProposal():Promise<AssignProposalDto> {
  return (await apiClient.post(`${BASE}/assign`, Promise)).data;
}

//Criar Proposta -- CreateProposalsDto
export async function createProposal():Promise<CreateProposalsDto> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Atualizar Proposta -- UpdateProposalsDto
export async function updateProposal(id: number):Promise<UpdateProposalsDto> {
  return (await apiClient.put(`${BASE}/${id}`, Promise)).data;
}

//Remove Proposta
export async function removeProposal(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}

//Alterar Status da proposta -- UpdateProposalStatusDto
export async function patchProposal(id: number):Promise<UpdateProposalStatusDto> {
  return (await apiClient.patch(`${BASE}/${id}/status`, Promise)).data;
}