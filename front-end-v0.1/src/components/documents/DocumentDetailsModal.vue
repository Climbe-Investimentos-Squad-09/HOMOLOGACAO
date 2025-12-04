<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emitClose">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>{{ document?.name }}</h3>
        <button class="close-btn" @click="emitClose" title="Fechar">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div class="modal-body" v-if="document">
        <div class="info-grid">
          <div class="info-field">
            <label>Nome do Documento</label>
            <p class="info-value">{{ document.name }}</p>
          </div>
          <div class="info-field">
            <label>Tipo</label>
            <p class="info-value">{{ document.tipo_documento }}</p>
          </div>
          <div class="info-field">
            <label>Empresa</label>
            <p class="info-value">{{ document.empresa?.nomeFantasia || '—' }}</p>
          </div>
          <div class="info-field">
            <label>Contrato</label>
            <p class="info-value mono">{{ document.idContrato ? `CTR-${document.idContrato}` : '—' }}</p>
          </div>
          <div class="info-field">
            <label>Status</label>
            <span :class="['status-badge', getStatusClass(document.status)]">{{ document.status || '—' }}</span>
          </div>
          <div class="info-field">
            <label>Responsável</label>
            <p class="info-value">{{ document.responsavel?.nomeCompleto || '—' }}</p>
          </div>
          <div class="info-field">
            <label>Data de Criação</label>
            <p class="info-value">{{ formatDate(document.dataCriacao) }}</p>
          </div>
        </div>

        <div v-if="document.driveLink" class="document-section">
          <h4>Documento</h4>
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
              :src="getEmbedUrl(document.driveLink)" 
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
  name: 'DocumentDetailsModal',
  props: {
    isOpen: { type: Boolean, default: false },
    document: { type: Object, default: null }
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
    getStatusClass(status) {
      switch (status) {
        case 'Aceito':
        case 'Validado':
          return 'status-accepted'
        case 'Rejeitado':
          return 'status-rejected'
        case 'Revisão':
          return 'status-review'
        default:
          return ''
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
      if (!this.document?.driveLink) return
      
      let downloadUrl = this.document.driveLink
      
      if (downloadUrl.includes('/view')) {
        downloadUrl = downloadUrl.replace('/view', '/view?usp=sharing')
      }
      
      if (downloadUrl.includes('/file/d/')) {
        const match = downloadUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
        if (match) {
          downloadUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`
        }
      }
      
      window.open(downloadUrl, '_blank')
    }
  }
}
</script>

<style scoped>
.modal-overlay { 
  position: fixed; 
  inset: 0; 
  background: rgba(0,0,0,.5); 
  display:flex; 
  align-items:center; 
  justify-content:center; 
  z-index:10000; 
  backdrop-filter: blur(2px); 
  padding:1rem; 
}
.modal-container { 
  background:#fff; 
  border-radius:12px; 
  width:100%; 
  max-width:900px; 
  max-height:90vh; 
  overflow:hidden; 
  display:flex; 
  flex-direction:column; 
  box-shadow:0 10px 40px rgba(0,0,0,.2); 
}
.modal-header { 
  display:flex; 
  justify-content:space-between; 
  align-items:center; 
  padding:1.25rem 1.5rem; 
  border-bottom:1px solid #dee2e6; 
}
.modal-header h3 { 
  margin:0; 
  font-size:1.2rem; 
  font-weight:600; 
}
.close-btn { 
  background: linear-gradient(135deg,#6c757d,#495057); 
  border:none; 
  color:#fff; 
  cursor:pointer; 
  padding:.5rem; 
  min-width:44px; 
  min-height:44px; 
  display:flex; 
  align-items:center; 
  justify-content:center; 
  border-radius:50%; 
  font-size:1.4rem; 
  transition:all .2s cubic-bezier(.4,0,.2,1); 
  position:relative; 
}
.close-btn::before { 
  content:''; 
  position:absolute; 
  inset:-2px; 
  border-radius:50%; 
  padding:2px; 
  background:linear-gradient(135deg,#dc3545,#c82333); 
  -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
  -webkit-mask-composite:xor; 
  mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
  mask-composite:exclude; 
  opacity:0; 
  transition:opacity .2s; 
}
.close-btn:hover { 
  background:linear-gradient(135deg,#dc3545,#c82333); 
  transform:scale(1.1) rotate(90deg); 
  box-shadow:0 4px 16px rgba(220,53,69,.4); 
}
.close-btn:hover::before { 
  opacity:1; 
}
.close-btn:active { 
  transform:scale(.95) rotate(90deg); 
  box-shadow:0 2px 4px rgba(220,53,69,.3); 
}
.modal-body { 
  padding:1.25rem 1.5rem; 
  overflow-y:auto; 
  flex:1; 
}
.info-grid { 
  display:grid; 
  grid-template-columns:repeat(2,1fr); 
  gap:1.25rem; 
  margin-bottom: 1.5rem;
}
@media (max-width: 768px){ 
  .info-grid { 
    grid-template-columns:1fr; 
  } 
  .modal-container { 
    max-height:95vh; 
  } 
}
.info-field { 
  display:flex; 
  flex-direction:column; 
  gap:.4rem; 
}
.info-field label { 
  font-size:.65rem; 
  font-weight:600; 
  color:#6c757d; 
  text-transform:uppercase; 
  letter-spacing:.5px; 
}
.info-value { 
  margin:0; 
  font-size:.9rem; 
  color:#000; 
}
.info-value.mono { 
  font-family:'Courier New', monospace; 
  font-size:.85rem; 
}
.status-badge { 
  padding:.3rem .6rem; 
  border-radius:6px; 
  font-size:.7rem; 
  font-weight:600; 
  text-transform:uppercase; 
  width:fit-content; 
}
.status-accepted { 
  background:#d4edda; 
  color:#155724; 
}
.status-rejected { 
  background:#f8d7da; 
  color:#721c24; 
}
.status-review { 
  background:#fff3cd; 
  color:#856404; 
}
.document-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}
.document-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #495057;
}
.document-actions {
  margin-bottom: 1rem;
}
.download-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #3C6E6C;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.download-button:hover {
  background-color: #4AA19D;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.iframe-container {
  width: 100%;
  height: 600px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
}
.document-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.no-document-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}
.modal-footer { 
  display:flex; 
  justify-content:flex-end; 
  gap:.75rem; 
  padding:1rem 1.5rem; 
  border-top:1px solid #dee2e6; 
}
.close-footer-btn { 
  padding:.6rem 1rem; 
  border:none; 
  border-radius:6px; 
  font-weight:500; 
  cursor:pointer; 
  transition:all .2s; 
  background:#f8f9fa; 
  color:#495057; 
  border:1px solid #dee2e6; 
}
.close-footer-btn:hover { 
  background:#e9ecef; 
}
.loading-section { 
  padding:2rem; 
  text-align:center; 
  font-style:italic; 
  color:#6c757d; 
}
</style>
