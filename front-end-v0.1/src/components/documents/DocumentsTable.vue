<template>
  <div class="documents-table-container card">
    <h2 class="card-title">Documentos ({{ documents.length }})</h2>

    <div v-if="loading" class="loading-message">
      <p>Carregando documentos...</p>
    </div>

    <div v-else-if="documents.length === 0" class="no-documents-message">
      <p>Nenhum documento encontrado.</p>
    </div>

    <table v-else class="documents-table">
      <thead>
        <tr>
          <th>Documento</th>
          <th>Tipo</th>
          <th>Empresa</th>
          <th>Contrato</th>
          <th>Status</th>
          <th>Data</th>
          <th>Responsável</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="document in documents" :key="document.id">
          <td class="document-cell">
            <div class="document-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M15.586 2C16.1164 2.00011 16.625 2.2109 17 2.586L20.414 6C20.7891 6.37499 20.9999 6.88361 21 7.414V16C21 16.5304 20.7893 17.0391 20.4142 17.4142C20.0391 17.7893 19.5304 18 19 18H17V20C17 20.5304 16.7893 21.0391 16.4142 21.4142C16.0391 21.7893 15.5304 22 15 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H8V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H15.586ZM8 8H6V20H15V18H10C9.46957 18 8.96086 17.7893 8.58579 17.4142C8.21071 17.0391 8 16.5304 8 16V8ZM14 4H10V16H19V9H15.5C15.1271 8.99998 14.7676 8.86108 14.4916 8.61038C14.2156 8.35968 14.0428 8.01516 14.007 7.644L14 7.5V4ZM16 4.414V7H18.586L16 4.414Z"
                  fill="black" />
              </svg>

              <span>{{ document.name }}</span>
            </div>
          </td>
          <td>{{ document.type }}</td>
          <td>{{ document.company }}</td>
          <td>
            <span class="contract-badge">{{ document.contract }}</span>
          </td>
          <td>
            <span :class="[
              'status-badge',
              getStatusClass(document.status)
            ]">
              {{ document.status }}
            </span>
          </td>
          <td>{{ document.date }}</td>
          <td>
            <span class="responsible-badge">
              {{ document.responsible }}
            </span>
          </td>
          <td class="actions-cell">
            <button class="action-icon-button" title="Visualizar">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" />
                <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#DFDFDF" />
                <path
                  d="M16 23C22.307 23 25.367 17.317 25.91 16.192C25.939 16.1322 25.9541 16.0665 25.9541 16C25.9541 15.9335 25.939 15.8678 25.91 15.808C25.368 14.683 22.308 9 16 9C9.692 9 6.633 14.683 6.09 15.808C6.06098 15.8678 6.0459 15.9335 6.0459 16C6.0459 16.0665 6.06098 16.1322 6.09 16.192C6.632 17.317 9.692 23 16 23Z"
                  stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13Z"
                  stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button class="action-icon-button" title="Download">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" />
                <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#DFDFDF" />
                <path
                  d="M16 20L11 15L12.4 13.55L15 16.15V8H17V16.15L19.6 13.55L21 15L16 20ZM10 24C9.45 24 8.97933 23.8043 8.588 23.413C8.19667 23.0217 8.00067 22.5507 8 22V19H10V22H22V19H24V22C24 22.55 23.8043 23.021 23.413 23.413C23.0217 23.805 22.5507 24.0007 22 24H10Z"
                  fill="black" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  documents: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const getStatusClass = (status) => {
  switch (status) {
    case 'Aceito':
    case 'Validado':
      return 'status-accepted';
    case 'Rejeitado':
      return 'status-rejected';
    case 'Revisão':
      return 'status-review';
    default:
      return '';
  }
};
</script>

<style scoped>
.documents-table-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #E9ECEF;
  margin-top: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.no-documents-message,
.loading-message {
  text-align: center;
  padding: 2rem;
  color: #6C757D;
  font-style: italic;
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
}

.documents-table th,
.documents-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #E9ECEF;
}

.documents-table th {
  background-color: #F8F9FA;
  font-weight: 600;
  color: #495057;
}

.documents-table tbody tr:last-child td {
  border-bottom: none;
}

.documents-table tbody tr:hover {
  background-color: #F8F9FA;
}

.document-cell {
  min-width: 250px;
}

.document-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.document-info svg {
  flex-shrink: 0;
}

.contract-badge {
  background-color: #F6F6F6;
  color: #6B6B6B;
  border: 1px solid #E9E9E9;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 400;
  display: inline-block;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-accepted {
  background-color: #B6F8BB;
  color: #018D0B;
  border: #B5EDB9 1px solid;
}

.status-rejected {
  background-color: #FFCFCF;
  color: #AE3B3B;
  border: #FFB9B9 1px solid;
}

.status-review {
  background-color: #FDFFCE;
  color: #B1A951;
  border: #E5E6B2 1px solid;
}

.actions-cell {
  white-space: nowrap;
}

.action-icon-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 0.5rem;
  color: #6C757D;
  transition: opacity 0.2s;
}

.action-icon-button:hover {
  opacity: 0.7;
}

.responsible-badge {
  background-color: #F6F6F6;
  color: #6B6B6B;
  border: 1px solid #E9E9E9;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.90rem;
  font-weight: 400;
  display: inline-block;
}
</style>
