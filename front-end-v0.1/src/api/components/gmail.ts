import apiClient from '../client';

const BASE = "/api/v1/gmail";

//Enviar E-Mail -- SendEmailDTO
export async function postGmail(data: any) {
  return (await apiClient.post(BASE, data)).data;
}