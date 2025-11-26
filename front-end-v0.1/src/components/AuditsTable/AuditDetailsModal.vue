<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Detalhes da Auditoria #{{ audit?.id }}</h3>
        <button class="close-btn" @click="closeModal">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="info-grid">
          <div class="info-field">
            <label>Data e Hora</label>
            <p class="info-value">{{ formatDateTime(audit?.createdAt) }}</p>
          </div>

          <div class="info-field">
            <label>Entidade</label>
            <p class="info-value">{{ audit?.entity }}</p>
          </div>

          <div class="info-field">
            <label>Ação</label>
            <span :class="['action-badge', getActionClass(audit?.action)]">
              {{ getActionText(audit?.action) }}
            </span>
          </div>

          <div class="info-field">
            <label>ID da Entidade</label>
            <p class="info-value mono">{{ audit?.entityId || '—' }}</p>
          </div>

          <div class="info-field">
            <label>Usuário ID</label>
            <p class="info-value mono">{{ audit?.userId || 'Sistema' }}</p>
          </div>

          <div class="info-field">
            <label>Endereço IP</label>
            <p class="info-value mono">{{ audit?.ip || '—' }}</p>
          </div>

          <div class="info-field">
            <label>Método HTTP</label>
            <span v-if="audit?.method" :class="['method-badge', getMethodClass(audit?.method)]">
              {{ audit?.method }}
            </span>
            <p v-else class="info-value">—</p>
          </div>

          <div class="info-field">
            <label>Endpoint</label>
            <p class="info-value mono">{{ audit?.path || '—' }}</p>
          </div>

          <div class="info-field full-width">
            <label>User Agent</label>
            <p class="info-value small">{{ audit?.userAgent || '—' }}</p>
          </div>
        </div>

        <div v-if="audit?.before || audit?.after" class="json-section">
          <div class="comparison-container">
            <div v-if="audit?.before" class="json-block before-block">
              <h4>
                <i class="bi bi-file-earmark-minus"></i>
                Estado Anterior
              </h4>
              <pre class="json-content">{{ formatJSON(audit.before) }}</pre>
            </div>

            <div v-if="audit?.after" class="json-block after-block">
              <h4>
                <i class="bi bi-file-earmark-plus"></i>
                Estado Posterior
              </h4>
              <pre class="json-content">{{ formatJSON(audit.after) }}</pre>
            </div>
          </div>
        </div>

        <div v-if="audit?.extra" class="json-section">
          <div class="json-block">
            <h4>Dados Extras</h4>
            <pre class="json-content">{{ formatJSON(audit.extra) }}</pre>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="close-footer-btn" @click="closeModal">
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditDetailsModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    audit: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close')
    },

    formatDateTime(dateString) {
      if (!dateString) return '—'
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR')
    },

    formatJSON(obj) {
      if (!obj) return ''
      return JSON.stringify(obj, null, 2)
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
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 900px;
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
  margin-bottom: 1.5rem;
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
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  margin: 0;
  font-size: 0.95rem;
  color: #000;
  padding: 0.5rem 0;
}

.info-value.mono {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.info-value.small {
  font-size: 0.85rem;
  color: #495057;
  word-break: break-all;
}

.action-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  width: fit-content;
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

.method-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
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

.json-section {
  margin-top: 1.5rem;
}

.comparison-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .comparison-container {
    grid-template-columns: 1fr;
  }
}

.json-block {
  margin-bottom: 1rem;
}

.before-block h4 {
  color: #856404;
}

.after-block h4 {
  color: #155724;
}

.json-block h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.json-block h4 i {
  font-size: 1rem;
}

.json-content {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #212529;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
  line-height: 1.5;
}

.before-block .json-content {
  border-left: 3px solid #856404;
}

.after-block .json-content {
  border-left: 3px solid #155724;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.close-footer-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.close-footer-btn:hover {
  background: #e9ecef;
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
