<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Header do Modal -->
      <div class="modal-header">
        <h2 class="modal-title">Adicionar empresa:</h2>
        <button class="close-btn" @click="closeModal">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <!-- Conteúdo do Modal -->
      <div class="modal-content">
        <form @submit.prevent="handleSubmit" class="company-form">
          <!-- Informações Básicas -->
          <div class="form-section">
            <h3 class="section-title">Informações Básicas</h3>
            
            <div class="form-group">
              <label for="legalName" class="form-label">Razão Social: <span class="required">*</span></label>
              <input
                type="text"
                id="legalName"
                v-model="formData.legalName"
                placeholder="Insira a razão social"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="fantasyName" class="form-label">Nome Fantasia: <span class="required">*</span></label>
              <input
                type="text"
                id="fantasyName"
                v-model="formData.fantasyName"
                placeholder="Insira o nome fantasia"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- CNPJ -->
          <div class="form-section">
            <h3 class="section-title">CNPJ</h3>
            
            <div class="form-group">
              <label for="cnpj" class="form-label">CNPJ <span class="required">*</span></label>
              <input
                type="text"
                id="cnpj"
                v-model="formData.cnpj"
                placeholder="00.000.000/0001-00"
                class="form-input"
                @input="formatCNPJ"
                required
              />
            </div>
          </div>

          <!-- Endereço da empresa -->
          <div class="form-section">
            <h3 class="section-title">Endereço da empresa</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="cep" class="form-label">CEP</label>
                <input
                  type="text"
                  id="cep"
                  v-model="formData.cep"
                  placeholder="00000-000"
                  class="form-input"
                  @input="formatCEP"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="street" class="form-label">Rua/Avenida:</label>
                <input
                  type="text"
                  id="street"
                  v-model="formData.street"
                  placeholder="Insira rua/avenida"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="number" class="form-label">Número:</label>
                <input
                  type="text"
                  id="number"
                  v-model="formData.number"
                  placeholder="Insira o número da empresa"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="neighborhood" class="form-label">Bairro:</label>
                <input
                  type="text"
                  id="neighborhood"
                  v-model="formData.neighborhood"
                  placeholder="Insira o bairro"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city" class="form-label">Cidade:</label>
                <input
                  type="text"
                  id="city"
                  v-model="formData.city"
                  placeholder="Insira a cidade onde reside a empresa"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Contato -->
          <div class="form-section">
            <h3 class="section-title">Contato</h3>
            
            <div class="form-group">
              <label for="email" class="form-label">Email: <span class="required">*</span></label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="empresa@empresa.com"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">Telefone:</label>
              <input
                type="text"
                id="phone"
                v-model="formData.phone"
                placeholder="DDD 000000000"
                class="form-input"
                @input="formatPhone"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Footer do Modal -->
      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="closeModal">
          Cancelar
        </button>
        <button type="button" class="btn-add" @click="handleSubmit">
          Adicionar empresa
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { createCompanyFull } from '@/api/companies'

export default {
  name: 'AddCompanyModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'add-company'],
  data() {
    return {
      formData: {
        legalName: '',
        fantasyName: '',
        cnpj: '',
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        email: '',
        phone: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    
    async handleSubmit() {
      if (!this.formData.legalName || !this.formData.fantasyName || !this.formData.cnpj || !this.formData.email) {
        if (this.$alert) {
          this.$alert('Por favor, preencha todos os campos obrigatórios (marcados com *).', { type: 'warning' })
        }
        return
      }

      try {
        let endereco = ''
        if (this.formData.street) {
          endereco = this.formData.street
          if (this.formData.number) endereco += ', ' + this.formData.number
          if (this.formData.neighborhood) endereco += ' - ' + this.formData.neighborhood
          if (this.formData.city) endereco += ' - ' + this.formData.city
          if (this.formData.cep) endereco += ' - CEP: ' + this.formData.cep
        }

        const companyData = {
          razaoSocial: this.formData.legalName,
          nomeFantasia: this.formData.fantasyName,
          cnpj: this.formData.cnpj,
          email: this.formData.email,
          telefone: this.formData.phone || undefined,
          endereco: endereco || undefined,
          representanteLegal: undefined
        }

        await createCompanyFull(companyData)
        
        this.$emit('add-company', companyData)
        
        if (this.$alert) {
          this.$alert('Empresa cadastrada com sucesso!', { type: 'success' })
        }
        
        this.resetForm()
        this.closeModal()
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erro ao criar empresa. Verifique os dados e tente novamente.'
        if (this.$alert) {
          this.$alert(errorMessage, { type: 'error' })
        }
      }
    },
    
    resetForm() {
      this.formData = {
        legalName: '',
        fantasyName: '',
        cnpj: '',
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        email: '',
        phone: ''
      }
    },
    
    formatCNPJ(event) {
      let value = event.target.value.replace(/\D/g, '')
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
      this.formData.cnpj = value
    },
    
    formatCEP(event) {
      let value = event.target.value.replace(/\D/g, '')
      value = value.replace(/^(\d{5})(\d)/, '$1-$2')
      this.formData.cep = value
    },
    
    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, '')
      if (value.length <= 2) {
        this.formData.phone = value
      } else {
        value = value.replace(/^(\d{2})(\d)/, '$1 $2')
        this.formData.phone = value
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #f1f3f4;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f8f9fa;
}

.close-btn i {
  font-size: 1.2rem;
  color: #6c757d;
}

.modal-content {
  padding: 0 1.5rem;
}

.company-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #000;
}

.required {
  color: #dc3545;
  margin-left: 2px;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00a86b;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 168, 107, 0.1);
}

.form-input::placeholder {
  color: #6c757d;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #f1f3f4;
  margin-top: 1.5rem;
}

.btn-cancel {
  background: #e0f7fa;
  color: #00695c;
  border: 1px solid #b2dfdb;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-cancel:hover {
  background: #b2dfdb;
  border-color: #80cbc4;
  transform: translateY(-1px);
}

.btn-add {
  background: #00a86b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-add:hover {
  background: #008f5a;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    margin: 1rem;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem 1rem 0;
  }
  
  .modal-content {
    padding: 0 1rem;
  }
  
  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-add {
    width: 100%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .form-input {
    padding: 0.625rem;
  }
}
</style>
