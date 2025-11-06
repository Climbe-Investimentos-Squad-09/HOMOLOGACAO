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
.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.7);
  font-size: 20px;
  z-index: 1;
  pointer-events: none;
}

.input-component {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 10px;
  background: rgba(128,128,128,0.3);
  color: #000000;
  font-size: 1rem;
  outline: none;
  text-align: center;
}

.input-component.with-icon {
  padding-left: 3rem;
  text-align: left;
}

.input-component::placeholder {
  color: rgba(128,128,128,0.3);
}
</style>
