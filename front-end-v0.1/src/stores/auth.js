import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'
import { getUserById } from '@/api/users'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  
  const userStr = localStorage.getItem('user')
  const user = ref(userStr ? JSON.parse(userStr) : null)
  const permissions = ref([])

  const isAuthenticated = computed(() => !!accessToken.value)
  
  // Carregar permissões do localStorage se existir
  const permissionsStr = localStorage.getItem('permissions')
  if (permissionsStr) {
    try {
      const savedPerms = JSON.parse(permissionsStr)
      permissions.value = Array.isArray(savedPerms) ? savedPerms : []
    } catch (e) {
      permissions.value = []
    }
  }

  function setTokens(accessTokenValue, refreshTokenValue) {
    accessToken.value = accessTokenValue
    refreshToken.value = refreshTokenValue
    localStorage.setItem('accessToken', accessTokenValue)
    localStorage.setItem('refreshToken', refreshTokenValue)
  }

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
    // Adicionar permissões ao objeto user para facilitar acesso
    if (userData.permissions) {
      user.value.permissions = userData.permissions
    }
    // Garantir que profile (cargo) está definido
    if (userData.profile !== undefined) {
      user.value.profile = userData.profile
    }
  }
  
  async function loadUserPermissions() {
    if (!user.value?.id) return
    
    try {
      // Tentar carregar permissões, mas não falhar se não tiver permissão usuarios:visualizar
      const userData = await getUserById(user.value.id)
      
      // Atualizar o cargo do usuário se não estiver definido
      if (userData.cargo && !user.value.profile) {
        user.value.profile = userData.cargo.idCargo
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      const rolePerms = userData.cargo?.permissoes?.map(p => p.nome) || []
      const extraPerms = userData.permissoesExtras?.map(p => p.nome) || []
      const allPerms = [...new Set([...rolePerms, ...extraPerms])]
      
      permissions.value = allPerms
      if (user.value) {
        user.value.permissions = allPerms
      }
      localStorage.setItem('permissions', JSON.stringify(allPerms))
    } catch (error) {
      if (error.response?.status === 403) {
        const savedPerms = localStorage.getItem('permissions')
        if (savedPerms) {
          try {
            const perms = JSON.parse(savedPerms)
            permissions.value = perms
            if (user.value) {
              user.value.permissions = perms
            }
          } catch (e) {
            // Ignorar erro silenciosamente
          }
        }
      }
    }
  }

  function clearAuth() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    permissions.value = []
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')
  }

  async function login(email, senha) {
    const response = await authApi.login(email, senha)
    setTokens(response.accessToken, response.refreshToken)
    setUser(response.user)
    
    if (response.user?.permissions && Array.isArray(response.user.permissions)) {
      permissions.value = response.user.permissions
      if (user.value) {
        user.value.permissions = response.user.permissions
      }
      localStorage.setItem('permissions', JSON.stringify(response.user.permissions))
    } else {
      await loadUserPermissions()
    }
    
    if (!user.value?.profile) {
      try {
        const userData = await getUserById(user.value.id)
        if (userData.cargo) {
          user.value.profile = userData.cargo.idCargo
          localStorage.setItem('user', JSON.stringify(user.value))
        }
      } catch (error) {
        // Ignorar erro silenciosamente
      }
    }
    return response
  }

  async function register(payload) {
    const response = await authApi.register(payload)
    if (response.accessToken && response.refreshToken) {
      setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
    }
    return response
  }

  function logout() {
    clearAuth()
  }

  return {
    accessToken,
    refreshToken,
    user,
    permissions,
    isAuthenticated,
    login,
    register,
    logout,
    setTokens,
    setUser,
    clearAuth,
    loadUserPermissions
  }
})





