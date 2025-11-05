//------------------------------------------------------------------------------------------------
// Funções diretas que fazem requisições HTTP relacionadas a propostas
//------------------------------------------------------------------------------------------------
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get(ENDPOINTS.USERS);
  return response.data;
}

export async function getUserById(id: number): Promise<User> {
  const response = await apiClient.get(`${ENDPOINTS.USERS}/${id}`);
  return response.data;
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const response = await apiClient.post(ENDPOINTS.USERS, user);
  return response.data;
}
