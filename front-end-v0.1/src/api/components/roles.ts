import apiClient from '../client';

const BASE = "/api/v1/roles";

//Listar Papéis
export async function getAllRoles() {
  return (await apiClient.get(BASE)).data;
}

//Atribuir usuário ao Papel -- AssignPermissionDto
export async function applyUserRole(data: any) {
  return (await apiClient.post(`${BASE}/assign`, data)).data;
}

//Criar Papel -- CreateRoleDto
export async function createRole(data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Atualizar Papel -- UpdateRoleDto
export async function updateRole(id: number) {
  return (await apiClient.put(`${BASE}/${id}`)).data;
}