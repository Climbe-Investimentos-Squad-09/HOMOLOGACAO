import { useConfirmModal } from '@/composables/useConfirmModal'
import { useAlertModal } from '@/composables/useAlertModal'

export default {
  install(app) {
    const confirmModal = useConfirmModal()
    const alertModal = useAlertModal()

    app.config.globalProperties.$confirm = (options) => {
      return new Promise((resolve, reject) => {
        confirmModal.openModal({
          ...options,
          onConfirm: () => {
            if (options.onConfirm) {
              options.onConfirm()
            }
            resolve(true)
          },
          onCancel: () => {
            if (options.onCancel) {
              options.onCancel()
            }
            reject(false)
          }
        })
      })
    }

    app.config.globalProperties.$alert = (message, options = {}) => {
      alertModal.openAlert({
        title: options.title || 'Aviso',
        message: message,
        type: options.type || 'info',
        onClose: options.onClose || null
      })
    }

    app.provide('confirmModal', confirmModal)
    app.provide('alertModal', alertModal)
  }
}

