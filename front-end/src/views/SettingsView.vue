<template>
  <div class="settings-container">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <h1>climbe</h1>
          <p>Investimentos independentes</p>
        </div>
      </div>
      <div class="header-center">
        <h2 class="page-title">Configurações</h2>
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
          <a href="#" class="nav-item">
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
          <button class="tab" @click="goToProfile">Perfil</button>
          <button class="tab active">Configurações</button>
        </div>

        <!-- Settings Content -->
        <div class="settings-content">
          <div class="settings-main">
            <!-- Change Password Section -->
            <div class="password-section">
              <h3>Alterar senha:</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Senha atual:</label>
                  <input type="password" v-model="currentPassword" />
                </div>
                <div class="form-group">
                  <label>Nova senha:</label>
                  <input type="password" v-model="newPassword" />
                </div>
                <div class="form-group">
                  <label>Confirmar nova senha:</label>
                  <input type="password" v-model="confirmPassword" />
                </div>
              </div>
              <button class="save-btn">Salvar alterações</button>
            </div>

            <!-- Request Permission Section -->
            <div class="permission-section">
              <h3>Solicitar permissão:</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Permissão:</label>
                  <select v-model="selectedPermission">
                    <option value="">Selecione uma permissão</option>
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerente</option>
                    <option value="user">Usuário</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Justificativa:</label>
                  <textarea v-model="justification" rows="4" placeholder="Descreva o motivo da solicitação..."></textarea>
                </div>
              </div>
              <button class="send-btn">Enviar</button>
            </div>
          </div>

          <!-- Notifications Section -->
          <div class="notifications-section">
            <h3>Notificações:</h3>
            <div class="notification-settings">
              <div class="notification-item">
                <label>Notificações por email:</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="email-notifications" v-model="emailNotifications">
                  <label for="email-notifications" class="toggle-label"></label>
                </div>
              </div>
              <div class="notification-item">
                <label>Notificações Push:</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="push-notifications" v-model="pushNotifications">
                  <label for="push-notifications" class="toggle-label"></label>
                </div>
              </div>
              <div class="notification-item">
                <label>Alertas de login:</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="login-alerts" v-model="loginAlerts">
                  <label for="login-alerts" class="toggle-label"></label>
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
  name: 'SettingsView',
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      selectedPermission: '',
      justification: '',
      emailNotifications: false,
      pushNotifications: false,
      loginAlerts: false
    }
  },
  methods: {
    goToProfile() {
      this.$router.push('/profile')
    }
  }
}
</script>

<style scoped>
.settings-container {
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
  font-size: 1.2rem;
}

/* Main Layout */
.main-layout {
  display: flex;
  min-height: calc(100vh - 80px);
  overflow: hidden;
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
  overflow-y: auto;
  max-height: calc(100vh - 80px);
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

.settings-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.settings-main {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.password-section {
  flex: 1;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.permission-section {
  flex: 1;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.password-section h3,
.permission-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.form-grid {
  display: flex;
  flex-direction: column;
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

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2ea89d;
}

.save-btn,
.send-btn {
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

.save-btn:hover,
.send-btn:hover {
  background: #25968c;
}

.notifications-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.notifications-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item label {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-label {
  background-color: #2ea89d;
}

input:checked + .toggle-label:before {
  transform: translateX(26px);
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
  
  .settings-main {
    flex-direction: column;
  }
}
</style>
