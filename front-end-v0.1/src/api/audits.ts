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
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function getAudits(filters?: AuditFilters): Promise<AuditResponse> {
  const response = await api.get('/audits', { params: filters })
  
  // Se a resposta já tem paginação com meta
  if (response.data && response.data.data && response.data.meta) {
    return {
      data: response.data.data,
      meta: response.data.meta
    }
  }
  
  // Se a resposta é um array direto (retrocompatibilidade)
  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      meta: {
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        totalPages: 1
      }
    }
  }
  
  return {
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0
    }
  }
}

export default {
  getAudits,
}
