<script setup lang="ts">
import { ref, computed } from 'vue'
import StatIconPlaceholder from './StatIconPlaceholder.vue'

const props = defineProps<{
  statKey: string
  min: number
  max: number
  size?: number
}>()

const iconError = ref(false)

// Normalize key for icon lookup: R_PVP_EAU → R_EAU, RP_PVP_FEU → RP_FEU, etc.
const iconKey = computed(() => props.statKey.replace(/_PVP_/, '_'))
const iconPath = computed(() => `/assets/icons/sprites/${iconKey.value}.svg`)

const statTranslationKey = computed(() => `stat_${props.statKey}`)

const statValue = computed(() => {
  if (props.min === props.max) {
    return `${props.min}`
  }
  // Use ~ separator to avoid ambiguity with negative numbers (e.g. "-6 ~ -7" not "-6 - -7")
  return `${props.min} ~ ${props.max}`
})
</script>

<template>
  <div class="stat-row">
    <div class="stat-icon" :style="{ width: `${size || 20}px`, height: `${size || 20}px` }">
      <StatIconPlaceholder v-if="iconError" :size="size || 20" />
      <img
        v-else
        :src="iconPath"
        :style="{ width: `${size || 20}px`, height: `${size || 20}px` }"
        @error="iconError = true"
      />
    </div>
    <div class="stat-text">
      <span class="stat-label"><span v-translate="statTranslationKey"></span>:</span>
      <span class="stat-value">{{ statValue }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-text {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.stat-label { color: var(--color-text-muted); }
.stat-value { color: var(--color-text-primary); font-weight: 600; }
</style>
