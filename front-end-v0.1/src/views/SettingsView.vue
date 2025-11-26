<template>
  <div class="settings-container">
    <div class="tabs">
      <button class="tab" @click="goToProfile">Perfil</button>
      <button class="tab active">Configurações</button>
    </div>

    <div class="settings-content">
      <div class="password-section">
        <h3>Alterar senha:</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Senha atual:</label>
            <input 
              type="password" 
              v-model="currentPassword"
              :disabled="loading"
              placeholder="Digite sua senha atual"
            />
          </div>
          <div class="form-group">
            <label>Nova senha:</label>
            <input 
              type="password" 
              v-model="newPassword"
              :disabled="loading"
              placeholder="Mínimo de 6 caracteres"
            />
          </div>
          <div class="form-group">
            <label>Confirmar nova senha:</label>
            <input 
              type="password" 
              v-model="confirmPassword"
              :disabled="loading"
              placeholder="Digite a senha novamente"
            />
          </div>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button 
          class="save-btn" 
          @click="handleChangePassword"
          :disabled="loading || !canSave"
        >
          {{ loading ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { updateUser } from '@/api/users'
import { login } from '@/api/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { success, error } = useToast()

const loading = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const canSave = computed(() => {
  return currentPassword.value.length > 0 &&
         newPassword.value.length >= 6 && 
         newPassword.value === confirmPassword.value
})

const handleChangePassword = async () => {
  if (!canSave.value) {
    errorMessage.value = 'Preencha todos os campos. A senha deve ter no mínimo 6 caracteres e as senhas devem coincidir.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const userId = authStore.user?.id
    if (!userId) {
      router.push('/login')
      return
    }

    const userEmail = authStore.user?.email
    if (!userEmail) {
      error('Email não encontrado. Faça login novamente.')
      return
    }

    try {
      await login(userEmail, currentPassword.value)
    } catch (loginError) {
      errorMessage.value = 'Senha atual incorreta.'
      loading.value = false
      return
    }

    const userIdToUpdate = userId

    await updateUser(userIdToUpdate, {
      senha: newPassword.value
    })

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    success('Senha alterada com sucesso!')
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      error('Senha atual incorreta.')
    } else {
      error('Erro ao alterar senha. Tente novamente.')
    }
  } finally {
    loading.value = false
  }
}

const goToProfile = () => {
  router.push('/perfil')
}
</script>

<style scoped>
.settings-container {
  padding: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: #e9ecef;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.tab.active {
  background: white;
  color: #333;
  font-weight: 600;
}

.tab:hover {
  background: #dee2e6;
}

.settings-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.password-section {
  max-width: 600px;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.password-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #2ea89d;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
}

.save-btn {
  background: #2ea89d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #25968c;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .password-section {
    max-width: 100%;
  }
}
</style>
