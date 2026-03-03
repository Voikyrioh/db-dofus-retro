<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'
import MaterialRequirementCard from '../atoms/MaterialRequirementCard.vue'

defineProps<{
  requirements: MaterialRequirement[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  updateInventory: [itemId: number, quantity: number]
}>()
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-400">Calculating material requirements...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-700 rounded-lg p-4">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- No requirements -->
    <div v-else-if="requirements.length === 0" class="text-center py-8">
      <p class="text-gray-400">No materials required. Add items to your crafting list to see requirements.</p>
    </div>

    <!-- Requirements list -->
    <div v-else class="space-y-3">
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-400">
          {{ requirements.length }} material{{ requirements.length !== 1 ? 's' : '' }} required
        </p>
        <div class="flex gap-4 text-xs">
          <span class="text-green-400">
            ✓ {{ requirements.filter(r => r.missing === 0).length }} complete
          </span>
          <span class="text-red-400">
            {{ requirements.filter(r => r.missing > 0).length }} missing
          </span>
        </div>
      </div>

      <MaterialRequirementCard
        v-for="requirement in requirements"
        :key="requirement.item.id"
        :requirement="requirement"
        @update-inventory="(itemId, quantity) => emit('updateInventory', itemId, quantity)"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
