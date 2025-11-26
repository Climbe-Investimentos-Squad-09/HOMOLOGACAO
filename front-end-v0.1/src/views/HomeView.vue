<template>
  <div>
    <spinner-loading v-if="oi" :msg="true" />

    
    <div class="background-video-container" v-else>
      <div class="overlay">
        <div class="logo-container">
          <image-component src="/img/climbe-logo.png" />
        </div>
        
        <div class="overlay-content">
          <h1 class="welcome-title">Bem vindo(a)!</h1>
          <p class="welcome-subtitle">Faça o login inserindo seu e-mail e senha</p>
          
          <div v-if="pendingMessage" class="pending-message">
            <p>Sua solicitação foi encaminhada com sucesso!</p>
            <p>Aguarde a aprovação para fazer login.</p>
          </div>
          
          <div v-if="warningMessage" class="warning-message">
            <span class="warning-icon">!</span>
            <span class="warning-text">{{ warningMessage }}</span>
          </div>
          
          <div v-if="successMessage" class="success-message">
            <span class="success-icon">✓</span>
            <span class="success-text">{{ successMessage }}</span>
          </div>
          
          <div class="login-form">
            <label class="input-label">E-mail</label>
            <input-component placeholder="Email" v-model="user" required />
            <label class="input-label">Senha</label>
            <input-component type="password" placeholder="Senha" v-model="pass" required />

            <button-component
              ref="loginBtn"
              :disabled="oi || buttonDisabled"
              @click="login"
              text="Confirmar"
            />
            
            <a href="#" @click.prevent="goToGoogleSignup" class="no-account-link">
              Não tenho conta
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageComponent from '@/components/ImageComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'LoginView',
  components: {
    ImageComponent,
    InputComponent,
    SpinnerLoading,
    ButtonComponent
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()
    return { authStore, router, route }
  },
  data() {
    return {
      oi: false,            
      user: '',             
      pass: '',
      pendingMessage: false,
      warningMessage: '',
      successMessage: '',
      buttonDisabled: false
    }
  },
  mounted() {
    if (this.route.query.message === 'pending') {
      this.pendingMessage = true
      setTimeout(() => {
        this.pendingMessage = false
        this.router.replace({ query: {} })
      }, 5000)
    }
  },
  watch: {
    user() {
      if (this.user) {
        this.clearMessages()
      }
    },
    pass() {
      if (this.pass) {
        this.clearMessages()
      }
    }
  },
  methods: {
    async login() {
      this.warningMessage = ''
      this.successMessage = ''
      
      if (!this.user || !this.pass) {
        return
      }

      this.oi = true
      this.buttonDisabled = false
      
      try {
        await this.authStore.login(this.user, this.pass)
        this.successMessage = 'Login realizado com sucesso!'
        setTimeout(() => {
          this.router.push('/dashboard')
        }, 1000)
      } catch (err) {
        this.oi = false
        this.buttonDisabled = true
        
        if (err.response?.status === 403) {
          const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || ''
          const lowerMessage = errorMessage.toLowerCase()
          if (lowerMessage.includes('bloqueado') || lowerMessage.includes('bloqueado para acesso')) {
            this.warningMessage = 'Sua conta foi negada para acesso'
          } else if (lowerMessage.includes('aguardando') || lowerMessage.includes('aprovação') || lowerMessage.includes('pendente')) {
            this.warningMessage = 'Sua conta está em análise. Aguarde a confirmação.'
          } else {
            this.warningMessage = 'Aguardando aprovação'
          }
        } else if (err.response?.status === 401) {
          this.warningMessage = 'E-mail ou senha inválidos'
        } else {
          this.warningMessage = 'Erro ao fazer login. Tente novamente.'
        }
      } finally {
        if (this.oi) {
          this.oi = false
        }
      }
    },
    goToGoogleSignup() {
      this.router.push('/google-signup')
    },
    clearMessages() {
      if (this.warningMessage || this.successMessage) {
        this.warningMessage = ''
        this.successMessage = ''
        this.buttonDisabled = false
      }
    }
  }
}
</script>

<style scoped>
#create {
  color: var(--theme-color);
}

.input-label {
  display: block;
  color: #000000;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.input-label:first-child {
  margin-top: 0;
}

.background-video-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5) blur(0.5px);
  z-index: 0;
}

.background-video-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(85, 85, 85, 0.2) 50%,
    rgba(151, 151, 151, 0.5) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.overlay {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.logo-container img {
  max-width: 140px;
  height: auto;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.logo-container img:hover {
  transform: scale(1.05);
}

.overlay-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
  color: #333;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
  position: relative;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
}
.overlay-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shimmer 3s infinite;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
.overlay-content img {
  max-width: 140px;
  height: auto;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}
.overlay-content img:hover {
  transform: scale(1.05);
}
.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  font-weight: 400;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}
.login-form input {
  padding: 16px 20px;
  background: rgba(136, 136, 136, 0.9);
  border: 1px solid rgba(57, 198, 187, 0.3);
  border-radius: 10px;
  color: #000000;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.login-form input::placeholder {
  color: #000000;
  font-weight: 400;
}
.login-form input:focus {
  background: rgb(85, 85, 85);
  border-color: var(--theme-color);
  box-shadow: 0 0 0 3px rgba(57, 198, 187, 0.1), 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.login-form button {
  padding: 16px 32px;
  background: var(--theme-color);
  border: 1px solid var(--theme-color);
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(57, 198, 187, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.login-form button:hover {
  background: var(--primary-color-alt);
  border-color: var(--primary-color-alt);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(57, 198, 187, 0.4);
}
.login-form button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
@media (max-width: 480px) {
  .overlay { 
    gap: 1.5rem; 
  }
  .overlay-content { 
    padding: 2rem 1.5rem; 
    gap: 20px; 
  }
  .logo-container img {
    max-width: 120px;
  }
  .welcome-title { 
    font-size: 2rem; 
  }
  .login-form { 
    gap: 1.25rem; 
  }
}

.no-account-link {
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  background: var(--primary-color-alt);
  border: 17px solid var(--primary-color-alt);
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.no-account-link:hover {
  color: var(--primary-color-alt);
  text-decoration: underline;
  transform: translateY(-1px);
}

.pending-message {
  background-color: #FFF4E6;
  border: 1px solid #FFE4B5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.pending-message p {
  margin: 0.5rem 0;
  color: #B8860B;
  font-weight: 500;
}

.pending-message p:first-child {
  font-weight: 600;
  font-size: 1.05rem;
}

.warning-message {
  width: 100%;
  background-color: #f97316;
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.warning-icon {
  font-weight: 700;
  font-size: 1.2rem;
}

.warning-text {
  flex: 1;
  font-weight: 500;
}

.success-message {
  width: 100%;
  background-color: #22c55e;
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.success-icon {
  font-weight: 700;
  font-size: 1.2rem;
}

.success-text {
  flex: 1;
  font-weight: 500;
}
</style>
