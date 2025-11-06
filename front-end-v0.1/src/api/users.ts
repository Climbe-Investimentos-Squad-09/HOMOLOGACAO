import api from './http'

export enum SituacaoUsuario {
  Ativo = 'Ativo',
  Bloqueado = 'Bloqueado',
  PENDENTE = 'PENDENTE'
}

export interface User {
  idUsuario: number
  nomeCompleto: string
  email: string
  cpf?: string
  contato?: string
  situacao: SituacaoUsuario
  cargo?: {
    idCargo: number
    nomeCargo: string
  }
  permissoesExtras?: Array<{
    idPermissao: number
    nome: string
    descricao?: string
  }>
  dataCriacao: string
  ultimoAcesso: string
}

export interface CreateUserDto {
  nomeCompleto: string
  email: string
  cpf?: string
  contato?: string
  senha?: string
  idCargo?: number
}

export interface UpdateUserDto {
  nomeCompleto?: string
  email?: string
  contato?: string
  senha?: string
}

export interface UpdateUserStatusDto {
  situacao: SituacaoUsuario
}

export interface UpdateUserRoleDto {
  idCargo: number
  permissoesExtras?: number[]
}

export interface AddPermissionsDto {
  permissionIds: number[]
}

export interface RemovePermissionsDto {
  permissionIds: number[]
}

export interface UserFilters {
  nome?: string
  email?: string
  situacao?: SituacaoUsuario
  idCargo?: number
}

export async function getUsers(filters?: UserFilters): Promise<User[]> {
  console.log('API: Buscando usuários com filtros:', filters)
  const response = await api.get('/users', { params: filters })
  console.log('API: Resposta completa:', response)
  console.log('API: Dados retornados:', response.data)
  console.log('API: Tipo dos dados:', Array.isArray(response.data) ? 'Array' : typeof response.data)
  
  if (Array.isArray(response.data)) {
    return response.data
  }
  
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data
  }
  
  if (response.data && Array.isArray(response.data.users)) {
    return response.data.users
  }
  
  return []
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`)
  return data
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  console.log('API: Criando usuário com dados:', dto)
  const response = await api.post('/users', dto)
  console.log('API: Resposta da criação:', response)
  console.log('API: Usuário criado:', response.data)
  return response.data
}

export async function updateUser(id: number, dto: UpdateUserDto): Promise<User> {
  const { data } = await api.put(`/users/${id}`, dto)
  return data
}

export async function updateUserStatus(id: number, situacao: SituacaoUsuario): Promise<User> {
  const { data } = await api.patch(`/users/${id}/status`, { situacao })
  return data
}

export async function updateUserRole(id: number, dto: UpdateUserRoleDto): Promise<User> {
  const { data } = await api.post(`/users/${id}/role`, dto)
  return data
}

export async function addPermissions(id: number, dto: AddPermissionsDto): Promise<User> {
  const { data } = await api.post(`/users/${id}/permissions/add`, dto)
  return data
}

export async function removePermissions(id: number, dto: RemovePermissionsDto): Promise<User> {
  const { data } = await api.post(`/users/${id}/permissions/remove`, dto)
  return data
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}

export type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  UpdateUserRoleDto,
  AddPermissionsDto,
  RemovePermissionsDto,
  UserFilters
}

