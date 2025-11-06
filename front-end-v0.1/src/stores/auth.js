import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  
  const userStr = localStorage.getItem('user')
  const user = ref(userStr ? JSON.parse(userStr) : null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function setTokens(accessTokenValue, refreshTokenValue) {
    accessToken.value = accessTokenValue
    refreshToken.value = refreshTokenValue
    localStorage.setItem('accessToken', accessTokenValue)
    localStorage.setItem('refreshToken', refreshTokenValue)
  }

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function clearAuth() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  async function login(email, senha) {
    const response = await authApi.login(email, senha)
    setTokens(response.accessToken, response.refreshToken)
    setUser(response.user)
    return response
  }

  async function register(payload) {
    const response = await authApi.register(payload)
    setTokens(response.accessToken, response.refreshToken)
    setUser(response.user)
    return response
  }

  function logout() {
    clearAuth()
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    setTokens,
    setUser,
    clearAuth
  }
})



