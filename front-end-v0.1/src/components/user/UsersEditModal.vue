<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Editar usuário</h2>
        <button class="close-button" @click="$emit('close')">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="full-name">Nome completo:</label>
          <input 
            type="text" 
            id="full-name" 
            placeholder="Insira o nome completo"
            v-model="formData.nomeCompleto"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            placeholder="nome@company.com"
            v-model="formData.email"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">Telefone:</label>
          <input 
            type="text" 
            id="phone" 
            placeholder="(11) 99999-9999"
            v-model="formData.contato"
            @input="handlePhoneInput"
            maxlength="15"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button class="delete-button" @click="handleDelete" :disabled="loading">
          {{ loading ? 'Excluindo...' : 'Excluir usuário' }}
        </button>
        <div class="footer-right">
          <button class="cancel-button" @click="$emit('close')" :disabled="loading">Cancelar</button>
          <button class="save-button" @click="handleSave" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { updateUser, deleteUser } from '@/api/users'
import { useToast } from '@/composables/useToast'
import { useConfirmModal } from '@/composables/useConfirmModal'
import { maskPhone, unmask } from '@/utils/masks'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'saved', 'deleted'])

const formData = ref({
  nomeCompleto: '',
  email: '',
  contato: ''
})

const { success, error } = useToast()
const confirmModal = useConfirmModal()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loadUserData = () => {
  formData.value = {
    nomeCompleto: props.user.rawUser?.nomeCompleto || props.user.name || '',
    email: props.user.rawUser?.email || props.user.email || '',
    contato: props.user.rawUser?.contato || props.user.contactPhone || ''
  }
  if (formData.value.contato) {
    formData.value.contato = maskPhone(formData.value.contato)
  }
}

const handlePhoneInput = (event) => {
  const unmasked = unmask(event.target.value)
  formData.value.contato = maskPhone(unmasked)
}

const handleSave = async () => {
  if (!formData.value.nomeCompleto || !formData.value.email) {
    errorMessage.value = 'Nome completo e email são obrigatórios'
    successMessage.value = ''
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await updateUser(props.user.id, {
      nomeCompleto: formData.value.nomeCompleto,
      email: formData.value.email,
      contato: formData.value.contato ? unmask(formData.value.contato) : undefined
    })
    
    success('Usuário atualizado com sucesso!')
    
    setTimeout(() => {
      emit('saved')
      emit('close')
    }, 1500)
  } catch (error) {
    successMessage.value = ''
    if (error.response?.status === 409) {
      errorMessage.value = 'Email já cadastrado'
    } else if (error.response?.status === 403) {
      errorMessage.value = 'Você não tem permissão para editar usuários.'
    } else {
      errorMessage.value = error.response?.data?.message || 'Erro ao atualizar usuário. Tente novamente.'
    }
    loading.value = false
  }
}

const handleDelete = async () => {
  const { checkCanDeleteUser } = await import('@/utils/hierarchy')
  
  const targetUser = props.user.rawUser || props.user
  const canDeleteResult = await checkCanDeleteUser(targetUser)
  
  if (!canDeleteResult.canDelete) {
    error(canDeleteResult.reason || 'Você não pode deletar este usuário devido à hierarquia')
    return
  }
  
  confirmModal.openModal({
    title: 'Excluir usuário',
    message: 'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.',
    type: 'danger',
    confirmText: 'Excluir',
    onConfirm: async () => {
      loading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await deleteUser(props.user.id)
        success('Usuário deletado com sucesso!')
        emit('deleted')
        emit('close')
      } catch (error) {
        if (error.response?.status === 403) {
          errorMessage.value = 'Você não tem permissão para excluir usuários.'
        } else {
          errorMessage.value = error.response?.data?.message || 'Erro ao excluir usuário. Tente novamente.'
        }
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 520px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #858585;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #f6f6f6;
  background-color: #f6f6f6;
  font-size: 14px;
  color: #535353;
}

.form-group input:focus {
  outline: none;
  border-color: #3C6E6C;
}

.error-message {
  color: #AE3B3B;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #FFCFCF;
  border-radius: 4px;
}

.success-message {
  color: #018D0B;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #B6F8BB;
  border-radius: 4px;
  border: 1px solid #B5EDB9;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.footer-right {
  display: flex;
  gap: 1rem;
}

.delete-button {
  background-color: #AE3B3B;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.delete-button:hover:not(:disabled) {
  background-color: #8B2E2E;
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #4AA19D;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.cancel-button:hover:not(:disabled) {
  background-color: #3C6E6C;
}

.save-button {
  background-color: #3C6E6C;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.save-button:hover:not(:disabled) {
  background-color: #4AA19D;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-right {
    width: 100%;
    flex-direction: column;
  }

  .delete-button,
  .cancel-button,
  .save-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1rem;
    margin: 0.5rem;
  }

  .modal-header h2 {
    font-size: 1.1rem;
  }

  .form-group input {
    padding: 10px;
  }
}
</style>

