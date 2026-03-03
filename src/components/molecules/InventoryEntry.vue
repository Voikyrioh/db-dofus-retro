<script setup lang="ts">
import type { InventoryItem } from '../../entities/InventoryItem'
import QuantityInput from '../atoms/QuantityInput.vue'

defineProps<{
  entry: InventoryItem
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
  remove: [itemId: number]
}>()
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3">
    <div class="flex-1">
      <h4 class="font-semibold text-gray-100 text-sm">{{ entry.item.name }}</h4>
      <p class="text-xs text-gray-400 mt-0.5">Level {{ entry.item.level }}</p>
    </div>

    <div class="flex items-center gap-2">
      <QuantityInput
        :model-value="entry.quantity"
        :min="0"
        @update:model-value="emit('updateQuantity', entry.item.id, $event)"
      />

      <button
        @click="emit('remove', entry.item.id)"
        class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
        title="Remove from inventory"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
