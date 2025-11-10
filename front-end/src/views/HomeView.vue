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
          <p class="welcome-subtitle">Escolha como deseja fazer login</p>

          <div class="login-form">
            <!-- Login com Email e Senha -->
            <div class="form-section">
              <label class="input-label">E-mail</label>
              <input-component placeholder="Digite seu email" v-model="user" required />
              <label class="input-label">Senha</label>
              <input-component type="password" placeholder="Digite sua senha" v-model="pass" required />

              <button-component
                ref="loginBtn"
                :disabled="oi"
                @click="login"
                text="Entrar"
                class="login-button"
              />
            </div>

            <div class="divider">
              <span class="divider-text">OU</span>
            </div>

            <!-- Login com Google -->
            <button-component
              ref="googleBtn"
              :disabled="oi"
              @click="loginWithGoogle"
              text="Entrar com Google"
              class="google-login-button"
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

export default {
  name: 'LoginView',
  components: {
    ImageComponent,
    InputComponent,
    SpinnerLoading,
    ButtonComponent
  },
  data() {
    return {
      oi: false,            
      user: '',             
      pass: ''             
    }
  },
  mounted() {
    // Verifica se há um código de callback do Google na URL
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      this.handleGoogleCallback(code)
    }
  },
  methods: {
    async login() {
      this.oi = true
      try {
        const res = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.user, senha: this.pass })
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

        this.$refs.loginBtn.showSuccess()
        setTimeout(() => {
          this.$router.push('/main')
        }, 1000)
      } catch (err) {
        console.error('Login falhou:', err)
        this.$refs.loginBtn.showError(err.message || 'E‑mail ou senha inválidos')
      } finally {
        this.oi = false
      }
    },
    async loginWithGoogle() {
      this.oi = true
      try {
        // Busca a URL de autorização do Google
        const res = await fetch('http://localhost:3000/auth/google/url')

        if (!res.ok) {
          throw new Error('Erro ao buscar URL do Google')
        }

        const { url } = await res.json()

        // Redireciona o usuário para autenticação do Google
        window.location.href = url
      } catch (err) {
        console.error('Erro ao iniciar login com Google:', err)
        this.$refs.googleBtn.showError('Erro ao conectar com Google')
        this.oi = false
      }
    },
    async handleGoogleCallback(code) {
      this.oi = true
      try {
        // Processa o callback do Google
        const res = await fetch(`http://localhost:3000/auth/google/callback?code=${code}`)

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || 'Erro na autenticação Google')
        }

        const { accessToken, refreshToken, user } = await res.json()

        // Armazena os tokens e informações do usuário
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))

        // Remove o código da URL
        window.history.replaceState({}, document.title, '/')

        // Redireciona para a página principal
        this.$router.push('/main')
      } catch (err) {
        console.error('Callback Google falhou:', err)
        alert(err.message || 'Erro ao autenticar com Google. Se não tem conta, faça o cadastro primeiro.')

        // Remove o código da URL em caso de erro
        window.history.replaceState({}, document.title, '/')
        this.oi = false
      }
    },
    goToGoogleSignup() {
      this.$router.push('/google-signup')
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

.login-form {
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

.login-button {
  margin-top: 0.5rem;
}

.google-login-button {
  background: white !important;
  color: #444 !important;
  border: 2px solid #ddd !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.google-login-button:hover {
  background: #f8f8f8 !important;
  border-color: #ccc !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.no-account-link {
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid var(--theme-color);
  border-radius: 10px;
  color: var(--theme-color);
  font-size: 0.95rem;
  font-weight: 600;
  display: block;
  transition: all 0.3s ease;
}

.no-account-link:hover {
  background: var(--theme-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(57, 198, 187, 0.3);
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

  .login-form {
    gap: 1.25rem;
  }
}
</style>
