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
  <div v-if="hasStats" class="stats-panel">
    <h3 class="stats-title" v-translate="'statistics_title'"></h3>
    <div class="stats-grid">
      <StatDisplay
        v-for="stat in statEntries"
        :key="stat.key"
        :stat-key="stat.key"
        :min="stat.min"
        :max="stat.max"
      />
    </div>
  </div>
  <div v-else class="stats-empty" v-translate="'no_statistics'"></div>
</template>

<style scoped>
.stats-panel {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}
.stats-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-accent);
  margin: 0 0 0.75rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}

.stats-empty {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
