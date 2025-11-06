import apiClient from '../client';

import { BulkCreatePermissionDto } from '../interfaces/permissions/bulk-permission.dto';
import { CreatePermissionDto } from '../interfaces/permissions/create-permission.dto';
import { UpdatePermissionDto } from '../interfaces/permissions/update-permission.dto';

const BASE = "/api/permissions";

//Listar Permissões
export async function getAllPermissions() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Permissão
export async function getPermissionById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Criar Permissões em lote (ignora existentes) -- BulkCreatePermissionDto
export async function createBulkPermissions():Promise<BulkCreatePermissionDto> {
  return (await apiClient.post(`${BASE}/bulk`, Promise)).data;
}

//Criar Permissão -- CreatePermissionDto
export async function createPermission(id: number):Promise<CreatePermissionDto> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Atualizar Permissão -- UpdatePermissionDto
export async function updatePermission(id: number):Promise<UpdatePermissionDto> {
  return (await apiClient.put(`${BASE}/${id}`, Promise)).data;
}

//Remove permissão
export async function removePermission(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}