<template>
  <div class="authorizations-table-container card">
    <h2 class="card-title">Autorizações pendentes ({{ authorizations.length }})</h2>

    <div v-if="loading" class="loading-message">
      <p>Carregando autorizações...</p>
    </div>

    <div v-else-if="authorizations.length === 0" class="no-authorizations-message">
      <p>Nenhuma autorização pendente encontrada.</p>
    </div>

    <table v-else class="authorizations-table">
      <thead>
        <tr>
          <th>Nome completo</th>
          <th>Email</th>
          <th>Categoria</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="auth in authorizations" :key="auth.id">
          <td>{{ auth.fullName }}</td>
          <td>{{ auth.email }}</td>
          <td>
            <span class="category-badge">
              {{ auth.category }}
            </span>
          </td>
          <td class="actions-cell">
            <button v-if="auth.category === 'Login'" class="action-icon-button approve-button" title="Aprovar" @click="$emit('approve', auth.rawUser)">
              <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" width="32" height="32" rx="8" fill="#B5EDB9" />
                <path
                  d="M16.5 26C17.8135 26.0016 19.1143 25.7437 20.3278 25.241C21.5412 24.7384 22.6434 24.0009 23.571 23.071C24.5009 22.1434 25.2384 21.0412 25.7411 19.8278C26.2437 18.6143 26.5016 17.3135 26.5 16C26.5016 14.6865 26.2437 13.3857 25.7411 12.1722C25.2384 10.9588 24.5009 9.85659 23.571 8.929C22.6434 7.99908 21.5412 7.26161 20.3278 6.75896C19.1143 6.25631 17.8135 5.99838 16.5 6C15.1866 5.99838 13.8857 6.25631 12.6723 6.75896C11.4588 7.26161 10.3566 7.99908 9.42901 8.929C8.49909 9.85659 7.76162 10.9588 7.25897 12.1722C6.75631 13.3857 6.49839 14.6865 6.50001 16C6.49839 17.3135 6.75631 18.6143 7.25897 19.8278C7.76162 21.0412 8.49909 22.1434 9.42901 23.071C10.3566 24.0009 11.4588 24.7384 12.6723 25.241C13.8857 25.7437 15.1866 26.0016 16.5 26Z"
                  stroke="#018D0B" stroke-width="2" stroke-linejoin="round" />
                <path d="M12.5 16L15.5 19L21.5 13" stroke="#018D0B" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
            <button v-if="auth.category === 'Login'" class="action-icon-button reject-button" title="Rejeitar" @click="$emit('reject', auth.rawUser)">
              <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="0.5" width="31" height="31" rx="7.5" fill="#FFCFCF" />
                <rect x="1" y="0.5" width="31" height="31" rx="7.5" stroke="#FFB9B9" />
                <path
                  d="M16.5 8C14.3783 8 12.3434 8.84285 10.8431 10.3431C9.34285 11.8434 8.5 13.8783 8.5 16C8.5 18.1217 9.34285 20.1566 10.8431 21.6569C12.3434 23.1571 14.3783 24 16.5 24C18.6217 24 20.6566 23.1571 22.1569 21.6569C23.6571 20.1566 24.5 18.1217 24.5 16C24.5 13.8783 23.6571 11.8434 22.1569 10.3431C20.6566 8.84285 18.6217 8 16.5 8ZM6.5 16C6.5 10.477 10.977 6 16.5 6C22.023 6 26.5 10.477 26.5 16C26.5 21.523 22.023 26 16.5 26C10.977 26 6.5 21.523 6.5 16ZM12.293 11.793C12.4805 11.6055 12.7348 11.5002 13 11.5002C13.2652 11.5002 13.5195 11.6055 13.707 11.793L16.5 14.586L19.293 11.793C19.3852 11.6975 19.4956 11.6213 19.6176 11.5689C19.7396 11.5165 19.8708 11.4889 20.0036 11.4877C20.1364 11.4866 20.2681 11.5119 20.391 11.5622C20.5139 11.6125 20.6255 11.6867 20.7194 11.7806C20.8133 11.8745 20.8875 11.9861 20.9378 12.109C20.9881 12.2319 21.0134 12.3636 21.0123 12.4964C21.0111 12.6292 20.9835 12.7604 20.9311 12.8824C20.8787 13.0044 20.8025 13.1148 20.707 13.207L17.914 16L20.707 18.793C20.8892 18.9816 20.99 19.2342 20.9877 19.4964C20.9854 19.7586 20.8802 20.0094 20.6948 20.1948C20.5094 20.3802 20.2586 20.4854 19.9964 20.4877C19.7342 20.49 19.4816 20.3892 19.293 20.207L16.5 17.414L13.707 20.207C13.5184 20.3892 13.2658 20.49 13.0036 20.4877C12.7414 20.4854 12.4906 20.3802 12.3052 20.1948C12.1198 20.0094 12.0146 19.7586 12.0123 19.4964C12.01 19.2342 12.1108 18.9816 12.293 18.793L15.086 16L12.293 13.207C12.1055 13.0195 12.0002 12.7652 12.0002 12.5C12.0002 12.2348 12.1055 11.9805 12.293 11.793Z"
                  fill="#AE3B3B" />
              </svg>
            </button>
            <button v-if="auth.category === 'Permissões'" class="action-icon-button approve-button" title="Aprovar" @click="$emit('approve', auth.rawUser)">
              <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" width="32" height="32" rx="8" fill="#B5EDB9" />
                <path
                  d="M16.5 26C17.8135 26.0016 19.1143 25.7437 20.3278 25.241C21.5412 24.7384 22.6434 24.0009 23.571 23.071C24.5009 22.1434 25.2384 21.0412 25.7411 19.8278C26.2437 18.6143 26.5016 17.3135 26.5 16C26.5016 14.6865 26.2437 13.3857 25.7411 12.1722C25.2384 10.9588 24.5009 9.85659 23.571 8.929C22.6434 7.99908 21.5412 7.26161 20.3278 6.75896C19.1143 6.25631 17.8135 5.99838 16.5 6C15.1866 5.99838 13.8857 6.25631 12.6723 6.75896C11.4588 7.26161 10.3566 7.99908 9.42901 8.929C8.49909 9.85659 7.76162 10.9588 7.25897 12.1722C6.75631 13.3857 6.49839 14.6865 6.50001 16C6.49839 17.3135 6.75631 18.6143 7.25897 19.8278C7.76162 21.0412 8.49909 22.1434 9.42901 23.071C10.3566 24.0009 11.4588 24.7384 12.6723 25.241C13.8857 25.7437 15.1866 26.0016 16.5 26Z"
                  stroke="#018D0B" stroke-width="2" stroke-linejoin="round" />
                <path d="M12.5 16L15.5 19L21.5 13" stroke="#018D0B" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
            <button v-if="auth.category === 'Permissões'" class="action-icon-button reject-button" title="Rejeitar" @click="$emit('reject', auth.rawUser)">
              <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="0.5" width="31" height="31" rx="7.5" fill="#FFCFCF" />
                <rect x="1" y="0.5" width="31" height="31" rx="7.5" stroke="#FFB9B9" />
                <path
                  d="M16.5 8C14.3783 8 12.3434 8.84285 10.8431 10.3431C9.34285 11.8434 8.5 13.8783 8.5 16C8.5 18.1217 9.34285 20.1566 10.8431 21.6569C12.3434 23.1571 14.3783 24 16.5 24C18.6217 24 20.6566 23.1571 22.1569 21.6569C23.6571 20.1566 24.5 18.1217 24.5 16C24.5 13.8783 23.6571 11.8434 22.1569 10.3431C20.6566 8.84285 18.6217 8 16.5 8ZM6.5 16C6.5 10.477 10.977 6 16.5 6C22.023 6 26.5 10.477 26.5 16C26.5 21.523 22.023 26 16.5 26C10.977 26 6.5 21.523 6.5 16ZM12.293 11.793C12.4805 11.6055 12.7348 11.5002 13 11.5002C13.2652 11.5002 13.5195 11.6055 13.707 11.793L16.5 14.586L19.293 11.793C19.3852 11.6975 19.4956 11.6213 19.6176 11.5689C19.7396 11.5165 19.8708 11.4889 20.0036 11.4877C20.1364 11.4866 20.2681 11.5119 20.391 11.5622C20.5139 11.6125 20.6255 11.6867 20.7194 11.7806C20.8133 11.8745 20.8875 11.9861 20.9378 12.109C20.9881 12.2319 21.0134 12.3636 21.0123 12.4964C21.0111 12.6292 20.9835 12.7604 20.9311 12.8824C20.8787 13.0044 20.8025 13.1148 20.707 13.207L17.914 16L20.707 18.793C20.8892 18.9816 20.99 19.2342 20.9877 19.4964C20.9854 19.7586 20.8802 20.0094 20.6948 20.1948C20.5094 20.3802 20.2586 20.4854 19.9964 20.4877C19.7342 20.49 19.4816 20.3892 19.293 20.207L16.5 17.414L13.707 20.207C13.5184 20.3892 13.2658 20.49 13.0036 20.4877C12.7414 20.4854 12.4906 20.3802 12.3052 20.1948C12.1198 20.0094 12.0146 19.7586 12.0123 19.4964C12.01 19.2342 12.1108 18.9816 12.293 18.793L15.086 16L12.293 13.207C12.1055 13.0195 12.0002 12.7652 12.0002 12.5C12.0002 12.2348 12.1055 11.9805 12.293 11.793Z"
                  fill="#AE3B3B" />
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
  authorizations: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['approve', 'reject', 'refresh']);
</script>

<style scoped>
.authorizations-table-container {
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

.no-authorizations-message,
.loading-message {
  text-align: center;
  padding: 2rem;
  color: #6C757D;
  font-style: italic;
}

.authorizations-table {
  width: 100%;
  border-collapse: collapse;
}

.authorizations-table th,
.authorizations-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #E9ECEF;
}

.authorizations-table th {
  background-color: #F8F9FA;
  font-weight: 600;
  color: #495057;
}

.authorizations-table tbody tr:last-child td {
  border-bottom: none;
}

.authorizations-table tbody tr:hover {
  background-color: #F8F9FA;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  background-color: #F6F6F6;
  color: #6B6B6B;
  border: 1px solid #E9E9E9;
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
  padding: 0;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-icon-button:hover {
  opacity: 0.7;
}

.approve-button svg circle {
  fill: #E6F6E6;
}

.approve-button svg path {
  stroke: #4CAF50;
}

.reject-button svg circle {
  fill: #FBE6E6;
}

.reject-button svg path {
  stroke: #F44336;
}

.view-button svg circle {
  stroke: #9E9E9E;
}

.view-button svg path {
  stroke: #9E9E9E;
}
</style>
