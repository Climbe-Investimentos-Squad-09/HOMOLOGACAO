<template>
  <div class="companies-table-container">
      <div class="table-header">
        <h3 class="table-title">Empresas ({{ companies.length }})</h3>
        <div style="margin-top:8px">
          <button class="action-btn" @click="addCompany">Adicionar empresa</button>
        </div>
      </div>
    
    <div class="table-wrapper">
      <table class="companies-table">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>CNPJ</th>
            <th>Contato</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Contratos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="company in companies" :key="company.idEmpresa" class="table-row">
            <td class="company-cell">
              <div class="company-info">
                <div class="company-name">{{ company.nomeFantasia }}</div>
                <div class="company-subtitle">{{ company.razaoSocial }}</div>
              </div>
            </td>
            <td class="cnpj-cell">{{ company.cnpj || '—' }}</td>
            <td class="contact-cell">
              <div class="contact-info">
                <div class="contact-email">{{ company.email }}</div>
                <div class="contact-phone">{{ company.telefone }}</div>
              </div>
            </td>
            <td class="location-cell">{{ company.endereco || '—' }}</td>
            <td class="status-cell">
              <span :class="['status-badge', getStatusClass(company)]">
                {{ getStatusText(company) }}
              </span>
            </td>
            <td class="contracts-cell">
              <div class="contracts-info">
                <i class="bi bi-file-earmark-text"></i>
                <span>{{ getActiveContractsCount(company) }} ativo(s)</span>
              </div>
            </td>
            <td class="actions-cell">
              <button class="action-btn view-btn" title="Visualizar empresa" @click="viewCompany(company)">
                <i class="bi bi-eye"></i>
              </button>
              <button class="action-btn edit-btn" title="Editar empresa" @click="editCompany(company)">
                <i class="bi bi-pencil"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CompanyDetailsModal 
      :isOpen="isModalOpen"
      :company="selectedCompany"
      @close="closeModal"
      @save="handleSaveCompany"
    />
  </div>
</template>

<script>
import {
  getCompanies,
  getCompanyById,
  createCompanyMinimal,
  updateCompany,
} from '../../api/companies'
import CompanyDetailsModal from './CompanyDetailsModal.vue'
import { useToast } from '@/composables/useToast'

const { success, error } = useToast()

export default {
  name: 'CompaniesTable',
  components: {
    CompanyDetailsModal
  },
  props: {
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      companies: [],
      loading: false,
      isModalOpen: false,
      selectedCompany: null,
    }
  },
  watch: {
    filters: {
      handler() {
        this.fetchCompanies()
      },
      deep: true
    }
  },
  created() {
    this.fetchCompanies()
  },
  methods: {
    async fetchCompanies() {
      this.loading = true
      try {
        this.companies = await getCompanies(this.filters)
      } catch (e) {
        error('Erro ao carregar empresas')
      } finally {
        this.loading = false
      }
    },

    isCompanyComplete(company) {
      // Verifica se TODOS os campos estão preenchidos
      return !!(
        company.razaoSocial?.trim() &&
        company.nomeFantasia?.trim() &&
        company.cnpj?.trim() &&
        company.email?.trim() &&
        company.telefone?.trim() &&
        company.endereco?.trim() &&
        company.representanteLegal?.trim()
      )
    },

    getStatusClass(company) {
      return this.isCompanyComplete(company) ? 'status-active' : 'status-review'
    },

    getStatusText(company) {
      return this.isCompanyComplete(company) ? 'Completo' : 'Pré-cadastro'
    },

    getActiveContractsCount(company) {
      if (!company.contratos || !Array.isArray(company.contratos)) {
        if (company.propostas && Array.isArray(company.propostas)) {
          const contracts = company.propostas
            .filter(p => p.contrato)
            .map(p => p.contrato)
          if (contracts.length === 0) return 0
          company.contratos = contracts
        } else {
          return 0
        }
      }
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      return company.contratos.filter(contract => {
        if (!contract) return false
        
        if (contract.statusContrato === 'Ativo' || contract.statusContrato === 'Em_revisao') {
          if (contract.dataFim) {
            const dataFim = new Date(contract.dataFim)
            dataFim.setHours(0, 0, 0, 0)
            if (today > dataFim) return false
          }
          if (contract.dataInicio) {
            const dataInicio = new Date(contract.dataInicio)
            dataInicio.setHours(0, 0, 0, 0)
            if (today < dataInicio) return false
          }
          return true
        }
        
        if (contract.dataInicio && contract.dataFim) {
          const dataInicio = new Date(contract.dataInicio)
          const dataFim = new Date(contract.dataFim)
          dataInicio.setHours(0, 0, 0, 0)
          dataFim.setHours(0, 0, 0, 0)
          return today >= dataInicio && today <= dataFim && contract.statusContrato !== 'Encerrado' && contract.statusContrato !== 'Rescindido'
        }
        
        return contract.statusContrato === 'Ativo'
      }).length
    },

    async addCompany() {
      const nomeFantasia = prompt('Nome fantasia (obrigatório):')
      const email = prompt('Email (obrigatório):')
      const contato = prompt('Contato:')
      if (!nomeFantasia || !email) {
        error('Nome fantasia e email são obrigatórios')
        return
      }

      try {
        await createCompanyMinimal({ nomeFantasia, email, contato })
        await this.fetchCompanies()
        success('Empresa adicionada com sucesso!')
      } catch (err) {
        error('Erro ao criar empresa')
      }
    },

    async viewCompany(company) {
      try {
        const data = await getCompanyById(company.idEmpresa)
        this.selectedCompany = data
        this.isModalOpen = true
      } catch (err) {
        error('Erro ao carregar detalhes da empresa')
      }
    },

    editCompany(company) {
      this.selectedCompany = company
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
      this.selectedCompany = null
    },

    async handleSaveCompany(editedCompany) {
      try {
        await updateCompany(editedCompany.idEmpresa, editedCompany)
        await this.fetchCompanies()
        this.closeModal()
        success('Empresa atualizada com sucesso!')
      } catch (err) {
        error('Erro ao atualizar empresa')
        throw err
      }
    },
  },
}
</script>

<style scoped>
.companies-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem 1.5rem 0;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 1rem 0;
}

.table-wrapper {
  overflow-x: auto;
}

.companies-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.companies-table thead {
  background: #f8f9fa;
}

.companies-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  white-space: nowrap;
}

.companies-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: top;
}

.table-row:hover {
  background: #f8f9fa;
}

/* Company Cell */
.company-cell {
  min-width: 200px;
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.company-name {
  font-weight: 600;
  color: #000;
  font-size: 0.9rem;
}

.company-subtitle {
  font-size: 0.8rem;
  color: #6c757d;
}

/* CNPJ Cell */
.cnpj-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #495057;
  min-width: 140px;
}

/* Contact Cell */
.contact-cell {
  min-width: 180px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-email {
  font-size: 0.85rem;
  color: #495057;
}

.contact-phone {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Location Cell */
.location-cell {
  color: #495057;
  min-width: 120px;
}

/* Status Cell */
.status-cell {
  min-width: 100px;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-review {
  background: #fff3cd;
  color: #856404;
}

/* Contracts Cell */
.contracts-cell {
  min-width: 100px;
}

.contracts-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
}

.contracts-info i {
  font-size: 1rem;
  color: #6c757d;
}

.contracts-info span {
  font-weight: 600;
  font-size: 0.9rem;
}

/* Actions Cell */
.actions-cell {
  min-width: 120px;
}

.action-btn {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.25rem;
}

.action-btn:hover {
  background: #e9ecef;
}

.action-btn i {
  font-size: 1rem;
  color: #6c757d;
}

.view-btn:hover i {
  color: #00695c;
}

.edit-btn:hover i {
  color: #0066cc;
}

/* Responsive */
@media (max-width: 1200px) {
  .companies-table th,
  .companies-table td {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 768px) {
  .table-header {
    padding: 1rem 1rem 0;
  }
  
  .companies-table th,
  .companies-table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .company-name,
  .contact-email {
    font-size: 0.8rem;
  }
  
  .company-subtitle,
  .contact-phone {
    font-size: 0.75rem;
  }
  
  .status-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .companies-table-container {
    border-radius: 8px;
  }
  
  .table-title {
    font-size: 1.1rem;
  }
  
  .companies-table th,
  .companies-table td {
    padding: 0.5rem;
  }
}
</style>
