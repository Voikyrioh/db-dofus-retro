<script setup lang="ts">
import { computed } from 'vue'
import StatDisplay from '../atoms/StatDisplay.vue'
import type { Statistics } from '../../entities/Statistics'

const props = defineProps<{
  stats?: Statistics
}>()

const hasStats = computed(() => {
  return props.stats && Object.keys(props.stats).length > 0
})

const statEntries = computed(() => {
  if (!props.stats) return []
  return Object.entries(props.stats).map(([key, value]) => ({
    key,
    min: value.min,
    max: value.max,
  }))
})
</script>

<template>
  <div v-if="hasStats" class="bg-gray-800 border border-gray-700 rounded-lg p-4">
    <h3 class="text-lg font-semibold text-blue-400 mb-3" v-translate="'statistics_title'"></h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <StatDisplay
        v-for="stat in statEntries"
        :key="stat.key"
        :stat-key="stat.key"
        :min="stat.min"
        :max="stat.max"
      />
    </div>
  </div>
  <div v-else class="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center text-gray-500" v-translate="'no_statistics'"></div>
</template>

<style scoped>
</style>
