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

const iconPath = computed(() => `/assets/icons/sprites/${props.statKey}.svg`)

const statTranslationKey = computed(() => `stat_${props.statKey}`)

const statValue = computed(() => {
  if (props.min === props.max) {
    return `${props.min}`
  }
  return `${props.min} - ${props.max}`
})

</script>

<template>
  <div class="flex items-center gap-2 text-sm">
    <!-- Icon -->
    <div class="stat-icon-container flex-shrink-0" :style="{ width: `${size || 20}px`, height: `${size || 20}px` }">
      <StatIconPlaceholder v-if="iconError" :size="size || 20" />
      <img
        v-else
        :src="iconPath"
        :style="{ width: `${size || 20}px`, height: `${size || 20}px` }"
        @error="iconError = true"
      />
    </div>

    <!-- Stat label and value -->
    <div class="flex items-center gap-1.5">
      <span class="text-gray-400"><span v-translate="statTranslationKey"></span>:</span>
      <span class="text-gray-100 font-semibold">{{ statValue }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
