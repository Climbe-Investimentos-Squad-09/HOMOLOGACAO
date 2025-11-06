import api from './http'

interface User {
  id: number
  email: string
  name: string
  profile: number | null
}

interface AuthResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  message: string
  user: User
}

interface RegisterResponse extends AuthResponse {
  statusCode: number
}

export async function login(email: string, senha: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', { email, senha })
  return data
}

export async function register(payload: {
  email: string
  nome: string
  senha: string
  idCargo?: number
}): Promise<RegisterResponse> {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export type { User, AuthResponse, RegisterResponse }

