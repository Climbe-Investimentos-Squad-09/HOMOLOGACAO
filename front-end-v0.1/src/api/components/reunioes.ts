import apiClient from '../client';

import { AddParticipanteDto } from '../interfaces/reunioes/add-member.dto';
import { AddAtividadeDto } from '../interfaces/reunioes/add-activity.dto';
import { CreateReuniaoDto } from '../interfaces/reunioes/create-meeting.dto';
import { UpdateReuniaoDto } from '../interfaces/reunioes/update-meeting.dto';
import { UpdateParticipanteStatusDto } from '../interfaces/reunioes/update-member-status.dto';

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
export async function applyUserReuniao(id: number):Promise<AddParticipanteDto> {
  return (await apiClient.post(`${BASE}/${id}/participantes`, Promise)).data;
}

//Criar atividade vinculada à Reunião -- AddAtividadeDto
export async function applyActivityReuniao(id: number):Promise<AddAtividadeDto> {
  return (await apiClient.post(`${BASE}/atividades`, Promise)).data;
}

//Criar Reunião -- CreateReuniaoDto
export async function createReuniao():Promise<CreateReuniaoDto> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Atualizar Reunião -- UpdateReuniaoDto
export async function updateReuniao(id: number):Promise<UpdateReuniaoDto> {
  return (await apiClient.put(`${BASE}/${id}`, Promise)).data;
}

//Atualizar status de Participante -- UpdateParticipanteStatusDto
export async function updateUserReuniao(idParticipacao: number):Promise<UpdateParticipanteStatusDto> {
  return (await apiClient.put(`${BASE}/participantes/${idParticipacao}/status`, Promise)).data;
}

//Remove Reunião
export async function removeReuniao(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}