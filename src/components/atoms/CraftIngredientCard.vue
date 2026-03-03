<script setup lang="ts">
import type { CraftIngredient } from '../../entities/Craft'

defineProps<{
  ingredient: CraftIngredient
}>()
</script>

<template>
  <div class="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg p-3">
    <div class="flex-shrink-0 bg-blue-900/30 text-blue-400 font-bold rounded-full w-10 h-10 flex items-center justify-center">
      {{ ingredient.quantity }}×
    </div>
    <div class="flex-1">
      <h4 class="font-semibold text-gray-100">{{ ingredient.item.name }}</h4>
      <div class="text-xs text-gray-400 mt-1">
        Level {{ ingredient.item.level }} • {{ ingredient.item.pod }} pods
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
