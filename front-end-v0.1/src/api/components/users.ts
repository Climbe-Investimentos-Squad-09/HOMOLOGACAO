import apiClient from '../client';

import { CreateUserDto } from '../interfaces/users/create-user.dto';
import { UpdateUserDto } from '../interfaces/users/update-user.dto';
import { AddPermissionsDto } from '../interfaces/users/permissions-bulk.dto';
import { RemovePermissionsDto } from '../interfaces/users/permissions-bulk.dto';
import { UpdateUserStatusDto } from '../interfaces/users/update-user-status.dto';
const BASE = "/api/v1/users";

//Listar Usuários
export async function getAllUsers() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes do Usuário
export async function getUserById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Criar Usuário -- create-user.dto
export async function createUser():Promise<CreateUserDto> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Atribui/Atualiza cargo do usuário -- UpdateUserRoleDto
export async function applyUserRole(id: number):Promise<UpdateUserDto> {
  return (await apiClient.post(`${BASE}/${id}/role`, Promise)).data;
}

//Adiciona permissões extras a um usuário -- AddPermissionsDto
export async function applyUserPermissions(id: number):Promise<AddPermissionsDto> {
  return (await apiClient.post(`${BASE}/${id}/permissions/add`, Promise)).data;
}

//Remove permissões extras a um usuário -- RemovePermissionsDto
export async function RemovePermissions(id: number):Promise<RemovePermissionsDto> {
  return (await apiClient.post(`${BASE}/${id}/permissions/remove`, Promise)).data;
}

//Atualiza dados do usuário -- UpdateUserStatusDto
export async function updateUserData(id: number):Promise<UpdateUserStatusDto> {
  return (await apiClient.put(`${BASE}/${id}`, Promise)).data;
}

//Remove Usuário
export async function removeUser(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}

//Atualiza situação do usuário (ATIVO/BLOQUEADO/PENDENTE) -- UpdateUserStatusDto
export async function patchUser(id: number):Promise<UpdateUserStatusDto> {
  return (await apiClient.patch(`${BASE}/${id}/status`, Promise)).data;
}