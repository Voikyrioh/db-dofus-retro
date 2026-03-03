<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'
import MaterialInventoryInput from '../atoms/MaterialInventoryInput.vue'

defineProps<{
  requirements: MaterialRequirement[]
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
}>()
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
    <h3 class="text-lg font-bold text-yellow-400 mb-3">All Required Materials</h3>

    <div v-if="requirements.length === 0" class="text-center py-4">
      <p class="text-gray-400 text-sm">Add items to your crafting list to see requirements</p>
    </div>

    <div v-else class="max-h-96 overflow-y-auto">
      <MaterialInventoryInput
        v-for="requirement in requirements"
        :key="requirement.item.id"
        :requirement="requirement"
        @update-quantity="emit('updateQuantity', $event[0], $event[1])"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
