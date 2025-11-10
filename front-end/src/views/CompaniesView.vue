<template>
  <div class="companies-container">
    <!-- Header com logo e título -->
    <header class="companies-header">
      <div class="header-left">
        <div class="logo-section">
          <h1 class="logo">climbe</h1>
          <p class="logo-subtitle">Investimentos independentes</p>
        </div>
        <h2 class="page-title">Empresas</h2>
      </div>
      <div class="header-right">
        <button class="action-btn profile-btn" title="Perfil">
          <i class="bi bi-person"></i>
        </button>
        <button class="action-btn notification-btn" title="Notificações">
          <i class="bi bi-bell"></i>
        </button>
        <button class="action-btn help-btn" title="Ajuda">
          <i class="bi bi-question-circle"></i>
        </button>
      </div>
    </header>

    <!-- Sidebar de navegação -->
    <aside class="sidebar">
      <nav class="nav-menu">
        <router-link to="/main" class="nav-item">
          <i class="bi bi-grid"></i>
          <span>Tela inicial</span>
        </router-link>
        <a href="#" class="nav-item">
          <i class="bi bi-calendar"></i>
          <span>Calendário</span>
        </a>
        <a href="#" class="nav-item">
          <i class="bi bi-file-text"></i>
          <span>Propostas</span>
        </a>
        <a href="#" class="nav-item">
          <i class="bi bi-file-earmark-text"></i>
          <span>Contratos</span>
        </a>
        <a href="#" class="nav-item">
          <i class="bi bi-folder"></i>
          <span>Documentos</span>
        </a>
        <router-link to="/companies" class="nav-item active">
          <i class="bi bi-building"></i>
          <span>Empresas</span>
        </router-link>
        <router-link to="/users" class="nav-item">
          <i class="bi bi-people"></i>
          <span>Usuários</span>
        </router-link>
        <a href="#" class="nav-item">
          <i class="bi bi-shield-check"></i>
          <span>Autorizações</span>
        </a>
      </nav>

      <!-- Perfil do usuário -->
      <div class="user-profile">
        <div class="profile-picture">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="profile-info">
          <p class="user-name">João Silva</p>
          <p class="user-role">Administrador</p>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <i class="bi bi-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-header">
        <button class="add-company-btn" @click="openModal">
          <i class="bi bi-plus"></i>
          <span>Adicionar empresa</span>
        </button>
      </div>

      <div class="search-filters">
        <div class="search-container">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Procure empresas..." class="search-input">
        </div>
        <button class="filters-btn">
          <i class="bi bi-funnel"></i>
          <span>Filtros</span>
          <i class="bi bi-chevron-down"></i>
        </button>
      </div>

      <!-- Componente da tabela de empresas -->
      <CompaniesTable />
    </main>

    <!-- Modal para adicionar empresa -->
    <AddCompanyModal 
      :isOpen="isModalOpen" 
      @close="closeModal"
      @add-company="handleAddCompany"
    />
  </div>
</template>

<script>
import CompaniesTable from '@/components/CompaniesTable/CompaniesTable.vue'
import AddCompanyModal from '@/components/AddCompanyModal.vue'

export default {
  name: 'CompaniesView',
  components: {
    CompaniesTable,
    AddCompanyModal
  },
  data() {
    return {
      isModalOpen: false
    }
  },
  methods: {
    handleLogout() {
      // Implementar lógica de logout aqui
      this.$router.push('/')
    },
    
    openModal() {
      this.isModalOpen = true
    },
    
    closeModal() {
      this.isModalOpen = false
    },
    
    handleAddCompany(companyData) {
      // Aqui você pode implementar a lógica para adicionar a empresa
      // Por exemplo, fazer uma chamada para a API
      console.log('Nova empresa:', companyData)
      
      // Por enquanto, apenas mostra um alerta
      alert('Empresa adicionada com sucesso!')
      
      // Em uma implementação real, você atualizaria a lista de empresas
      // this.$refs.companiesTable.addCompany(companyData)
    }
  }
}
</script>

<style scoped>
.companies-container {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header */
.companies-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-section {
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin: 0;
  line-height: 1;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #6c757d;
  margin: 0;
  line-height: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.action-btn:hover {
  background: #f8f9fa;
}

.action-btn i {
  font-size: 1.2rem;
  color: #6c757d;
}

/* Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 70px;
  width: 250px;
  height: calc(100vh - 70px);
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.nav-menu {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #e9ecef;
  color: #495057;
}

.nav-item.active {
  background: #e0f7fa;
  color: #00695c;
  border-left-color: #00695c;
}

.nav-item i {
  font-size: 1.1rem;
  width: 20px;
}

.nav-item span {
  font-size: 0.9rem;
  font-weight: 500;
}

/* User Profile */
.user-profile {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-picture i {
  font-size: 1.5rem;
  color: #6c757d;
}

.profile-info {
  flex: 1;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #000;
  margin: 0;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.2;
}

.logout-btn {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.logout-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.logout-btn i {
  font-size: 0.9rem;
  color: #6c757d;
}

.logout-btn span {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Main Content */
.main-content {
  margin-left: 250px;
  margin-top: 70px;
  padding: 2rem;
  flex: 1;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.add-company-btn {
  background: #00a86b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.add-company-btn:hover {
  background: #008f5a;
  transform: translateY(-1px);
}

.add-company-btn i {
  font-size: 1rem;
}

/* Search and Filters */
.search-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-container i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00695c;
  box-shadow: 0 0 0 3px rgba(0, 105, 92, 0.1);
}

.filters-btn {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #495057;
}

.filters-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.filters-btn i:first-child {
  font-size: 1rem;
}

.filters-btn i:last-child {
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .companies-header {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>
