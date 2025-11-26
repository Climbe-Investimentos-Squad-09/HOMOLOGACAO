import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type,
      duration
    }

    toasts.value.push(toast)

    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message, duration) => {
    return showToast(message, 'success', duration)
  }

  const error = (message, duration) => {
    return showToast(message, 'error', duration)
  }

  const info = (message, duration) => {
    return showToast(message, 'info', duration)
  }

  const warning = (message, duration) => {
    return showToast(message, 'warning', duration)
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}

