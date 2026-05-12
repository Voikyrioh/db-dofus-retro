<script setup lang="ts">
import ItemSprite from './ItemSprite.vue'
import type { CraftIngredient } from '../../entities/Craft'

defineProps<{
  ingredient: CraftIngredient
}>()
</script>

<template>
  <div class="ingredient-row">
    <div class="ingredient-qty">{{ ingredient.quantity }}×</div>
    <ItemSprite
      :category="ingredient.item.sprite?.category"
      :sprite="ingredient.item.sprite?.sprite"
      :size="32"
    />
    <div class="ingredient-info">
      <h4 class="ingredient-name">{{ ingredient.item.name }}</h4>
      <div class="ingredient-meta">
        <span v-translate="'label_level'"></span> {{ ingredient.item.level }} · {{ ingredient.item.pod }} <span v-translate="'label_pods'"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ingredient-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem;
}

.ingredient-qty {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-accent);
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-accent);
}

.ingredient-info { flex: 1; }
.ingredient-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  margin: 0;
}
.ingredient-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.15rem;
}
</style>
