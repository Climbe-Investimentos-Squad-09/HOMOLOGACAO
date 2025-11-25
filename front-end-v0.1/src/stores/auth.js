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
        totalPerms: allPerms.length,
        userId: userData.idUsuario
      })
      
      // Log específico para debug de permissões extras
      if (extraPerms.length > 0) {
        console.log('✅ Permissões extras encontradas:', extraPerms)
      } else {
        console.log('⚠️ Nenhuma permissão extra encontrada')
      }
      
      // Log específico para verificar permissões de contratos
      if (allPerms.includes('contratos:visualizar')) {
        console.log('✅ Permissão contratos:visualizar encontrada!')
      } else {
        console.log('❌ Permissão contratos:visualizar NÃO encontrada')
      }
      
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
      // Se for erro 403, tentar usar permissões do middleware (que já foram carregadas no login)
      if (error.response?.status === 403) {
        console.warn('Não tem permissão para carregar dados do usuário. Usando permissões do token.')
        // As permissões extras já devem estar no req.user do middleware
        // Tentar usar as permissões que já temos no localStorage
        const savedPerms = localStorage.getItem('permissions')
        if (savedPerms) {
          try {
            const perms = JSON.parse(savedPerms)
            permissions.value = perms
            if (user.value) {
              user.value.permissions = perms
            }
          } catch (e) {
            console.error('Erro ao carregar permissões do localStorage:', e)
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
    
    // Se a resposta do login já incluir permissões, usar elas
    if (response.user?.permissions && Array.isArray(response.user.permissions)) {
      permissions.value = response.user.permissions
      if (user.value) {
        user.value.permissions = response.user.permissions
      }
      localStorage.setItem('permissions', JSON.stringify(response.user.permissions))
      console.log('✅ Permissões carregadas do login:', response.user.permissions)
    } else {
      // Caso contrário, tentar carregar do backend
      await loadUserPermissions()
    }
    
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





