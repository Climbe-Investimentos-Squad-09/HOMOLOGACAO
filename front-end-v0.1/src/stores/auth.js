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
      const userData = await getUserById(user.value.id)
      
      // Atualizar o cargo do usuário se não estiver definido
      if (userData.cargo && !user.value.profile) {
        user.value.profile = userData.cargo.idCargo
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      // Carregar permissões do cargo
      const rolePerms = userData.cargo?.permissoes?.map(p => p.nome) || []
      // Carregar permissões extras do usuário
      const extraPerms = userData.permissoesExtras?.map(p => p.nome) || []
      // Combinar todas as permissões (removendo duplicatas)
      const allPerms = [...new Set([...rolePerms, ...extraPerms])]
      
      console.log('Permissões carregadas:', {
        rolePerms,
        extraPerms,
        allPerms,
        cargo: userData.cargo?.nomeCargo,
        cargoId: userData.cargo?.idCargo,
        totalPerms: allPerms.length
      })
      
      // Se não tiver permissões e tiver cargo, pode ser que o cargo não tenha permissões vinculadas
      if (allPerms.length === 0 && userData.cargo) {
        console.warn('Usuário tem cargo mas não tem permissões. Verifique se o cargo tem permissões vinculadas no banco.')
      }
      
      permissions.value = allPerms
      if (user.value) {
        user.value.permissions = allPerms
      }
      localStorage.setItem('permissions', JSON.stringify(allPerms))
    } catch (error) {
      console.error('Erro ao carregar permissões:', error)
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
    // Carregar permissões e cargo após login
    await loadUserPermissions()
    // Se ainda não tiver profile após carregar, tentar buscar novamente
    if (!user.value?.profile) {
      try {
        const userData = await getUserById(user.value.id)
        if (userData.cargo) {
          user.value.profile = userData.cargo.idCargo
          localStorage.setItem('user', JSON.stringify(user.value))
        }
      } catch (error) {
        console.error('Erro ao buscar cargo do usuário:', error)
      }
    }
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





