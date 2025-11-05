// src/api/auth.ts
import api from './http'

export async function login(email: string, senha: string) {
  const { data } = await api.post('/auth/login', { email, senha })
  return data // { success, accessToken, refreshToken, user }
}

export async function register(payload: {
  email: string; nome: string; senha: string; idCargo?: number
}) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function getGoogleAuthUrl() {
  const { data } = await api.get('/auth/google/url')
  return data.url as string
}

export async function validate(token: string) {
  const { data } = await api.post('/auth/validate', { token })
  return data
}
