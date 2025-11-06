import apiClient from '../client';

const BASE = "/api/v1/meetings";

//Listar Calendars
export async function getAllMeetings() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Calendar
export async function getMeetingById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Criar Calendar -- sendCalendarDTO
export async function createMeeting(data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Inserir id no endpoint da Autenticação
//Atualizar Calendar -- indexAccountDTO
export async function updateMeeting(id: number) {
  return (await apiClient.put(`${BASE}/${id}`)).data;
}

//Remove Calendar
export async function removeMeeting(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}
