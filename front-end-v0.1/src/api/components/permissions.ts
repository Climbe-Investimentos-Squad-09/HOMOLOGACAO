import apiClient from '../client';

const BASE = "/api/v1/permissions";

//Listar Permissões
export async function getAllPermissions() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Permissão
export async function getPermissionById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Criar Permissões em lote (ignora existentes) -- BulkCreatePermissionDto
export async function createBulkPermissions(data: any) {
  return (await apiClient.post(`${BASE}/bulk`, data)).data;
}

//Criar Permissão -- CreatePermissionDto
export async function createPermission(id: number, data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Atualizar Permissão -- UpdatePermissionDto
export async function updatePermission(id: number) {
  return (await apiClient.put(`${BASE}/${id}`)).data;
}

//Remove permissão
export async function removePermission(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}