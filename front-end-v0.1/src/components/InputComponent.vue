<template>
  <div class="input-container">
    <span class="input-icon" v-if="icon">
      <i class="material-icons">{{ icon }}</i>
    </span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      class="input-component"
      :class="{ 'with-icon': icon }"
    />
  </div>

</template>

<script>
export default {
  name: 'InputComponent',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
</script>

<style scoped>
.input-container {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.5);
  font-size: 20px;
  z-index: 1;
  pointer-events: none;
}

.input-component {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(57, 198, 187, 0.3);
  border-radius: 10px;
  background: rgba(136, 136, 136, 0.9);
  color: #000000;
  font-size: 1rem;
  outline: none;
  text-align: center;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-component.with-icon {
  padding-left: 3rem;
  text-align: left;
}

.input-component::placeholder {
  color: #000000;
  opacity: 0.7;
}

.input-component:focus {
  background: rgb(85, 85, 85);
  border-color: #39C6BB;
  box-shadow: 0 0 0 3px rgba(57, 198, 187, 0.1), 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .input-component {
    padding: 0.65rem 0.9rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .input-component {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
