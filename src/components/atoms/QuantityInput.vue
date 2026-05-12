<script setup lang="ts">
defineProps<{
  modelValue: number
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function handleInput(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value, 10)
  if (!isNaN(value)) {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <input
    type="number"
    :value="modelValue"
    :min="min ?? 1"
    :max="max"
    @input="handleInput"
    class="qty-input input-field"
  />
</template>

<style scoped>
.qty-input {
  width: 5rem;
  text-align: center;
  padding: 0.3rem 0.5rem;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
