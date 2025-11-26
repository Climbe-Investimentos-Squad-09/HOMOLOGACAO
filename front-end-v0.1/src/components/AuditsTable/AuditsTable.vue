<template>
  <div class="audits-table-container">
    <div class="table-header">
      <h3 class="table-title">Registros de Auditoria ({{ total }})</h3>
    </div>
    
    <div class="table-wrapper">
      <table class="audits-table">
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Entidade</th>
            <th>Ação</th>
            <th>ID Entidade</th>
            <th>Usuário</th>
            <th>IP</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="7" class="loading-cell">
              <div class="loading-spinner"></div>
              Carregando registros...
            </td>
          </tr>
          <tr v-else-if="audits.length === 0" class="empty-row">
            <td colspan="7" class="empty-cell">
              Nenhum registro encontrado
            </td>
          </tr>
          <tr v-for="audit in audits" :key="audit.id" v-else class="table-row">
            <td class="date-cell">
              <div class="date-info">
                <div class="date">{{ formatDate(audit.createdAt) }}</div>
                <div class="time">{{ formatTime(audit.createdAt) }}</div>
              </div>
            </td>
            <td class="entity-cell">
              <span class="entity-badge">{{ audit.entity }}</span>
            </td>
            <td class="action-cell">
              <span :class="['action-badge', getActionClass(audit.action)]">
                {{ getActionText(audit.action) }}
              </span>
            </td>
            <td class="entity-id-cell">{{ audit.entityId || '—' }}</td>
            <td class="user-cell">
              <div v-if="loadingUsers[audit.userId]" class="user-loading">
                <div class="mini-spinner"></div>
              </div>
              <span v-else>{{ audit.userName || 'Sistema' }}</span>
            </td>
            <td class="ip-cell">{{ audit.ip || '—' }}</td>
            <td class="actions-cell">
              <button class="action-btn view-btn" title="Ver detalhes" @click="viewDetails(audit)">
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && totalPages > 1" class="pagination">
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1"
        @click="goToPage(1)"
      >
        <i class="bi bi-chevron-double-left"></i>
      </button>
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      
      <div class="pagination-info">
        Página {{ currentPage }} de {{ totalPages }}
      </div>
      
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages"
        @click="goToPage(totalPages)"
      >
        <i class="bi bi-chevron-double-right"></i>
      </button>
    </div>

    <AuditDetailsModal 
      :isOpen="isModalOpen"
      :audit="selectedAudit"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { getAudits } from '../../api/audits'
import { getUserById } from '../../api/users'
import AuditDetailsModal from './AuditDetailsModal.vue'

export default {
  name: 'AuditsTable',
  components: {
    AuditDetailsModal
  },
  props: {
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      allAudits: [],
      loading: false,
      loadingUsers: {},
      isModalOpen: false,
      selectedAudit: null,
      currentPage: 1,
      limit: 15,
      userCache: {}
    }
  },
  computed: {
    total() {
      return this.allAudits.length
    },
    totalPages() {
      return Math.ceil(this.total / this.limit)
    },
    audits() {
      const start = (this.currentPage - 1) * this.limit
      const end = start + this.limit
      return this.allAudits.slice(start, end)
    }
  },
  watch: {
    filters: {
      handler() {
        this.currentPage = 1
        this.fetchAudits()
      },
      deep: true
    }
  },
  created() {
    this.fetchAudits()
  },
  methods: {
    async fetchAudits() {
      this.loading = true
      try {
        const response = await getAudits(this.filters)
        
        // Se a API retornar com paginação
        if (response.data && Array.isArray(response.data)) {
          this.allAudits = response.data
        } else if (Array.isArray(response)) {
          // Se retornar array direto
          this.allAudits = response
        } else {
          this.allAudits = []
        }
        
        // Buscar nomes dos usuários
        await this.loadUserNames()
      } catch (e) {
        console.error('Erro ao carregar auditorias', e)
        alert('Erro ao carregar registros de auditoria')
      } finally {
        this.loading = false
      }
    },

    async loadUserNames() {
      const userIds = [...new Set(
        this.allAudits
          .filter(a => a.userId)
          .map(a => a.userId)
      )]

      for (const userId of userIds) {
        if (this.userCache[userId]) {
          // Se já está em cache, usar
          this.allAudits.forEach(a => {
            if (a.userId === userId) {
              a.userName = this.userCache[userId]
            }
          })
        } else {
          // Buscar na API
          this.loadingUsers[userId] = true
          try {
            const user = await getUserById(userId)
            const userName = user.name || user.nome || `Usuário ${userId}`
            this.userCache[userId] = userName
            
            // Atualizar todos os audits deste usuário
            this.allAudits.forEach(a => {
              if (a.userId === userId) {
                a.userName = userName
              }
            })
          } catch (e) {
            console.error(`Erro ao buscar usuário ${userId}`, e)
            this.userCache[userId] = `Usuário ${userId}`
            this.allAudits.forEach(a => {
              if (a.userId === userId) {
                a.userName = `Usuário ${userId}`
              }
            })
          } finally {
            this.loadingUsers[userId] = false
          }
        }
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        // Scroll para o topo da tabela
        this.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR')
    },

    formatTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleTimeString('pt-BR')
    },

    getActionClass(action) {
      const classes = {
        'CREATE': 'action-create',
        'UPDATE': 'action-update',
        'DELETE': 'action-delete',
        'ASSIGN': 'action-assign',
        'STATUS_CHANGE': 'action-status'
      }
      return classes[action] || 'action-default'
    },

    getActionText(action) {
      const texts = {
        'CREATE': 'Criar',
        'UPDATE': 'Atualizar',
        'DELETE': 'Excluir',
        'ASSIGN': 'Atribuir',
        'STATUS_CHANGE': 'Status'
      }
      return texts[action] || action
    },

    getMethodClass(method) {
      const classes = {
        'GET': 'method-get',
        'POST': 'method-post',
        'PUT': 'method-put',
        'PATCH': 'method-patch',
        'DELETE': 'method-delete'
      }
      return classes[method] || 'method-default'
    },

    viewDetails(audit) {
      this.selectedAudit = audit
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
      this.selectedAudit = null
    }
  }
}
</script>

<style scoped>
.audits-table-container {
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

.audits-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.audits-table thead {
  background: #f8f9fa;
}

.audits-table th {
  padding: 1rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  white-space: nowrap;
  font-size: 0.8rem;
}

.audits-table td {
  padding: 1rem 1rem;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
}

.table-row:hover {
  background: #f8f9fa;
}

.loading-row,
.empty-row {
  text-align: center;
}

.loading-cell,
.empty-cell {
  padding: 3rem 1rem !important;
  color: #6c757d;
  font-size: 0.9rem;
}

.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #00695c;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Date Cell */
.date-cell {
  min-width: 120px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.date {
  font-weight: 600;
  color: #000;
  font-size: 0.85rem;
}

.time {
  font-size: 0.75rem;
  color: #6c757d;
}

/* Entity Cell */
.entity-cell {
  min-width: 120px;
}

.entity-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #e7f3ff;
  color: #0066cc;
  text-transform: capitalize;
}

/* Action Cell */
.action-cell {
  min-width: 100px;
}

.action-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.action-create {
  background: #d4edda;
  color: #155724;
}

.action-update {
  background: #fff3cd;
  color: #856404;
}

.action-delete {
  background: #f8d7da;
  color: #721c24;
}

.action-assign {
  background: #d1ecf1;
  color: #0c5460;
}

.action-status {
  background: #e2e3e5;
  color: #383d41;
}

.action-default {
  background: #f8f9fa;
  color: #495057;
}

/* Method Cell */
.method-cell {
  min-width: 80px;
}

.method-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: monospace;
}

.method-get {
  background: #d4edda;
  color: #155724;
}

.method-post {
  background: #d1ecf1;
  color: #0c5460;
}

.method-put,
.method-patch {
  background: #fff3cd;
  color: #856404;
}

.method-delete {
  background: #f8d7da;
  color: #721c24;
}

.method-default {
  background: #e9ecef;
  color: #495057;
}

/* Other Cells */
.entity-id-cell,
.ip-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #495057;
  min-width: 80px;
}

.user-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #495057;
  min-width: 80px;
}

.user-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mini-spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #00695c;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 1s linear infinite;
}

.path-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #6c757d;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.pagination-btn {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
}

.pagination-btn:not(:disabled):hover {
  background: #f8f9fa;
  border-color: #00695c;
  color: #00695c;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  padding: 0 1rem;
  font-size: 0.85rem;
  color: #495057;
  font-weight: 500;
}

/* Actions Cell */
.actions-cell {
  min-width: 60px;
}

.action-btn {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #e9ecef;
}

.action-btn i {
  font-size: 0.95rem;
  color: #6c757d;
}

.view-btn:hover i {
  color: #00695c;
}

/* Responsive */
@media (max-width: 1400px) {
  .audits-table th,
  .audits-table td {
    padding: 0.75rem 0.75rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .table-header {
    padding: 1rem 1rem 0;
  }
  
  .audits-table th,
  .audits-table td {
    padding: 0.5rem 0.5rem;
    font-size: 0.7rem;
  }
}
</style>
