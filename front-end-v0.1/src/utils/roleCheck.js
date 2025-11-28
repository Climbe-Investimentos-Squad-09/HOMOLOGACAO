export async function isComplianceOrAdmin() {
  const { useAuthStore } = await import('@/stores/auth')
  const { getRoleById } = await import('@/api/roles')
  
  const authStore = useAuthStore()
  if (!authStore.user?.profile) return false
  
  try {
    const role = await getRoleById(authStore.user.profile)
    return ['SysAdmin', 'Compliance'].includes(role.nomeCargo)
  } catch (error) {
    return false
  }
}

