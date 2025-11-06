<template>
  <div class="profile-container">
    <div class="tabs">
      <button class="tab active">Perfil</button>
      <button class="tab" @click="goToSettings">Configurações</button>
    </div>

    <div class="profile-content">
      <div class="profile-main">
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

        <div class="right-column">
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
      this.$router.push('/configuracoes')
    }
  }
}
</script>

<style scoped>
.profile-container {
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

@media (max-width: 768px) {
  .profile-main {
    flex-direction: column;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
