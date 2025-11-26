import api from './http'

export interface Company {
  idEmpresa: number
  razaoSocial?: string
  nomeFantasia: string
  cnpj?: string
  endereco?: string
  telefone?: string
  email: string
  representanteLegal?: string
  contratos?: any[]
}

export interface CreateMinimalDto {
  nomeFantasia: string
  email: string
  contato?: string
}

export interface CompleteCompanyDto {
  razaoSocial?: string
  nomeFantasia?: string
  cnpj?: string
  endereco?: string
  telefone?: string
  email?: string
  representanteLegal?: string
}

export async function getCompanies(filters?: any): Promise<Company[]> {
  const response = await api.get('/companies', { params: filters })

  if (Array.isArray(response.data)) return response.data
  if (response.data && Array.isArray(response.data.data)) return response.data.data
  if (response.data && Array.isArray(response.data.companies)) return response.data.companies

  return []
}

export async function getCompanyById(id: number): Promise<Company> {
  const { data } = await api.get(`/companies/${id}`)
  return data
}

export async function createCompanyMinimal(dto: CreateMinimalDto): Promise<Company> {
  const { data } = await api.post('/companies/minimal', dto)
  return data
}

export async function createCompanyFull(dto: CompleteCompanyDto): Promise<Company> {
  const { data } = await api.post('/companies', dto)
  return data
}

export async function updateCompany(id: number, dto: CompleteCompanyDto): Promise<Company> {
  const { data } = await api.put(`/companies/${id}`, dto)
  return data
}

export async function completeCompany(id: number, dto: CompleteCompanyDto): Promise<Company> {
  const { data } = await api.patch(`/companies/${id}/complete`, dto)
  return data
}

export default {
  getCompanies,
  getCompanyById,
  createCompanyMinimal,
  createCompanyFull,
  updateCompany,
  completeCompany,
}
