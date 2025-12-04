import api from './http'

export interface Document {
  idDocumento?: number
  name: string
  tipo_documento: string
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
  status?: string
  dataCriacao?: string
  driveLink?: string
}

export interface CreateDocumentDto {
  name: string
  tipo_documento: string
  idEmpresa: number
  idContrato?: number
  idResponsavel?: number
}

export async function getDocuments(filters?: any): Promise<Document[]> {
  try {
    const response = await api.get('/documents', { params: filters })
    
    if (Array.isArray(response.data)) {
      return response.data
    }
    
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }
    
    return []
  } catch (error) {
    console.error('Erro ao buscar documentos (endpoint pode não retornar dados):', error)
    return []
  }
}

export async function createDocument(dto: CreateDocumentDto, file: File): Promise<Document> {
  const formData = new FormData()
  
  formData.append('name', dto.name)
  formData.append('tipo_documento', dto.tipo_documento)
  formData.append('idEmpresa', String(dto.idEmpresa))
  
  if (dto.idContrato) {
    formData.append('idContrato', String(dto.idContrato))
  }
  
  if (dto.idResponsavel) {
    formData.append('idResponsavel', String(dto.idResponsavel))
  }
  
  formData.append('file', file)
  
  const { data } = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function deleteDocument(id: number): Promise<void> {
  await api.delete(`/documents/${id}`)
}

