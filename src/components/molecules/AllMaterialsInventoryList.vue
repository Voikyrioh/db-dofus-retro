<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'
import MaterialInventoryInput from '../atoms/MaterialInventoryInput.vue'

defineProps<{
  requirements: MaterialRequirement[]
  missingCount: number
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
}>()

function handleUpdateQuantity(itemId: number, quantity: number) {
  emit('updateQuantity', itemId, quantity)
}
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-bold text-yellow-400" v-translate="'required_materials'"></h3>
      <span v-if="requirements.length > 0" class="text-xs font-semibold px-2 py-1 rounded" :class="missingCount === 0 ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'">
        <span v-if="missingCount === 0" v-translate="'all_ready'"></span>
        <span v-else>{{ missingCount }} <span v-translate="'missing_label'"></span></span>
      </span>
    </div>

    <div v-if="requirements.length === 0" class="text-center py-4">
      <p class="text-gray-400 text-sm" v-translate="'add_materials_hint'"></p>
    </div>

    <div v-else>
      <MaterialInventoryInput
        v-for="requirement in requirements"
        :key="requirement.item.id"
        :requirement="requirement"
        @update-quantity="handleUpdateQuantity"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
