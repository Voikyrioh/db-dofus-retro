<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'

defineProps<{
  requirement: MaterialRequirement
}>()

const emit = defineEmits<{
  updateInventory: [itemId: number, quantity: number]
}>()
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-100">{{ requirement.item.name }}</h4>
        <p class="text-xs text-gray-400 mt-1">Level {{ requirement.item.level }} • {{ requirement.item.pod }} pods</p>
      </div>
      <div v-if="requirement.missing === 0" class="text-green-400 text-sm font-semibold">
        ✓ Complete
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3 text-center text-sm">
      <div>
        <p class="text-gray-500 text-xs mb-1">Needed</p>
        <p class="font-semibold text-blue-400">{{ requirement.needed }}</p>
      </div>
      <div>
        <p class="text-gray-500 text-xs mb-1">Owned</p>
        <p class="font-semibold text-gray-300">{{ requirement.owned }}</p>
      </div>
      <div>
        <p class="text-gray-500 text-xs mb-1">Missing</p>
        <p :class="requirement.missing > 0 ? 'font-semibold text-red-400' : 'font-semibold text-green-400'">
          {{ requirement.missing }}
        </p>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mt-3 bg-gray-700 rounded-full h-2 overflow-hidden">
      <div
        class="h-full transition-all duration-300"
        :class="requirement.missing === 0 ? 'bg-green-500' : 'bg-blue-500'"
        :style="{ width: `${Math.min(100, (requirement.owned / requirement.needed) * 100)}%` }"
      ></div>
    </div>

    <!-- Quick inventory update -->
    <div class="mt-3 flex items-center gap-2">
      <button
        @click="emit('updateInventory', requirement.item.id, requirement.owned + 1)"
        class="flex-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
      >
        + Add 1
      </button>
      <button
        v-if="requirement.owned > 0"
        @click="emit('updateInventory', requirement.item.id, Math.max(0, requirement.owned - 1))"
        class="flex-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
      >
        - Remove 1
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
