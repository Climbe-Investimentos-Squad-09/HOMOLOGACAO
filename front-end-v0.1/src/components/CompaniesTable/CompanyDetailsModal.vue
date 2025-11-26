<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'Editar Empresa' : 'Detalhes da Empresa' }}</h3>
        <button class="close-btn" @click="closeModal">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="info-grid">
          <div class="info-field">
            <label>Nome Fantasia</label>
            <input 
              v-if="isEditing" 
              v-model="editedCompany.nomeFantasia" 
              type="text" 
              class="edit-input"
            />
            <p v-else class="info-value">{{ company?.nomeFantasia || '—' }}</p>
          </div>

          <div class="info-field">
            <label>Razão Social</label>
            <input 
              v-if="isEditing" 
              v-model="editedCompany.razaoSocial" 
              type="text" 
              class="edit-input"
            />
            <p v-else class="info-value">{{ company?.razaoSocial || '—' }}</p>
          </div>

          <div class="info-field">
            <label>CNPJ</label>
            <input 
              v-if="isEditing" 
              v-model="editedCompany.cnpj" 
              type="text" 
              class="edit-input"
              v-maska="'##.###.###/####-##'"
            />
            <p v-else class="info-value">{{ company?.cnpj || '—' }}</p>
          </div>

          <div class="info-field">
            <label>Email</label>
            <input 
              v-if="isEditing" 
              v-model="editedCompany.email" 
              type="email" 
              class="edit-input"
            />
            <p v-else class="info-value">{{ company?.email || '—' }}</p>
          </div>

          <div class="info-field">
            <label>Telefone</label>
            <input 
              v-if="isEditing" 
              v-model="editedCompany.telefone" 
              type="text" 
              class="edit-input"
              v-maska="'(##) #####-####'"
            />
            <p v-else class="info-value">{{ company?.telefone || '—' }}</p>
          </div>

          <div class="info-field">
            <label>Endereço</label>
            <input 
              v-if="isEditing" 
              v-model="editedCompany.endereco" 
              type="text" 
              class="edit-input"
            />
            <p v-else class="info-value">{{ company?.endereco || '—' }}</p>
          </div>

          <div class="info-field full-width">
            <label>Representante Legal</label>
            <input 
              v-if="isEditing" 
              v-model="editedCompany.representanteLegal" 
              type="text" 
              class="edit-input"
            />
            <p v-else class="info-value">{{ company?.representanteLegal || '—' }}</p>
          </div>

          <div class="info-field">
            <label>Status</label>
            <span :class="['status-badge', getStatusClass()]">
              {{ getStatusText() }}
            </span>
          </div>

          <div class="info-field">
            <label>Contratos</label>
            <p class="info-value">{{ (company?.contratos && company.contratos.length) || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">
          {{ isEditing ? 'Cancelar' : 'Fechar' }}
        </button>
        <button v-if="!isEditing" class="edit-btn" @click="enableEditing">
          <i class="bi bi-pencil"></i>
          Editar
        </button>
        <button v-if="isEditing" class="save-btn" @click="saveChanges" :disabled="saving">
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { vMaska } from 'maska/vue'

export default {
  name: 'CompanyDetailsModal',
  directives: { maska: vMaska },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    company: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      isEditing: false,
      saving: false,
      editedCompany: {}
    }
  },
  watch: {
    company: {
      handler(newVal) {
        if (newVal) {
          this.editedCompany = { ...newVal }
        }
      },
      immediate: true
    },
    isOpen(newVal) {
      if (!newVal) {
        this.isEditing = false
      }
    }
  },
  methods: {
    closeModal() {
      this.isEditing = false
      this.$emit('close')
    },

    enableEditing() {
      this.isEditing = true
      this.editedCompany = { ...this.company }
    },

    isCompanyComplete() {
      const comp = this.company
      // Verifica se TODOS os campos estão preenchidos
      return !!(
        comp?.razaoSocial?.trim() &&
        comp?.nomeFantasia?.trim() &&
        comp?.cnpj?.trim() &&
        comp?.email?.trim() &&
        comp?.telefone?.trim() &&
        comp?.endereco?.trim() &&
        comp?.representanteLegal?.trim()
      )
    },

    getStatusClass() {
      return this.isCompanyComplete() ? 'status-active' : 'status-review'
    },

    getStatusText() {
      return this.isCompanyComplete() ? 'Completo' : 'Pré-cadastro'
    },

    async saveChanges() {
      this.saving = true
      try {
        await this.$emit('save', this.editedCompany)
        this.isEditing = false
      } catch (err) {
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(2px);
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #000;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-field.full-width {
  grid-column: 1 / -1;
}

.info-field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  margin: 0;
  font-size: 1rem;
  color: #000;
  padding: 0.5rem 0;
}

.edit-input {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.edit-input:focus {
  outline: none;
  border-color: #00695c;
  box-shadow: 0 0 0 3px rgba(0, 105, 92, 0.1);
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  width: fit-content;
  white-space: nowrap;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-review {
  background: #fff3cd;
  color: #856404;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.cancel-btn,
.edit-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-btn {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.edit-btn {
  background: #00695c;
  color: white;
}

.edit-btn:hover {
  background: #005246;
}

.save-btn {
  background: #00a86b;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #008f5a;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    max-height: 95vh;
  }
}
</style>
