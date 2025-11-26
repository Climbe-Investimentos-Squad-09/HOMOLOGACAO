<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <div class="modal-header" :class="`header-${type}`">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="handleClose">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-message">{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-ok" @click="handleClose" :class="`btn-${type}`">
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'AlertModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Aviso'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'error', 'warning', 'success'].includes(value)
    }
  },
  emits: ['close'],
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #E9ECEF;
}

.modal-header.header-info {
  border-top: 4px solid #39C6BB;
}

.modal-header.header-error {
  border-top: 4px solid #DC3545;
}

.modal-header.header-warning {
  border-top: 4px solid #FFC107;
}

.modal-header.header-success {
  border-top: 4px solid #22C55E;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6C757D;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #F8F9FA;
  color: #212529;
}

.modal-body {
  padding: 1.5rem;
}

.modal-message {
  font-size: 1rem;
  color: #495057;
  line-height: 1.6;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #E9ECEF;
}

.btn-ok {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-width: 100px;
}

.btn-ok.btn-info {
  background-color: #39C6BB;
  color: white;
}

.btn-ok.btn-info:hover {
  background-color: #2ea89d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(57, 198, 187, 0.3);
}

.btn-ok.btn-error {
  background-color: #DC3545;
  color: white;
}

.btn-ok.btn-error:hover {
  background-color: #C82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-ok.btn-warning {
  background-color: #FFC107;
  color: #212529;
}

.btn-ok.btn-warning:hover {
  background-color: #E0A800;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.btn-ok.btn-success {
  background-color: #22C55E;
  color: white;
}

.btn-ok.btn-success:hover {
  background-color: #16A34A;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    margin: 1rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.25rem;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .btn-ok {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-container {
    margin: 0.5rem;
    border-radius: 8px;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>

