import apiClient from '../client';
import { SendDriveDTO } from '../interfaces/drive/drive.dto';

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
export async function createDocument():Promise<SendDriveDTO> {
  return (await apiClient.post(BASE, Promise)).data;
}

//Remove Documento
export async function removeDocument(id: number) {
  return (await apiClient.delete(`${BASE}/${id}`)).data;
}