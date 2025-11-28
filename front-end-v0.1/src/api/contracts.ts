import api from './http'

export interface Contract {
  idContrato: number
  idProposta: number
  proposta?: {
    idProposta: number
    empresa?: {
      idEmpresa: number
      nomeFantasia: string
    }
  }
  idCompliance?: number
  compliance?: {
    idUsuario: number
    nomeCompleto: string
  }
  statusContrato: string
  dataCriacao: string
  dataEncerramento?: string
  dataInicio?: string
  dataFim?: string
}

export interface ContractFilters {
  idProposta?: number
  idCompliance?: number
  statusContrato?: string
  from?: string
  to?: string
}

export async function getContracts(filters?: ContractFilters): Promise<Contract[]> {
  const response = await api.get('/contracts', { params: filters })
  
  if (Array.isArray(response.data)) {
    return response.data
  }
  
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data
  }
  
  return []
}

export async function getContractById(id: number): Promise<Contract> {
  const { data } = await api.get(`/contracts/${id}`)
  return data
}

export interface CreateContractDto {
  idProposta: number
  idCompliance?: number
  statusContrato?: string
  dataEncerramento?: string
  dataInicio?: string
  dataFim?: string
}

export async function createContract(dto: CreateContractDto): Promise<Contract> {
  const { data } = await api.post('/contracts', dto)
  return data
}

export async function updateContract(id: number, dto: Partial<CreateContractDto>): Promise<Contract> {
  const { data } = await api.put(`/contracts/${id}`, dto)
  return data
}

export async function deleteContract(id: number): Promise<void> {
  await api.delete(`/contracts/${id}`)
}
