<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    @input="onInput"
    class="input-component"
  />
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
.input-component {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 0.5rem;
  background: rgba(255,255,255,0);
  color: #39c6bb;
  font-size: 1rem;
  outline: none;
  text-align: center;
}
.input-component::placeholder {
  color: rgba(255,255,255,0.7);
}
</style>
