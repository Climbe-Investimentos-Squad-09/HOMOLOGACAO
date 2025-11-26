<template>
  <div>
    <spinner-loading v-if="loading" :msg="true" />

    <div class="background-video-container" v-else>
      <video autoplay muted loop playsinline class="background-video">
        <source src="/video/climbeVideo.mp4" type="video/mp4" />
      </video>
      <div class="overlay">
        <div class="logo-container">
          <image-component src="/img/climbe-logo.png" />
        </div>
        
        <div class="overlay-content">
          <h1 class="welcome-title">Cadastre-se</h1>
          <p class="welcome-subtitle">Preencha os dados para criar sua conta</p>
          
          <div v-if="warningMessage" class="warning-message">
            <span class="warning-icon">!</span>
            <span class="warning-text">{{ warningMessage }}</span>
          </div>
          
          <div v-if="successMessage" class="success-message">
            <span class="success-icon">✓</span>
            <span class="success-text">{{ successMessage }}</span>
          </div>
          
          <div class="signup-form">
            <label class="input-label">Nome completo</label>
            <input-component 
              placeholder="Nome completo" 
              v-model="fullName" 
              required 
            />

            <label class="input-label">E-mail</label>
            <input-component 
              placeholder="E-mail" 
              v-model="email" 
              type="email"
              required 
            />

            <label class="input-label">Senha</label>
            <input-component 
              placeholder="Senha" 
              v-model="senha" 
              type="password"
              required 
            />

            <button-component
              ref="registerBtn"
              :disabled="loading || buttonDisabled"
              @click="register"
              text="Cadastrar"
              class="register-button"
            />

            <a href="#" @click.prevent="goToLogin" class="have-account-link">
              Já tenho conta
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
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'

export default {
  name: 'SignupView',
  components: {
    ImageComponent,
    InputComponent,
    SpinnerLoading,
    ButtonComponent
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      loading: false,
      fullName: '',
      email: '',
      senha: '',
      warningMessage: '',
      successMessage: '',
      buttonDisabled: false
    }
  },
  watch: {
    fullName() {
      if (this.fullName) {
        this.clearMessages()
      }
    },
    email() {
      if (this.email) {
        this.clearMessages()
      }
    },
    senha() {
      if (this.senha) {
        this.clearMessages()
      }
    }
  },
  methods: {
    async register() {
      this.warningMessage = ''
      this.successMessage = ''
      
      if (!this.fullName || !this.email || !this.senha) {
        return
      }

      if (this.senha.length < 6) {
        return
      }

      this.loading = true
      this.buttonDisabled = false
      
      try {
        const response = await register({
          nome: this.fullName,
          email: this.email,
          senha: this.senha
        })
        
        this.loading = false
        this.buttonDisabled = true
        
        if (response.accessToken && response.refreshToken) {
          this.successMessage = 'Cadastro realizado!'
          setTimeout(() => {
            this.router.push('/dashboard')
          }, 1500)
        } else {
          this.warningMessage = 'Sua solicitação foi encaminhada com sucesso'
          setTimeout(() => {
            this.router.push('/login?message=pending')
          }, 3000)
        }
      } catch (err) {
        this.loading = false
        this.buttonDisabled = true
        
        const errorStatus = err.response?.status
        const errorMessage = err.response?.data?.message || err.message || ''
        
        if (errorStatus === 409 || errorMessage.toLowerCase().includes('já existe') || errorMessage.toLowerCase().includes('already exists')) {
          this.warningMessage = 'E-mail já cadastrado'
        } else {
          this.warningMessage = 'Erro ao cadastrar. Tente novamente.'
        }
      }
    },
    goToLogin() {
      this.router.push('/login')
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
  margin-bottom: 0.5rem;
  margin-top: 1rem;
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
  max-width: 450px;
  width: 100%;
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
  opacity: 0.9;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.signup-form .input-component {
  background: rgba(128,128,128,0.3) !important;
  border: 1px solid rgba(255,255,255,0.6) !important;
  color: #000000 !important;
  width: 100%;
}

.signup-form .input-component::placeholder {
  color: rgba(128,128,128,0.3) !important;
}

.signup-form .button-component {
  width: 100%;
}

.register-button {
  background: var(--theme-color) !important;
  color: #ffffff !important;
  border: 1px solid var(--theme-color) !important;
  box-shadow: 0 2px 10px rgba(57, 198, 187, 0.3) !important;
}

.register-button:hover {
  background: var(--primary-color-alt) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(57, 198, 187, 0.4) !important;
}

.have-account-link {
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  color: var(--theme-color);
  font-size: 16px;
  font-weight: 500;
  margin-top: 0.5rem;
}

.have-account-link:hover {
  text-decoration: underline;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .overlay {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .overlay-content {
    padding: 2rem 1.5rem;
    gap: 20px;
  }
  
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .welcome-subtitle {
    font-size: 0.9rem;
  }
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