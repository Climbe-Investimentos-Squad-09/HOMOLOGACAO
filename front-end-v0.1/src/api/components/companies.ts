import apiClient from '../client';

const BASE = "/api/v1/companies";

//Listar Companias
export async function getAllCompanies() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Compania
export async function getCompanyById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Criar pré cadastro de Compania -- CreateCompanyMinimalDto
export async function createMinimalCompany(data: any) {
  return (await apiClient.post(`${BASE}/minimal`, data)).data;
}

//Criar Compania -- CompleteCompanyDto
export async function createCompany(id: number, data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Atualizar Compania -- CompleteCompanyDto
export async function updateCompany(id: number) {
  return (await apiClient.put(`${BASE}/${id}`)).data;
}

//Remove Compania
export async function removeCompanie(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}

//Completa dados de Compania pré-cadastrada -- CompleteCompanyDto
export async function patchCompany(id: number) {
  return (await apiClient.patch(`${BASE}/${id}/complete`)).data;
}