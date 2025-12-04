import api from './http'

export interface Report {
  idRelatorio?: number
  titulo: string
  descricao?: string
  idEmpresa?: number
  empresa?: {
    idEmpresa: number
    nomeFantasia: string
  }
  idContrato?: number
  contrato?: {
    idContrato: number
  }
  idResponsavel?: number
  responsavel?: {
    idUsuario: number
    nomeCompleto: string
  }
  dataCriacao?: string
  driveLink?: string
}

export interface CreateReportDto {
  titulo: string
  descricao?: string
  idEmpresa: number
  idContrato?: number
  idResponsavel?: number
}

export async function getReports(filters?: any): Promise<Report[]> {
  try {
    const response = await api.get('/reports', { params: filters })
    
    if (Array.isArray(response.data)) {
      return response.data
    }
    
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }
    
    return []
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error)
    return []
  }
}

export async function getReportById(id: number): Promise<Report> {
  const { data } = await api.get(`/reports/${id}`)
  return data
}

export async function createReport(dto: CreateReportDto, file: File): Promise<Report> {
  const formData = new FormData()
  
  formData.append('titulo', dto.titulo)
  if (dto.descricao) {
    formData.append('descricao', dto.descricao)
  }
  formData.append('idEmpresa', String(dto.idEmpresa))
  
  if (dto.idContrato) {
    formData.append('idContrato', String(dto.idContrato))
  }
  
  if (dto.idResponsavel) {
    formData.append('idResponsavel', String(dto.idResponsavel))
  }
  
  formData.append('file', file)
  
  const { data } = await api.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function deleteReport(id: number): Promise<void> {
  await api.delete(`/reports/${id}`)
}

