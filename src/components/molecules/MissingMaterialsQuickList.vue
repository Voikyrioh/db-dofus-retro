<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'

defineProps<{
  missingMaterials: MaterialRequirement[]
}>()

const emit = defineEmits<{
  addOne: [itemId: number]
}>()
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
    <h3 class="text-lg font-bold text-red-400 mb-3" v-translate="'missing_materials_title'"></h3>

    <div v-if="missingMaterials.length === 0" class="text-center py-4">
      <p class="text-green-400 font-semibold" v-translate="'all_materials_available'"></p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="material in missingMaterials"
        :key="material.item.id"
        class="flex items-center justify-between text-sm bg-gray-900/50 rounded px-3 py-2"
      >
        <div class="flex-1 min-w-0">
          <p class="text-gray-100 truncate">{{ material.item.name }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-red-400 font-semibold">-{{ material.missing }}</span>
          <button
            @click="emit('addOne', material.item.id)"
            class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
          >
            +1
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
