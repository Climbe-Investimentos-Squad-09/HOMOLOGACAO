import apiClient from '../client';

const BASE = "/api/v1/Reuniaos";

//Listar Reuniões
export async function getAllReuniaos() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Reunião
export async function getReuniaoById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Convidar usuário à Reunião -- AddParticipanteDto
export async function applyUserReuniao(id: number, data: any) {
  return (await apiClient.post(`${BASE}/${id}/participantes`, data)).data;
}

//Criar atividade vinculada à Reunião -- AddAtividadeDto
export async function applyActivityReuniao(id: number, data: any) {
  return (await apiClient.post(`${BASE}/atividades`, data)).data;
}

//Criar Reunião -- CreateReuniaoDto
export async function createReuniao(data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Atualizar Reunião -- UpdateReuniaoDto
export async function updateReuniao(id: number) {
  return (await apiClient.put(`${BASE}/${id}`)).data;
}

//Atualizar status de Participante -- UpdateParticipanteStatusDto
export async function updateUserReuniao(idParticipacao: number) {
  return (await apiClient.put(`${BASE}/participantes/${idParticipacao}/status`)).data;
}

//Remove Reunião
export async function removeReuniao(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}