import apiClient from '../client';

import { SendEmailDTO } from '../interfaces/gmail/gmail.dto';

const BASE = "/api/v1/gmail";

//Enviar E-Mail -- SendEmailDTO
export async function postGmail():Promise<SendEmailDTO> {
  return (await apiClient.post(BASE, Promise)).data;
}