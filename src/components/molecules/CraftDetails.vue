<script setup lang="ts">
import type { Craft } from '../../entities/Craft'
import CraftIngredientCard from '../atoms/CraftIngredientCard.vue'

defineProps<{
  craft: Craft | null
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <h3 class="text-xl font-bold text-blue-400 mb-4" v-translate="'craft_recipe_title'"></h3>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-4">
      <p class="text-gray-400" v-translate="'loading_craft'"></p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-700 rounded-lg p-4">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- No craft available -->
    <div v-else-if="!craft || craft.length === 0" class="text-center py-4">
      <p class="text-gray-400" v-translate="'no_craft_recipe'"></p>
    </div>

    <!-- Craft ingredients -->
    <div v-else class="space-y-3">
      <p class="text-sm text-gray-400 mb-3" v-translate="'required_ingredients'"></p>
      <CraftIngredientCard
        v-for="(ingredient, index) in craft"
        :key="index"
        :ingredient="ingredient"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
