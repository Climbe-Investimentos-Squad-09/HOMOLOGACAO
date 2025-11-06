import apiClient from '../client';

const BASE = "/api/v1/audits";

//Listar Auditorias
export async function getAllAudits() {
  return (await apiClient.get(BASE)).data;
}
