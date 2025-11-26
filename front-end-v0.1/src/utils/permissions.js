import { useAuthStore } from '@/stores/auth'

/**
 * Verifica se o usuário tem uma permissão específica
 * @param {string} permission - Nome da permissão (ex: 'propostas:visualizar')
 * @returns {boolean}
 */
export function hasPermission(permission) {
  const authStore = useAuthStore()
  
  // Primeiro tenta pegar do array de permissions do store
  if (authStore.permissions && authStore.permissions.length > 0) {
    return authStore.permissions.includes(permission)
  }
  
  // Se não tiver no store, tenta pegar do user
  const user = authStore.user
  if (user && user.permissions && user.permissions.length > 0) {
    return user.permissions.includes(permission)
  }
  
  return false
}

/**
 * Verifica se o usuário tem pelo menos uma das permissões
 * @param {string[]} permissions - Array de nomes de permissões
 * @returns {boolean}
 */
export function hasAnyPermission(permissions) {
  return permissions.some(perm => hasPermission(perm))
}

/**
 * Verifica se o usuário tem todas as permissões
 * @param {string[]} permissions - Array de nomes de permissões
 * @returns {boolean}
 */
export function hasAllPermissions(permissions) {
  return permissions.every(perm => hasPermission(perm))
}

/**
 * Verifica se o usuário é administrador (tem permissão de editar usuários)
 * @returns {boolean}
 */
export function isAdmin() {
  return hasPermission('usuarios:editar') || hasPermission('usuarios:criar')
}

/**
 * Verifica se o usuário pode editar ou criar em um módulo específico
 * @param {string} module - Nome do módulo (ex: 'propostas', 'contratos', 'empresas', 'usuarios')
 * @returns {boolean}
 */
export function canEditOrCreate(module) {
  return hasPermission(`${module}:editar`) || hasPermission(`${module}:criar`)
}

/**
 * Verifica se o usuário tem cargo
 * @returns {boolean}
 */
export function userHasRole() {
  const authStore = useAuthStore()
  return !!authStore.user?.profile
}

/**
 * Verifica se o usuário tem um dos cargos especificados (por nome do cargo)
 * @param {string[]} roleNames - Array de nomes de cargos (ex: ['SysAdmin', 'CEO', 'Compliance'])
 * @returns {Promise<boolean>}
 */
export async function hasRoleName(roleNames) {
  const authStore = useAuthStore()
  if (!authStore.user?.profile) return false
  
  try {
    // Importar dinamicamente para evitar dependência circular
    const { getRoleById } = await import('@/api/roles')
    const role = await getRoleById(authStore.user.profile)
    return roleNames.includes(role.nomeCargo)
  } catch (error) {
    console.error('Erro ao verificar cargo:', error)
    return false
  }
}

/**
 * Verifica se o usuário pode acessar auditoria (SysAdmin, CEO ou Compliance)
 * @returns {Promise<boolean>}
 */
export async function canAccessAudit() {
  return await hasRoleName(['SysAdmin'])
}

export function canManageRoleAndPermissions() {
  return hasPermission('usuarios:gerenciar_cargo_permissoes')
}

/**
 * Mapeamento de rotas para permissões necessárias
 */
export const routePermissions = {
  '/propostas': 'propostas:visualizar',
  '/contratos': 'contratos:visualizar',
  '/calendario': 'reunioes:visualizar',
  '/empresas': 'usuarios:visualizar', // Assumindo que empresas precisa de permissão de usuários
  '/usuarios': 'usuarios:visualizar',
  '/autorizacoes': 'usuarios:visualizar' // Assumindo que autorizações precisa de permissão de usuários
}

