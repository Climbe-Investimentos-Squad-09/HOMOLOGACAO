import api from './http'

export interface Audit {
  id: number
  entity: string
  action: string
  entityId: string | null
  userId: number | null
  userName?: string | null
  createdAt: string
  before: any | null
  after: any | null
  ip: string | null
  method: string | null
  path: string | null
  userAgent: string | null
  extra: any | null
}

export interface AuditFilters {
  entity?: string
  action?: string
  entityId?: string
  userId?: number
  from?: string
  to?: string
  q?: string
  page?: number
  limit?: number
}

export interface AuditResponse {
  data: Audit[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getAudits(filters?: AuditFilters): Promise<AuditResponse> {
  const response = await api.get('/audits', { params: filters })
  
  // Se a resposta já tem paginação
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    return {
      data: response.data.data,
      total: response.data.total || response.data.data.length,
      page: response.data.page || 1,
      limit: response.data.limit || 30,
      totalPages: response.data.totalPages || 1
    }
  }
  
  // Se a resposta é um array direto
  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      total: response.data.length,
      page: 1,
      limit: response.data.length,
      totalPages: 1
    }
  }
  
  return {
    data: [],
    total: 0,
    page: 1,
    limit: 30,
    totalPages: 0
  }
}

export default {
  getAudits,
}
