import api from './http'

export interface Permission {
  idPermissao: number
  nome: string
  descricao?: string
}

export interface PermissionFilters {
  q?: string
  nome?: string
  limit?: number
}

export async function getPermissions(filters?: PermissionFilters): Promise<Permission[]> {
  const { data } = await api.get('/permissions', { params: filters })
  return data
}

export async function getPermissionById(id: number): Promise<Permission> {
  const { data } = await api.get(`/permissions/${id}`)
  return data
}

export type { Permission, PermissionFilters }

