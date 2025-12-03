import { useAuthStore } from '@/stores/auth'
import { hasPermission } from '@/utils/permissions'

export function authGuard(to, from, next) {
  const authStore = useAuthStore()
  
  // Verificar se tem token e usuário no localStorage
  if (!authStore.isAuthenticated || !authStore.user) {
    next('/login')
    return
  }
  

  if (to.name === 'dashboard' || to.name === 'perfil') {
    next()
    return
  }
  
  // Verificar permissões para rotas específicas apenas se tiver cargo
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
  
  // Se a rota requer permissão e usuário não tem, redirecionar para dashboard
  if (requiredPermission && !hasPermission(requiredPermission)) {
    next('/dashboard')
    return
  }
  
  next()
}

export function guestGuard(to, from, next) {
  const authStore = useAuthStore()
  
  // Permitir sempre o acesso às rotas públicas
  // O redirecionamento será feito manualmente após o login
  next()
}
