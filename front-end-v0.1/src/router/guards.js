import { useAuthStore } from '@/stores/auth'

export function authGuard(to, from, next) {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
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



