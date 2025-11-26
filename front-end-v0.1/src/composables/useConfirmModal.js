import { ref } from 'vue'

const isOpen = ref(false)
const config = ref({
  title: 'Confirmação',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  type: 'default',
  showClose: true,
  showCancel: true,
  onConfirm: null,
  onCancel: null
})

export function useConfirmModal() {
  const openModal = (options) => {
    config.value = {
      title: options.title || 'Confirmação',
      message: options.message || '',
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      type: options.type || 'default',
      showClose: options.showClose !== false,
      showCancel: options.showCancel !== false,
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null
    }
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
    setTimeout(() => {
      config.value = {
        title: 'Confirmação',
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'default',
        showClose: true,
        showCancel: true,
        onConfirm: null,
        onCancel: null
      }
    }, 300)
  }

  const handleConfirm = () => {
    if (config.value.onConfirm) {
      config.value.onConfirm()
    }
    closeModal()
  }

  const handleCancel = () => {
    if (config.value.onCancel) {
      config.value.onCancel()
    }
    closeModal()
  }

  return {
    isOpen,
    config,
    openModal,
    closeModal,
    handleConfirm,
    handleCancel
  }
}

