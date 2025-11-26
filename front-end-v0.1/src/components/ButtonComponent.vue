<template>
  <button
    class="button-loader"
    :class="[
      customClass,
      {
        loading: status === 'loading',
        success: status === 'success',
        error:   status === 'error',
        disabled: disabled || status === 'loading'
      }
    ]"
    :type="type"
    :disabled="disabled || status === 'loading'"
    @click="handleClick"
  >
    <span class="button-text">
      <template v-if="status === 'loading'">Carregando...</template>
      <template v-else-if="status === 'success'">
        <span class="material-symbols-outlined">check</span>
        <span class="success-message-text">{{ successMessage || 'Concluído' }}</span>
      </template>
      <template v-else-if="status === 'error'">
        <span class="material-symbols-outlined">error</span>
        <span class="error-message-text">{{ errorMessage || 'Algo está errado' }}</span>
      </template>
      <template v-else>{{ text }}</template>
    </span>
  </button>
</template>

<script>
export default {
  name: 'LoadingButton',
  props: {
    text:       { type: String, default: 'Enviar' },
    type:       { type: String, default: 'button' },
    customClass:{ type: [String,Array], default: '' },
    disabled:   { type: Boolean, default: false }
  },
  data() {
    return {
      status: 'idle',
      successMessage: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleClick(event) {
      if (this.status !== 'idle' || this.disabled) return;

      this.status = 'loading';
      this.successMessage = '';
      this.errorMessage = '';
      this.$emit('click', event);
    },
    reset() {
      this.status = 'idle';
      this.successMessage = '';
      this.errorMessage = '';
      this.$nextTick(() => {
        this.status = 'idle';
      });
    },
    showSuccess(message) {
      this.status = 'idle';
      this.successMessage = '';
      this.errorMessage = '';
      this.$nextTick(() => {
        this.successMessage = message || 'Concluído';
        this.errorMessage = '';
        this.status = 'success';
        const timeout = message ? 6000 : 3000;
        setTimeout(() => {
          if (this.status === 'success') {
            this.status = 'idle';
            this.successMessage = '';
          }
        }, timeout);
      });
    },
    showError(message) {
      this.status = 'idle';
      this.successMessage = '';
      this.errorMessage = '';
      this.$nextTick(() => {
        this.errorMessage = message || 'Algo está errado';
        this.successMessage = '';
        this.status = 'error';
        setTimeout(() => {
          if (this.status === 'error') {
            this.status = 'idle';
            this.errorMessage = '';
          }
        }, 5000);
      });
    }
  }
}
</script>

<style scoped>
.button-loader {
  border: none;
  outline: none;
  position: relative;
  padding: .75rem 2.5rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  font-size: 1rem;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  border-radius: 0.5rem;
  box-shadow: 0 8px 25px rgba(57, 198, 187, 0.3);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  text-align: center;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.button-loader.success {
  background-color: #22c55e !important;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
  animation: successPulse 0.6s ease-out;
}

.button-loader.error {
  background-color: #ef4444 !important;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
  animation: errorShake 0.5s ease-out;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes errorShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-message-text,
.success-message-text {
  margin-left: 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
}

.success-message-text {
  color: white;
}

.error-message-text {
  color: white;
}

.button-loader:hover:not(.loading):not(.disabled) {
  background-color: var(--primary-color-alt);
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(57, 198, 187, 0.4);
}

.button-loader:active:not(.loading):not(.disabled) {
  transform: translateY(0);
}

.button-loader.loading {
  cursor: wait;
  pointer-events: none;
}

.button-loader.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.button-loader.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 150%;
  height: 100%;
  background: repeating-linear-gradient(
    60deg, 
    transparent, 
    transparent 0.75rem, 
    rgba(255, 255, 255, 0.1) 0.75rem, 
    rgba(255, 255, 255, 0.1) 1.5rem
  );
  animation: loading-animation 1s infinite linear;
  z-index: 1;
}

.button-text {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-loader.loading .button-text::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid var(--text-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 0.5rem;
}

@keyframes loading-animation {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.button-loader:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>