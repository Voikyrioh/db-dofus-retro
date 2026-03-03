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

const statLabel = computed(() => {
  // Convert stat keys to readable names
  const labelMap: Record<string, string> = {
    AGIL: 'Agility',
    CC: 'Critical',
    CHAN: 'Chance',
    CREATURE: 'Creature',
    DO_AIR: 'Air Damage',
    DO_ARM: 'Weapon Damage',
    DO_CRIT: 'Critical Damage',
    R_EAU: 'Water Resistance Fix',
    RP_EAU: 'Water Resistance Percent',
    R_FEU: 'Fire Resistance Fix',
    RP_FEU: 'Fire Resistance Percent',
    R_NEU: 'Neutral Resistance Fix',
    RP_NEU: 'Neutral Resistance Percent',
    R_TER: 'Earth Resistance Fix',
    RP_TER: 'Earth Resistance Percent',
    R_PER: 'Damage Resistance Fix',
    RP_PER: 'Damage Resistance Percent',
    DO_PER_FIN: 'Final Damage',
    ESQ: 'Dodge',
    FORC: 'Strength',
    INIT: 'Initiative',
    INTE: 'Intelligence',
    KAMAS: 'Kamas',
    LIFE: 'HP',
    PA: 'AP',
    PM: 'MP',
    PO: 'Range',
    PODS: 'Pods',
    PROS: 'Prospecting',
    SAGE: 'Wisdom',
    SOIN: 'Heals',
    VITA: 'Vitality',
  }

  return labelMap[props.statKey] || props.statKey
})

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
      <span class="text-gray-400">{{ statLabel }}:</span>
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
