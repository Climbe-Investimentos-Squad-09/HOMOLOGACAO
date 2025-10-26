<template>
  <div>
    <spinner-loading v-if="oi" :msg="true" />

    
    <div class="background-video-container" v-else>
      <video autoplay muted loop playsinline class="background-video">
        <source src="/video/climbeVideo.mp4" type="video/mp4" />
      </video>
      <div class="overlay">
        <div class="overlay-content">
          <image-component src="/img/climbe-logo.png" />
          <p>Portal do Sócio.</p>
          <div class="main-content">

            
            <div class="login-form" v-if="!showSignup">
              <input-component placeholder="Digite seu email" v-model="user" required />
              <input-component type="password" placeholder="Digite sua senha" v-model="pass" required />

              <button-component
                ref="loginBtn"
                :disabled="oi"
                @click="login"
                text="Acessar"
              />

              <span>
                É sócio e ainda não tem acesso?
                <a href="#" @click.prevent="showSignup = true">Clique aqui</a>
              </span>
            </div>


            <div class="login-form" v-else>
              <input-component placeholder="Nome completo" v-model="fullName" required />
              <input-component placeholder="Digite seu email" v-model="signupEmail" required />
              <input-component type="password" placeholder="Digite sua senha" v-model="signupPass" required />

              <button-component
                ref="signupBtn"
                @click="onSignup"
                text="Solicitar Acesso"
              />

              <span>
                Já tem conta?
                <a href="#" @click.prevent="showSignup = false">Voltar ao login</a>
              </span>
            </div>

            
            <div class="divider">
              <hr class="custom-hr" />
            </div>

            
            <div class="typing-text-container">
              <p class="typing-text">{{ displayText }}</p>
            </div>

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
      pass: '',             
      fullName: '',         
      signupEmail: '',      
      signupPass: '',       
      showSignup: false,    
      displayText: '',      
      fullText: 'A melhor empresa precisa dos melhores orientadores',
      typewriterIndex: 0,   
      typewriterSpeed: 80   
    }
  },
  mounted() {
    this.startTypewriter()
  },
  methods: {
    startTypewriter() {
      const typeNextChar = () => {
        if (this.typewriterIndex < this.fullText.length) {
          this.displayText += this.fullText.charAt(this.typewriterIndex)
          this.typewriterIndex++
          setTimeout(typeNextChar, this.typewriterSpeed)
        }
      }
      setTimeout(typeNextChar, 1000)
    },
    async login() {
      this.oi = true
      try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.user, password: this.pass })
        })

        if (res.status === 403) {
          this.$refs.loginBtn.showError('Aguardando aprovação')
          return
        }
        if (!res.ok) {
          throw new Error(`Erro ${res.status}`)
        }

        const { token } = await res.json()
        localStorage.setItem('token', token)
        this.$refs.loginBtn.showSuccess()
        this.$router.push('/main')
      } catch (err) {
        console.error('Login falhou:', err)
        if (!this.$refs.loginBtn._hasError) {
          this.$refs.loginBtn.showError('E‑mail ou senha inválidos')
        }
      } finally {
        this.oi = false
      }
    },
    async onSignup() {
      this.oi = true
      try {
        const res = await fetch('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: this.fullName, email: this.signupEmail, password: this.signupPass })
        })
        if (!res.ok) throw new Error(`Status ${res.status}`)
        this.$refs.signupBtn.showSuccess()
        this.showSignup = false
      } catch (err) {
        console.error('Signup falhou:', err)
        this.$refs.signupBtn.showError('Falha no cadastro')
      } finally {
        this.oi = false
      }
    }
  }
}
</script>

<style scoped>
#create {
  color: var(--theme-color);
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
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.5) 100%
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
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.overlay-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
  color: #fff;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
  position: relative;
  overflow: hidden;
  max-width: 900px;
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
.overlay-content > p {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}
.main-content {
  display: flex;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: 800px;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 320px;
  flex: 1;
}
.divider {
  display: flex;
  align-items: center;
  height: 300px;
}
.custom-hr {
  width: 2px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--theme-color),
    var(--theme-color),
    transparent
  );
  border: none;
  position: relative;
  animation: hrGlow 2s ease-in-out infinite alternate;
}
.custom-hr::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--theme-color);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--theme-color);
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes hrGlow {
  0% { box-shadow: 0 0 5px var(--theme-color); filter: brightness(1); }
  100% { box-shadow: 0 0 20px var(--theme-color); filter: brightness(1.3); }
}
@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.7; }
}
.typing-text-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}
.typing-text {
  font-size: 42px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  line-height: 1.4;
  margin: 0;
  position: relative;
  text-align: left;
  max-width: 280px;
}
.typing-text::after {
  content: '|';
  color: var(--theme-color);
  animation: blink 1s infinite;
  font-weight: 400;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.login-form input {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  outline: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.login-form input::placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}
.login-form input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1), 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}
.login-form button {
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.login-form button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}
.login-form button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
@media (max-width: 968px) {
  .main-content { flex-direction: column; gap: 30px; }
  .divider { height: auto; width: 100%; }
  .custom-hr { width: 100%; height: 2px; background: linear-gradient(to right, transparent, var(--theme-color), var(--theme-color), transparent); }
  .typing-text { text-align: center; max-width: 100%; }
}
@media (max-width: 480px) {
  .overlay-content { padding: 1.5rem 1rem; gap: 20px; }
  .overlay-content > p { font-size: 22px; }
  .overlay-content img { max-width: 120px; }
  .login-form { gap: 16px; }
  .typing-text { font-size: 18px; }
  .main-content { gap: 20px; }
}
.login-form input:invalid:not(:placeholder-shown) {
  border-color: rgba(239, 68, 68, 0.6);
  background: rgba(239, 68, 68, 0.1);
}
.login-form input:valid:not(:placeholder-shown) {
  border-color: rgba(57, 198, 187, 0.6);
  background: rgba(34, 197, 94, 0.1);
}
</style>
