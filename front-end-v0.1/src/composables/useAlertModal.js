import { ref } from 'vue'

const isOpen = ref(false)
const config = ref({
  title: 'Aviso',
  message: '',
  type: 'info',
  onClose: null
})

export function useAlertModal() {
  const openAlert = (options) => {
    config.value = {
      title: options.title || 'Aviso',
      message: options.message || '',
      type: options.type || 'info',
      onClose: options.onClose || null
    }
    isOpen.value = true
  }

  const closeAlert = () => {
    isOpen.value = false
    if (config.value.onClose) {
      config.value.onClose()
    }
    setTimeout(() => {
      config.value = {
        title: 'Aviso',
        message: '',
        type: 'info',
        onClose: null
      }
    }, 300)
  }

  return {
    isOpen,
    config,
    openAlert,
    closeAlert
  }
}

