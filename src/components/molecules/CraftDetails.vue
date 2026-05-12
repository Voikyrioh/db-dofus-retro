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
  <div class="craft-details">
    <h3 class="craft-details-title" v-translate="'craft_recipe_title'"></h3>

    <div v-if="loading" class="craft-details-status">
      <p class="status-text" v-translate="'loading_craft'"></p>
    </div>

    <div v-else-if="error" class="craft-details-error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!craft || craft.length === 0" class="craft-details-status">
      <p class="status-text" v-translate="'no_craft_recipe'"></p>
    </div>

    <div v-else class="craft-details-list">
      <p class="ingredients-label" v-translate="'required_ingredients'"></p>
      <CraftIngredientCard
        v-for="(ingredient, index) in craft"
        :key="index"
        :ingredient="ingredient"
      />
    </div>
  </div>
</template>

<style scoped>
.craft-details {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
  margin-top: 1rem;
}

.craft-details-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-accent);
  margin: 0 0 1rem;
}

.craft-details-status {
  text-align: center;
  padding: 0.75rem 0;
}
.status-text {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.craft-details-error {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error);
  border-radius: 6px;
  padding: 0.75rem;
  color: var(--color-error);
  font-size: 0.875rem;
}

.craft-details-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.ingredients-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0 0 0.5rem;
}
</style>
