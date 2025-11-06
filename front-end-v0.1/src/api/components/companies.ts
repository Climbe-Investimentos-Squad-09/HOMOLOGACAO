import apiClient from '../client';

import { CreateCompanyMinimalDto } from '../interfaces/companies/create-minimal-company.dto';
import { CompleteCompanyDto } from '../interfaces/companies/complete-company.dto';

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
export async function createMinimalCompany():Promise<CreateCompanyMinimalDto> {
  return (await apiClient.post(`${BASE}/minimal`, Promise)).data;
}

//Criar Compania -- CompleteCompanyDto
export async function createCompany(id: number):Promise<CompleteCompanyDto> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Atualizar Compania -- CompleteCompanyDto
export async function updateCompany(id: number):Promise<CompleteCompanyDto> {
  return (await apiClient.put(`${BASE}/${id}`, Promise)).data;
}

//Remove Compania
export async function removeCompanie(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}

//Completa dados de Compania pré-cadastrada -- CompleteCompanyDto
export async function patchCompany(id: number):Promise<CompleteCompanyDto> {
  return (await apiClient.patch(`${BASE}/${id}/complete`, Promise)).data;
}