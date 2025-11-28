import api from './http'

export interface Meeting {
  idReuniao: number
  titulo: string
  descricao?: string
  dataHoraInicio: string
  dataHoraFim: string
  linkReuniao?: string
  tipoReuniao?: string
  empresa?: {
    idEmpresa: number
    nomeFantasia: string
    razaoSocial: string
  }
  contrato?: {
    idContrato: number
  }
  criadoPor?: {
    idUsuario: number
    nomeCompleto: string
  }
}

export interface CreateMeetingDto {
  titulo: string
  descricao?: string
  idEmpresa?: number
  idContrato?: number
  dataHoraInicio: string
  dataHoraFim: string
  tipoReuniao?: string
  linkReuniao?: string
}

export const getMeetings = async (from?: string, to?: string): Promise<Meeting[]> => {
  const params: Record<string, string> = {}
  if (from) params.from = from
  if (to) params.to = to
  
  const response = await api.get('/reunioes', { params })
  return response.data
}

export const getMeetingById = async (id: number): Promise<Meeting> => {
  const response = await api.get(`/reunioes/${id}`)
  return response.data
}

export const createMeeting = async (data: CreateMeetingDto): Promise<Meeting> => {
  const response = await api.post('/reunioes', data)
  return response.data
}

export const updateMeeting = async (id: number, data: Partial<CreateMeetingDto>): Promise<Meeting> => {
  const response = await api.put(`/reunioes/${id}`, data)
  return response.data
}

export const deleteMeeting = async (id: number): Promise<void> => {
  await api.delete(`/reunioes/${id}`)
}

