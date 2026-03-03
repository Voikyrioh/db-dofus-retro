<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'
import ItemSprite from './ItemSprite.vue'

const props = defineProps<{
  requirement: MaterialRequirement
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
}>()

function handleInput(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value, 10)
  if (!isNaN(value) && value >= 0) {
    emit('updateQuantity', props.requirement.item.id, value)
  }
}
</script>

<template>
  <div class="flex items-center gap-3 py-2 border-b border-gray-700 last:border-0" :class="requirement.missing === 0 ? 'opacity-40' : ''">
    <ItemSprite :category="requirement.item.sprite?.category" :sprite="requirement.item.sprite?.sprite" :size="32" />
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-100 truncate">{{ requirement.item.name }}</p>
      <p class="text-xs text-gray-500">Need: {{ requirement.needed }}</p>
    </div>
    <div class="flex items-center gap-2">
      <input
        type="number"
        :value="requirement.owned"
        @input="handleInput"
        min="0"
        class="w-20 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-100 text-center focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
      />
      <div class="w-16 text-right">
        <span
          v-if="requirement.missing > 0"
          class="text-xs text-red-400 font-semibold"
        >
          -{{ requirement.missing }}
        </span>
        <span
          v-else
          class="text-xs text-green-400 font-semibold"
        >
          ✓
        </span>
      </div>
    </div>
  </div>
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
