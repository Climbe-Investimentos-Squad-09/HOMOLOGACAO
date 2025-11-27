<template>
  <div class="contracts-table-container card">
    <h2 class="card-title">Contratos ({{ contracts.length }})</h2>

    <div v-if="loading" class="loading-message">
      <p>Carregando contratos...</p>
    </div>

    <div v-else-if="contracts.length === 0" class="no-contracts-message">
      <p>Nenhum contrato encontrado.</p>
    </div>

    <table v-else class="contracts-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Empresa</th>
          <th>Status</th>
          <th>Valor</th>
          <th>Período</th>
          <th>Responsável</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contract in contracts" :key="contract.id">
          <td>{{ contract.id }}</td>
          <td>{{ contract.title }}</td>
          <td>{{ contract.company }}</td>
          <td>
            <span :class="[
              'status-badge',
              getStatusClass(contract.status)
            ]">
              {{ contract.status }}
            </span>
          </td>
          <td>R$ {{ contract.value }}</td>
          <td>{{ contract.inicialDate }} to {{ contract.finalDate }}</td>
          <td>
            <span class="responsible-badge">
              {{ contract.responsible }}
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
            <button class="action-icon-button" :title="contract.status === 'Rascunho' ? 'Enviar' : 'Download'">
              <svg v-if="contract.status === 'Rascunho'" width="32" height="32" viewBox="0 0 32 32" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" />
                <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#DFDFDF" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M21.9909 10.01L9.39895 14.563L13.5939 16.991L17.2929 13.291C17.4806 13.1035 17.735 12.9982 18.0003 12.9983C18.2656 12.9984 18.5199 13.1039 18.7074 13.2915C18.895 13.4791 19.0002 13.7336 19.0001 13.9989C19.0001 14.2641 18.8946 14.5185 18.7069 14.706L15.0069 18.406L17.4369 22.6L21.9909 10.01ZM22.3139 7.766C23.5089 7.333 24.6669 8.491 24.2339 9.686L18.9519 24.291C18.5179 25.489 16.8819 25.635 16.2429 24.532L13.0259 18.974L7.46794 15.757C6.36494 15.118 6.51095 13.482 7.70895 13.048L22.3139 7.766Z"
                  fill="black" />
              </svg>

              <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  contracts: {
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
    case 'Ativo':
      return 'status-active';
    case 'Inativo':
      return 'status-inactive';
    case 'Rascunho':
      return 'status-draft';
    case 'Revisão':
      return 'status-review';
    default:
      return '';
  }
};
</script>

<style scoped>
.contracts-table-container {
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

.no-contracts-message,
.loading-message {
  text-align: center;
  padding: 2rem;
  color: #6C757D;
  font-style: italic;
}

.contracts-table {
  width: 100%;
  border-collapse: collapse;
}

.contracts-table th,
.contracts-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #E9ECEF;
}

.contracts-table th {
  background-color: #F8F9FA;
  font-weight: 600;
  color: #495057;
}

.contracts-table tbody tr:last-child td {
  border-bottom: none;
}

.contracts-table tbody tr:hover {
  background-color: #F8F9FA;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-active {
  background-color: #B6F8BB;
  color: #018D0B;
  border: #B5EDB9 1px solid;
}

.status-inactive {
  background-color: #FFCFCF;
  color: #AE3B3B;
  border: #FFB9B9 1px solid;
}

.status-draft {
  background-color: #F6F6F6;
  color: #6B6B6B;
  border: #E9E9E9 1px solid;
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