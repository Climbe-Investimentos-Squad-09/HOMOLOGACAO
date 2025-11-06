import api from './http'

export interface Role {
  idCargo: number
  nomeCargo: string
}

export async function getRoleById(id: number): Promise<Role> {
  const { data } = await api.get(`/roles`)
  const role = data.find((r: Role) => r.idCargo === id)
  if (!role) {
    throw new Error('Cargo não encontrado')
  }
  return role
}

export async function getAllRoles(): Promise<Role[]> {
  const { data } = await api.get(`/roles`)
  return data
}

export type { Role }

