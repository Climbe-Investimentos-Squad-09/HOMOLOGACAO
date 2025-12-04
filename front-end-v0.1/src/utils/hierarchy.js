export const ROLE_HIERARCHY = {
  'SysAdmin': 1,
  'Compliance': 2,
  'CEO': 3,
  'CSO': 4,
  'CMO': 4,
  'Analista Financeiro': 5
}

export function getRoleHierarchyLevel(roleName) {
  return ROLE_HIERARCHY[roleName] || 999
}

export function canDeleteUser(currentUserRole, targetUserRole) {
  const currentLevel = getRoleHierarchyLevel(currentUserRole)
  const targetLevel = getRoleHierarchyLevel(targetUserRole)
  
  if (currentLevel === 999 || targetLevel === 999) {
    return false
  }
  
  return currentLevel < targetLevel
}

export async function checkCanDeleteUser(targetUser) {
  const { useAuthStore } = await import('@/stores/auth')
  const { getRoleById } = await import('@/api/roles')
  const { hasRoleName } = await import('@/utils/permissions')
  
  const authStore = useAuthStore()
  const currentUserId = authStore.user?.idUsuario || authStore.user?.id
  
  if (!currentUserId) {
    return { canDelete: false, reason: 'Usuário não autenticado' }
  }
  
  const isAdmin = await hasRoleName(['SysAdmin'])
  
  if (isAdmin) {
    return { canDelete: true }
  }
  
  if (!targetUser?.cargo?.idCargo) {
    return { canDelete: false, reason: 'Usuário sem cargo não pode ser deletado por hierarquia' }
  }
  
  try {
    const currentUserRole = await getRoleById(authStore.user?.profile)
    const targetUserRole = targetUser.cargo
    
    const canDelete = canDeleteUser(currentUserRole.nomeCargo, targetUserRole.nomeCargo)
    
    if (!canDelete) {
      return { 
        canDelete: false, 
        reason: `Você não pode deletar usuários com cargo de hierarquia igual ou superior (${targetUserRole.nomeCargo})` 
      }
    }
    
    return { canDelete: true }
  } catch (error) {
    return { canDelete: false, reason: 'Erro ao verificar hierarquia' }
  }
}

