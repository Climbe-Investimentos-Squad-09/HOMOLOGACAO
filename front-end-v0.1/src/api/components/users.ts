import apiClient from '../client';

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
export async function createUser(data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Atribui/Atualiza cargo do usuário -- UpdateUserRoleDto
export async function applyUserRole(id: number, data: any) {
  return (await apiClient.post(`${BASE}/${id}/role`, data)).data;
}

//Adiciona permissões extras a um usuário -- AddPermissionsDto
export async function applyUserPermissions(id: number) {
  return (await apiClient.post(`${BASE}/${id}/permissions/add`)).data;
}

//Função "Delete" marcada como "Post" na documentação do swagger
//Remove permissões extras a um usuário -- RemovePermissionsDto
export async function RemovePermissions(id: number) {
  return (await apiClient.delete(`${BASE}/${id}/permissions/remove`)).data;
}

//Atualiza dados do usuário -- update-user.dto
export async function updateUserData(data: any) {
  return (await apiClient.put(BASE, data)).data;
}

//Remove Usuário
export async function removeUser(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}

//Atualiza situação do usuário (ATIVO/BLOQUEADO/PENDENTE) -- UpdateUserStatusDto
export async function patchUser(id: number, data: any) {
  return (await apiClient.patch(`${BASE}/${id}/status`, data)).data;
}