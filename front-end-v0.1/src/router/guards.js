import { useAuthStore } from '@/stores/auth'
import { hasPermission, userHasRole } from '@/utils/permissions'

export function authGuard(to, from, next) {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    // Se o usuário não tem cargo, só pode acessar dashboard, perfil e calendário
    if (!userHasRole()) {
      if (to.name === 'dashboard' || to.name === 'perfil' || to.name === 'calendario') {
        next()
      } else {
        next('/dashboard')
      }
      return
    }
    
    // Verificar permissões para rotas específicas
    const routePermissions = {
      'propostas': 'propostas:visualizar',
      'contratos': 'contratos:visualizar',
      'calendario': 'reunioes:visualizar',
      'usuarios': 'usuarios:visualizar',
      'autorizacoes': 'usuarios:visualizar',
      'empresas': 'usuarios:visualizar'
    }
    
    const requiredPermission = routePermissions[to.name]
    if (requiredPermission && !hasPermission(requiredPermission)) {
      next('/dashboard')
      return
    }
    
    next()
  } else {
    next('/login')
  }
}

export function guestGuard(to, from, next) {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next()
  } else {
    next('/dashboard')
  }
}
