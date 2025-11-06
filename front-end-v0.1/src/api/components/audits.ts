import apiClient from '../client';

const BASE = "/api/audits";

//Listar Auditorias
export async function getAllAudits() {
  return (await apiClient.get(BASE)).data;
}
