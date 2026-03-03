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
    class="w-20 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 text-center focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
  />
</template>

<style scoped>
/* Hide number input spinner arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
