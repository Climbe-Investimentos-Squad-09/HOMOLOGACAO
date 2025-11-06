import apiClient from '../client';

const BASE = "/api/v1/documents";

//Listar Documentos
export async function getAllDocuments() {
  return (await apiClient.get(BASE)).data;
}

//Detalhes da Documento
export async function getDocumentById(id: number) {
  return (await apiClient.get(`${BASE}/${id}`)).data;
}

//Criar Documento -- SendDriveDTO
export async function createDocument(data: any) {
  return (await apiClient.post(BASE, data)).data;
}

//Remove Documento
export async function removeDocument(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}