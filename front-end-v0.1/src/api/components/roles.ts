import apiClient from '../client';

import { AssignPermissionDto } from '../interfaces/roles/assign-permission.dto';
import { CreateRoleDto } from '../interfaces/roles/create-role.dto';
import { UpdateRoleDto } from '../interfaces/roles/update-role.dto';

const BASE = "/api/roles";

//Listar Papéis
export async function getAllRoles() {
  return (await apiClient.get(BASE)).data;
}

//Atribuir usuário ao Papel -- AssignPermissionDto
export async function applyUserRole():Promise<AssignPermissionDto> {
  return (await apiClient.post(`${BASE}/assign`, Promise)).data;
}

//Criar Papel -- CreateRoleDto
export async function createRole():Promise<CreateRoleDto> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Atualizar Papel -- UpdateRoleDto
export async function updateRole(id: number):Promise<UpdateRoleDto> {
  return (await apiClient.put(`${BASE}/${id}`, Promise)).data;
}