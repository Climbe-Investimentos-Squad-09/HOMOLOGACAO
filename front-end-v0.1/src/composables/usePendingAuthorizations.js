import { ref, computed } from 'vue'
import { getUsers, SituacaoUsuario } from '@/api/users'
import { hasPermission } from '@/utils/permissions'
import { useAuthStore } from '@/stores/auth'

const pendingCount = ref(0)
const loading = ref(false)
let intervalId = null
let isPolling = false
let lastFetchTime = 0
const MIN_FETCH_INTERVAL = 15000
let fetchTimeout = null

export function usePendingAuthorizations() {
  const authStore = useAuthStore()

  const hasUserPermission = computed(() => {
    return hasPermission('usuarios:visualizar') || 
           hasPermission('usuarios:editar') || 
           hasPermission('usuarios:criar')
  })

  const fetchPendingCount = async () => {
    if (!hasUserPermission.value) {
      pendingCount.value = 0
      return
    }

    const now = Date.now()
    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      return
    }

    if (loading.value) {
      return
    }

    if (fetchTimeout) {
      clearTimeout(fetchTimeout)
    }

    loading.value = true
    lastFetchTime = now
    
    try {
      const users = await getUsers({ situacao: SituacaoUsuario.PENDENTE })
      pendingCount.value = users.length || 0
    } catch (error) {
      pendingCount.value = 0
    } finally {
      loading.value = false
    }
  }

  const startPolling = (interval = 120000) => {
    if (isPolling && intervalId) {
      return
    }

    if (intervalId) {
      clearInterval(intervalId)
    }
    
    isPolling = true
    fetchPendingCount()
    
    intervalId = setInterval(() => {
      if (!loading.value && hasUserPermission.value) {
        fetchPendingCount()
      }
    }, interval)
  }

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    if (fetchTimeout) {
      clearTimeout(fetchTimeout)
      fetchTimeout = null
    }
    isPolling = false
  }

  return {
    pendingCount,
    loading,
    fetchPendingCount,
    startPolling,
    stopPolling,
    hasUserPermission
  }
}
