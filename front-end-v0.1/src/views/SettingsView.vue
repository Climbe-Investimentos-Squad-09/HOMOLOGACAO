<template>
  <div class="settings-container">
    <div class="tabs">
      <button class="tab" @click="goToProfile">Perfil</button>
      <button class="tab active">Configurações</button>
    </div>

    <div class="settings-content">
      <div class="settings-main">
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
      this.$router.push('/perfil')
    }
  }
}
</script>

<style scoped>
.settings-container {
  padding: 1rem;
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
  .settings-main {
    flex-direction: column;
  }
}
</style>
