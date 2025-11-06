import apiClient from '../client';

import { sendCalendarDTO } from '../interfaces/calendar/calendar.dto';
import { indexAccountDTO } from '../interfaces/calendar/indexAccounts.dto';

const BASE = "/api/meetings";

//Listar Calendars
export async function getAllMeetings() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Calendar
export async function getMeetingById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Criar Calendar -- sendCalendarDTO
export async function createMeeting():Promise<sendCalendarDTO> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Inserir id no endpoint da Autenticação
//Atualizar Calendar -- indexAccountDTO
export async function updateMeeting(id: number):Promise<indexAccountDTO> {
  return (await apiClient.put(`${BASE}/${id}`, Promise)).data;
}

//Remove Calendar
export async function removeMeeting(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}
