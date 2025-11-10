<template>
  <div class="companies-table-container">
    <div class="table-header">
      <h3 class="table-title">Empresas ({{ companies.length }})</h3>
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
          <tr v-for="company in companies" :key="company.id" class="table-row">
            <td class="company-cell">
              <div class="company-info">
                <div class="company-name">{{ company.name }}</div>
                <div class="company-subtitle">{{ company.fullName }}</div>
              </div>
            </td>
            <td class="cnpj-cell">{{ company.cnpj }}</td>
            <td class="contact-cell">
              <div class="contact-info">
                <div class="contact-email">{{ company.email }}</div>
                <div class="contact-phone">{{ company.phone }}</div>
              </div>
            </td>
            <td class="location-cell">{{ company.location }}</td>
            <td class="status-cell">
              <span :class="['status-badge', `status-${company.status}`]">
                {{ company.statusText }}
              </span>
            </td>
            <td class="contracts-cell">
              <div class="contracts-info">
                <i class="bi bi-file-earmark-text"></i>
                <span>{{ company.contracts }}</span>
              </div>
            </td>
            <td class="actions-cell">
              <button class="action-btn view-btn" title="Visualizar empresa">
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompaniesTable',
  data() {
    return {
      companies: [
        {
          id: 1,
          name: 'TechCorp Inc.',
          fullName: 'TechCorp Incorporations LLC',
          cnpj: '12.345.678/0001-90',
          email: 'john.smith@company.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          status: 'active',
          statusText: 'Ativo',
          contracts: 3
        },
        {
          id: 2,
          name: 'TechCorp Inc.',
          fullName: 'TechCorp Incorporations LLC',
          cnpj: '12.345.678/0001-90',
          email: 'john.smith@company.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          status: 'inactive',
          statusText: 'Inativo',
          contracts: 3
        },
        {
          id: 3,
          name: 'TechCorp Inc.',
          fullName: 'TechCorp Incorporations LLC',
          cnpj: '12.345.678/0001-90',
          email: 'john.smith@company.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          status: 'review',
          statusText: 'Revisão',
          contracts: 3
        }
      ]
    }
  }
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
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  min-width: 80px;
}

.action-btn {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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
