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

export async function createDocument(dto: CreateDocumentDto): Promise<Document> {
  const payload = {
    name: dto.name,
    tipo_documento: dto.tipo_documento,
    idEmpresa: dto.idEmpresa,
    idContrato: dto.idContrato || undefined,
    idResponsavel: dto.idResponsavel || undefined
  };
  
  const { data } = await api.post('/documents', payload)
  return data
}

export async function deleteDocument(id: number): Promise<void> {
  await api.delete(`/documents/${id}`)
}

