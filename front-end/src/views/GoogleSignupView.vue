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
          <h1 class="welcome-title">Crie sua conta</h1>
          <p class="welcome-subtitle">Preencha os dados abaixo para começar</p>

          <div class="signup-form">
            <!-- Cadastro com Email e Senha -->
            <div class="form-section">
              <label class="input-label">Nome completo</label>
              <input-component
                placeholder="Digite seu nome completo"
                v-model="registerData.nome"
                required
              />

              <label class="input-label">Email</label>
              <input-component
                type="email"
                placeholder="Digite seu email"
                v-model="registerData.email"
                required
              />

              <label class="input-label">Senha</label>
              <input-component
                type="password"
                placeholder="Mínimo 6 caracteres"
                v-model="registerData.senha"
                required
              />

              <button-component
                ref="registerBtn"
                :disabled="loading"
                @click="registerWithEmail"
                text="Cadastrar"
                class="register-button"
              />
            </div>

            <button-component
              ref="loginBtn"
              :disabled="loading"
              @click="goToLogin"
              text="Já tenho conta"
              class="login-button"
            />
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

export default {
  name: 'GoogleSignupView',
  components: {
    ImageComponent,
    InputComponent,
    SpinnerLoading,
    ButtonComponent
  },
  data() {
    return {
      loading: false,
      registerData: {
        nome: '',
        email: '',
        senha: ''
      }
    }
  },
  methods: {
    async registerWithEmail() {
      // Validações básicas
      if (!this.registerData.nome || !this.registerData.email || !this.registerData.senha) {
        this.$refs.registerBtn.showError('Preencha todos os campos')
        return
      }

      if (this.registerData.senha.length < 6) {
        this.$refs.registerBtn.showError('Senha deve ter pelo menos 6 caracteres')
        return
      }

      this.loading = true
      try {
        const res = await fetch('http://localhost:3000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.registerData)
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `Erro ${res.status}`)
        }

        const { accessToken, refreshToken, user } = await res.json()

        // Armazena os tokens e informações do usuário
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))

        this.$refs.registerBtn.showSuccess()
        setTimeout(() => {
          this.$router.push('/main')
        }, 1000)
      } catch (err) {
        console.error('Registro falhou:', err)
        this.$refs.registerBtn.showError(err.message || 'Erro ao cadastrar')
      } finally {
        this.loading = false
      }
    },
    goToLogin() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.input-label {
  display: block;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.input-label:first-of-type {
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
  gap: 1.5rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container img {
  max-width: 120px;
  height: auto;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.logo-container img:hover {
  transform: scale(1.05);
}

.overlay-content {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  color: #333;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
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
    rgba(57, 198, 187, 0.05),
    transparent
  );
  animation: shimmer 3s infinite;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.divider {
  position: relative;
  text-align: center;
  margin: 0.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(0, 0, 0, 0.1),
    transparent
  );
}

.divider-text {
  position: relative;
  background: rgba(255, 255, 255, 0.97);
  padding: 0 1rem;
  color: #999;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.info-box {
  background: linear-gradient(135deg, rgba(57, 198, 187, 0.08), rgba(46, 168, 157, 0.05));
  border-left: 3px solid var(--theme-color);
  border-radius: 8px;
  padding: 1rem;
}

.info-text {
  font-size: 0.85rem;
  color: #555;
  margin: 0;
  text-align: left;
  line-height: 1.5;
}

.register-button {
  margin-top: 0.5rem;
}

.login-button {
  background: transparent !important;
  color: var(--theme-color) !important;
  border: 2px solid var(--theme-color) !important;
  box-shadow: none !important;
}

.login-button:hover {
  background: var(--theme-color) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(57, 198, 187, 0.3) !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@media (max-width: 768px) {
  .overlay {
    padding: 1rem;
    gap: 1rem;
  }

  .overlay-content {
    padding: 2rem 1.5rem;
    gap: 1.25rem;
    max-width: 100%;
  }

  .logo-container img {
    max-width: 100px;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .welcome-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .overlay-content {
    padding: 1.5rem 1rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }
}
</style>