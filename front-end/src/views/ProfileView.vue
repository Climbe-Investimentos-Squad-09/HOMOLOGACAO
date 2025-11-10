<template>
  <div class="profile-container">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <h1>climbe</h1>
          <p>Investimentos independentes</p>
        </div>
      </div>
      <div class="header-center">
        <h2 class="page-title">Perfil</h2>
      </div>
      <div class="header-right">
        <div class="header-icons">
          <button class="icon-btn help-btn">
            <span class="material-icons">help</span>
          </button>
          <button class="icon-btn notification-btn">
            <span class="material-icons">notifications</span>
          </button>
          <button class="icon-btn profile-btn">
            <span class="material-icons">person</span>
          </button>
        </div>
      </div>
    </header>

    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <a href="#" class="nav-item active">
            <span class="material-icons nav-icon">dashboard</span>
            Tela inicial
          </a>
          <a href="#" class="nav-item">
            <span class="material-icons nav-icon">calendar_today</span>
            Calendário
          </a>
          <a href="#" class="nav-item">
            <span class="material-icons nav-icon">description</span>
            Propostas
          </a>
          <a href="#" class="nav-item">
            <span class="material-icons nav-icon">handshake</span>
            Contratos
          </a>
          <a href="#" class="nav-item">
            <span class="material-icons nav-icon">folder</span>
            Documentos
          </a>
          <a href="#" class="nav-item">
            <span class="material-icons nav-icon">business</span>
            Empresas
          </a>
          <a href="#" class="nav-item">
            <span class="material-icons nav-icon">people</span>
            Usuários
          </a>
          <a href="#" class="nav-item">
            <span class="material-icons nav-icon">security</span>
            Autorizações
          </a>
        </nav>

        <div class="user-info">
          <div class="user-avatar">
            <div class="avatar-placeholder"></div>
          </div>
          <div class="user-details">
            <h3>João Silva</h3>
            <p>Administrador</p>
          </div>
          <button class="logout-btn">
            <span class="material-icons logout-icon">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Tabs -->
        <div class="tabs">
          <button class="tab active">Perfil</button>
          <button class="tab" @click="goToSettings">Configurações</button>
        </div>

        <!-- Profile Content -->
        <div class="profile-content">
          <div class="profile-main">
            <!-- Personal Information -->
            <div class="info-section">
              <h3>Informações pessoais:</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nome Completo:</label>
                  <input type="text" value="João Silva" />
                </div>
                <div class="form-group">
                  <label>CPF</label>
                  <input type="text" value="123456789-12" />
                </div>
                <div class="form-group">
                  <label>Email:</label>
                  <input type="email" value="joao.silva@empresa.com" />
                </div>
                <div class="form-group">
                  <label>Telefone</label>
                  <input type="tel" value="(11) 99999-9999" />
                </div>
                <div class="form-group cep-field">
                  <label>CEP</label>
                  <input type="text" value="00000-000" />
                </div>
                <div class="form-group">
                  <label>Rua/Avenida:</label>
                  <input type="text" placeholder="Insira rua/avenida" />
                </div>
                <div class="form-group">
                  <label>Número:</label>
                  <input type="text" placeholder="Insira o número da empresa" />
                </div>
                <div class="form-group">
                  <label>Bairro:</label>
                  <input type="text" placeholder="Insira o bairro" />
                </div>
                <div class="form-group">
                  <label>Cidade:</label>
                  <input type="text" placeholder="Insira a cidade onde reside a empresa" />
                </div>
              </div>
              <button class="save-btn">Salvar alterações</button>
            </div>

            <!-- Right Column -->
            <div class="right-column">
              <!-- Profile Photo -->
              
              <div class="photo-section">
                <h3>Foto do perfil:</h3>
                <div class="photo-container">
                  <div class="photo-placeholder"></div>
                <button class="change-photo-btn">
                  <span class="material-icons camera-icon">camera_alt</span>
                  Alterar foto
                </button>
                </div>
              </div>
              
              <!-- Account Information -->
              <div class="account-section">
                <h3>Informações da conta:</h3>
                <div class="account-info">
                  <div class="info-item">
                    <span class="label">Cargo:</span>
                    <span class="value">Administrador</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Membro desde:</span>
                    <span class="value">Janeiro 2024</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Permissões:</span>
                    <div class="permissions">
                      <span class="permission-tag">Documentos</span>
                      <span class="permission-tag">Empresas</span>
                      <span class="permission-tag">Contratos</span>
                      <span class="permission-tag">Propostas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    return {
      // Dados do perfil podem ser adicionados aqui
    }
  },
  methods: {
    goToSettings() {
      this.$router.push('/settings')
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left .logo h1 {
  margin: 0;
  color: #2ea89d;
  font-size: 1.5rem;
  font-weight: bold;
}

.header-left .logo p {
  margin: 0;
  color: #666;
  font-size: 0.8rem;
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
}

.header-icons {
  display: flex;
  gap: 1rem;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.icon-btn .material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 1.2rem;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

/* Main Layout */
.main-layout {
  display: flex;
  min-height: calc(100vh - 80px);
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #666;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #333;
}

.nav-item.active {
  background: #e3f2fd;
  color: #2ea89d;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 1.2rem;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

.user-info {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  margin-top: auto;
}

.user-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e9ecef;
}

.user-details h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #333;
}

.user-details p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.logout-btn {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  background: white;
  border: 1px solid #333;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  background: #f8f9fa;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: #e9ecef;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.tab.active {
  background: white;
  color: #333;
  font-weight: 600;
}

.profile-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.profile-main {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.profile-main .info-section {
  flex: 2;
}

.profile-main .right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-main .photo-section {
  width: 100%;
}

.photo-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.profile-main .account-section {
  width: 100%;
}

.account-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.info-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #2ea89d;
}

.cep-field {
  grid-column: 1 / -1;
}

.save-btn {
  background: #2ea89d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #25968c;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.photo-container {
  text-align: center;
}

.photo-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #e9ecef;
  margin: 0 auto 1rem;
}

.change-photo-btn {
  background: white;
  border: 1px solid #e9ecef;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin: 0 auto;
}

.camera-icon {
  font-size: 1rem;
}

.account-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.account-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
}

.value {
  color: #666;
}

.permissions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.permission-tag {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
  
  .profile-main {
    flex-direction: column;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
