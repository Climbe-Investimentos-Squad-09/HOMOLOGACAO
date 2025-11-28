<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Criar reunião:</h2>
        <button class="close-button" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="meeting-title">Título da reunião:</label>
          <input 
            type="text" 
            id="meeting-title" 
            v-model="formData.titulo"
            placeholder="Insira o título da reunião..."
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="meeting-description">Descrição:</label>
          <textarea 
            id="meeting-description" 
            v-model="formData.descricao"
            placeholder="Insira o que será discutido na reunião..."
            :disabled="loading"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="company-select">Empresa:</label>
          <select 
            id="company-select" 
            v-model="formData.idEmpresa" 
            :disabled="loading"
          >
            <option :value="null" disabled>Selecione uma empresa</option>
            <option 
              v-for="company in companies" 
              :key="company.idEmpresa" 
              :value="company.idEmpresa"
            >
              {{ company.nomeFantasia }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="contract-select">Contrato:</label>
          <select 
            id="contract-select" 
            v-model="formData.idContrato" 
            :disabled="loading"
          >
            <option :value="null" disabled>Selecione um contrato ativo</option>
            <option 
              v-for="contract in activeContracts" 
              :key="contract.idContrato" 
              :value="contract.idContrato"
            >
              Contrato #{{ contract.idContrato }} - {{ contract.proposta?.empresa?.nomeFantasia || 'N/A' }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="meeting-date">Data:</label>
          <input 
            type="date" 
            id="meeting-date" 
            v-model="formData.date"
            :disabled="loading"
          />
        </div>

        <div class="form-group-row">
          <div class="form-group">
            <label for="start-time">Horário de início:</label>
            <input 
              type="time" 
              id="start-time" 
              v-model="formData.startTime"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="end-time">Horário do fim:</label>
            <input 
              type="time" 
              id="end-time" 
              v-model="formData.endTime"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="meeting-type">Tipo de reunião</label>
          <select 
            id="meeting-type" 
            v-model="formData.tipoReuniao" 
            :disabled="loading"
          >
            <option :value="null" disabled>Selecione uma opção</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        <div class="form-group">
          <label for="meeting-link">Link da reunião (opcional):</label>
          <input 
            type="text" 
            id="meeting-link" 
            v-model="formData.linkReuniao"
            placeholder="https://..."
            :disabled="loading"
          />
          <p class="hint">Se não for inserido, ele será automaticamente criado</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="$emit('close')" :disabled="loading">
          Cancelar
        </button>
        <button 
          class="create-button" 
          @click="handleCreate" 
          :disabled="loading || !isFormValid"
        >
          {{ loading ? 'Criando...' : 'Criar reunião' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed, watch } from 'vue'
import { getCompanies } from '@/api/companies'
import { getContracts } from '@/api/contracts'
import { createMeeting } from '@/api/meetings'
import { useToast } from '@/composables/useToast'

const emit = defineEmits(['close', 'created'])

const alertModal = inject('alertModal', null)
const toast = useToast()
const loading = ref(false)
const companies = ref([])
const contracts = ref([])

const formData = ref({
  titulo: '',
  descricao: '',
  idEmpresa: null,
  idContrato: null,
  date: '',
  startTime: '',
  endTime: '',
  tipoReuniao: null,
  linkReuniao: ''
})

const activeContracts = computed(() => {
  return contracts.value.filter(contract => 
    contract.statusContrato === 'Ativo' || contract.statusContrato === 'Em revisão'
  )
})

const isFormValid = computed(() => {
  return formData.value.titulo.trim() !== '' && 
         formData.value.date !== '' && 
         formData.value.startTime !== '' && 
         formData.value.endTime !== ''
})

watch(() => formData.value.idEmpresa, (newValue) => {
  // Limpar contrato selecionado quando empresa mudar
  if (newValue) {
    // Opcionalmente, filtrar contratos pela empresa
    formData.value.idContrato = null
  }
})

onMounted(async () => {
  try {
    const [companiesData, contractsData] = await Promise.all([
      getCompanies(),
      getContracts()
    ])
    companies.value = companiesData
    contracts.value = contractsData
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    if (alertModal) {
      alertModal.openAlert({
        title: 'Erro',
        message: 'Não foi possível carregar empresas ou contratos.',
        type: 'error'
      })
    }
  }
})

const handleCreate = async () => {
  if (!isFormValid.value) {
    if (alertModal) {
      alertModal.openAlert({
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha todos os campos obrigatórios.',
        type: 'warning'
      })
    }
    return
  }

  loading.value = true
  try {
    // Combinar data e horário
    const startDateTime = `${formData.value.date}T${formData.value.startTime}:00`
    const endDateTime = `${formData.value.date}T${formData.value.endTime}:00`

    const meetingData = {
      titulo: formData.value.titulo,
      descricao: formData.value.descricao || undefined,
      idEmpresa: formData.value.idEmpresa || undefined,
      idContrato: formData.value.idContrato || undefined,
      dataHoraInicio: startDateTime,
      dataHoraFim: endDateTime,
      tipoReuniao: formData.value.tipoReuniao || undefined,
      linkReuniao: formData.value.linkReuniao || undefined
    }

    await createMeeting(meetingData)
    
    toast.showToast('Reunião criada com sucesso!', 'success')
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Erro ao criar reunião:', error)
    if (alertModal) {
      alertModal.openAlert({
        title: 'Erro',
        message: error.response?.data?.message || 'Não foi possível criar a reunião.',
        type: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}
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
  color: #495057;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #f6f6f6;
  background-color: #f6f6f6;
  font-size: 14px;
  color: #535353;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3C6E6C;
  background-color: #fff;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group-row {
  display: flex;
  gap: 16px;
}

.form-group-row .form-group {
  flex: 1;
}

.hint {
  font-size: 12px;
  color: #BEBEBE;
  margin-top: 4px;
  margin-bottom: 0;
}

.modal-footer {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.cancel-button {
  background-color: #4AA19D;
  color: white;
  padding: 10px 48px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 225px;
  transition: background-color 0.2s;
}

.cancel-button:hover:not(:disabled) {
  background-color: #3C6E6C;
}

.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.create-button {
  background-color: #3C6E6C;
  color: white;
  padding: 10px 48px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 225px;
  transition: background-color 0.2s;
}

.create-button:hover:not(:disabled) {
  background-color: #4AA19D;
}

.create-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 20px;
  }

  .form-group-row {
    flex-direction: column;
    gap: 16px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .cancel-button,
  .create-button {
    width: 100%;
  }
}
</style>

