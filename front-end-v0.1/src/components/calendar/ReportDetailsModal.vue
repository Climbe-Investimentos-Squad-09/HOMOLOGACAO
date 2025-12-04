<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emitClose">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>Relatório: {{ report?.titulo }}</h3>
        <button class="close-btn" @click="emitClose" title="Fechar">
          ✕
        </button>
      </div>

      <div class="modal-body" v-if="report">
        <div class="info-grid">
          <div class="info-field">
            <label>Título</label>
            <p class="info-value">{{ report.titulo }}</p>
          </div>
          <div class="info-field">
            <label>Empresa</label>
            <p class="info-value">{{ report.empresa?.nomeFantasia || '—' }}</p>
          </div>
          <div class="info-field" v-if="report.contrato">
            <label>Contrato</label>
            <p class="info-value">#{{ report.contrato.idContrato }}</p>
          </div>
          <div class="info-field" v-if="report.responsavel">
            <label>Responsável</label>
            <p class="info-value">{{ report.responsavel.nomeCompleto }}</p>
          </div>
          <div class="info-field">
            <label>Data de Criação</label>
            <p class="info-value">{{ formatDate(report.dataCriacao) }}</p>
          </div>
          <div class="info-field full-width" v-if="report.descricao">
            <label>Descrição</label>
            <p class="info-value">{{ report.descricao }}</p>
          </div>
        </div>

        <div v-if="report.driveLink" class="document-section">
          <h4>Documento Anexado</h4>
          <div class="document-actions">
            <button class="download-button" @click="downloadDocument">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 20L11 15L12.4 13.55L15 16.15V8H17V16.15L19.6 13.55L21 15L16 20ZM10 24C9.45 24 8.97933 23.8043 8.588 23.413C8.19667 23.0217 8.00067 22.5507 8 22V19H10V22H22V19H24V22C24 22.55 23.8043 23.021 23.413 23.413C23.0217 23.805 22.5507 24.0007 22 24H10Z"
                  fill="white" />
              </svg>
              Baixar PDF
            </button>
          </div>
          <div class="iframe-container">
            <iframe 
              :src="getEmbedUrl(report.driveLink)" 
              frameborder="0"
              class="document-iframe"
            ></iframe>
          </div>
        </div>
        <div v-else class="no-document-message">
          <p>Nenhum documento anexado</p>
        </div>
      </div>

      <div v-else class="loading-section">
        <p>Carregando detalhes...</p>
      </div>

      <div class="modal-footer">
        <button class="close-footer-btn" @click="emitClose">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportDetailsModal',
  props: {
    isOpen: { type: Boolean, default: false },
    report: { type: Object, default: null }
  },
  emits: ['close'],
  methods: {
    emitClose() { this.$emit('close') },
    formatDate(d) { 
      if (!d) return '—'
      try {
        return new Date(d).toLocaleDateString('pt-BR')
      } catch {
        return d
      }
    },
    getEmbedUrl(url) {
      if (!url) return ''
      if (url.includes('/view')) {
        return url.replace('/view', '/preview')
      }
      if (url.includes('/file/d/')) {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
        if (match) {
          return `https://drive.google.com/file/d/${match[1]}/preview`
        }
      }
      return url
    },
    downloadDocument() {
      if (this.report?.driveLink) {
        const downloadUrl = this.report.driveLink.replace('/view?usp=sharing', '')
        window.open(downloadUrl, '_blank')
      }
    }
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

.modal-container {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E9ECEF;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6C757D;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #212529;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-field.full-width {
  grid-column: 1 / -1;
}

.info-field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6C757D;
}

.info-value {
  margin: 0;
  font-size: 1rem;
  color: #212529;
}

.document-section {
  margin-top: 1.5rem;
}

.document-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
}

.document-actions {
  margin-bottom: 1rem;
}

.download-button {
  background-color: #3C6E6C;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.download-button:hover {
  background-color: #4AA19D;
}

.iframe-container {
  width: 100%;
  height: 600px;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  overflow: hidden;
}

.document-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.no-document-message {
  text-align: center;
  padding: 2rem;
  color: #6C757D;
  font-style: italic;
}

.loading-section {
  text-align: center;
  padding: 2rem;
  color: #6C757D;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #E9ECEF;
  display: flex;
  justify-content: flex-end;
}

.close-footer-btn {
  background-color: #6C757D;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.close-footer-btn:hover {
  background-color: #5A6268;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .iframe-container {
    height: 400px;
  }
}
</style>

