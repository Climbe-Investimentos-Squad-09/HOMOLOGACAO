import api from './http'
import { StatusProposta } from './types'

export interface Proposal {
  idProposta: number
  idEmpresa: number
  empresa?: {
    idEmpresa: number
    nomeFantasia: string
    razaoSocial?: string
  }
  idEmissor: number
  valorProposta: number
  prazoValidade: string
  statusProposta: StatusProposta
  dataCriacao: string
  driveLink?: string
  atribuicoes?: Array<{
    id: number
    usuario: {
      idUsuario: number
      nomeCompleto: string
    }
    role: string
  }>
}

export interface CreateProposalDto {
  idEmpresa: number
  idEmissor: number
  valorProposta: number
  prazoValidade: string
  statusProposta?: StatusProposta
  dataCriacao?: string
}

export interface UpdateProposalDto {
  idEmpresa?: number
  valorProposta?: number
  prazoValidade?: string
}

export interface ProposalFilters {
  idEmpresa?: number
  idEmissor?: number
  statusProposta?: StatusProposta
  from?: string
  to?: string
}

export async function getProposals(filters?: ProposalFilters): Promise<Proposal[]> {
  const response = await api.get('/proposals', { params: filters })
  
  if (Array.isArray(response.data)) {
    return response.data
  }
  
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data
  }
  
  return []
}

export async function getProposalById(id: number): Promise<Proposal> {
  const { data } = await api.get(`/proposals/${id}`)
  return data
}

export async function createProposal(dto: CreateProposalDto, file?: File): Promise<Proposal> {
  const formData = new FormData()
  
  Object.keys(dto).forEach(key => {
    if (dto[key] !== undefined && dto[key] !== null) {
      formData.append(key, String(dto[key]))
    }
  })
  
  if (file) {
    formData.append('file', file)
  }
  
  const { data } = await api.post('/proposals', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function updateProposal(id: number, dto: UpdateProposalDto): Promise<Proposal> {
  const { data } = await api.put(`/proposals/${id}`, dto)
  return data
}

export async function deleteProposal(id: number): Promise<void> {
  await api.delete(`/proposals/${id}`)
}

export async function updateProposalStatus(id: number, statusProposta: StatusProposta): Promise<Proposal> {
  const { data } = await api.patch(`/proposals/${id}/status`, { statusProposta })
  return data
}

