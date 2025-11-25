import { useAuthStore } from '@/stores/auth'
import { hasPermission, userHasRole } from '@/utils/permissions'

export function authGuard(to, from, next) {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    // Verificar permissões para rotas específicas
    const routePermissions = {
      'propostas': 'propostas:visualizar',
      'contratos': 'contratos:visualizar',
      'documentos': 'documentos_juridicos:visualizar',
      'calendario': 'reunioes:visualizar',
      'usuarios': 'usuarios:visualizar',
      'autorizacoes': 'usuarios:visualizar',
      'empresas': 'empresas:visualizar'
    }
    
    const requiredPermission = routePermissions[to.name]
    
    // Se não tem cargo, só pode acessar dashboard, perfil e calendário (ou telas com permissão)
    if (!userHasRole()) {
      // Permitir acesso se tiver a permissão necessária (mesmo sem cargo)
      if (requiredPermission && hasPermission(requiredPermission)) {
        next()
        return
      }
      // Ou se for dashboard, perfil ou calendário
      if (to.name === 'dashboard' || to.name === 'perfil' || to.name === 'calendario') {
        next()
      } else {
        next('/dashboard')
      }
      return
    }
    
    // Se tem cargo, verificar permissão
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
