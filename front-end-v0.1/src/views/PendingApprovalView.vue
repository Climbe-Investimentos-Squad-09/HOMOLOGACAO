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
          <h1 class="title">Acesso em análise</h1>
          
          <div class="content">
            <p class="message">
              Sua solicitação de acesso à plataforma foi recebida com sucesso e está aguardando a aprovação de um administrador.
            </p>
            
            <p class="message">
              Você receberá uma notificação por e-mail assim que o seu acesso for autorizado.
            </p>
            
            <p class="signature">
              Agradecemos a paciência,<br>
              <strong>Climbe Investimentos Independentes</strong>
            </p>
          </div>

          <button-component
            ref="backBtn"
            :disabled="loading"
            @click="goBack"
            text="Voltar"
            class="back-button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageComponent from '@/components/ImageComponent.vue'
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

export default {
  name: 'PendingApprovalView',
  components: {
    ImageComponent,
    SpinnerLoading,
    ButtonComponent
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
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
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  line-height: 1.2;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.message {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
  text-align: left;
}

.signature {
  font-size: 1rem;
  color: #333;
  margin: 0;
  line-height: 1.6;
  text-align: left;
  font-style: italic;
}

.signature strong {
  color: #2c3e50;
  font-weight: 600;
}

.back-button {
  background: #2ea89d !important;
  color: #ffffff !important;
  border: 1px solid #2ea89d !important;
  box-shadow: 0 2px 10px rgba(46, 168, 157, 0.3) !important;
  width: 100%;
}

.back-button:hover {
  background: #2ea89d !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(46, 168, 157, 0.4) !important;
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
  
  .title {
    font-size: 1.8rem;
  }
  
  .message, .signature {
    font-size: 0.9rem;
  }
}
</style>

