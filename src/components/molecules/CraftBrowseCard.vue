<script setup lang="ts">
import { ref } from 'vue'
import ItemSprite from '../atoms/ItemSprite.vue'
import CraftIngredientCard from '../atoms/CraftIngredientCard.vue'
import type { CraftListing } from '../../entities/Craft'
import { useAuth } from '../../composables/useAuth'
import { useCraftingList } from '../../composables/useCraftingList'

defineProps<{
  entry: CraftListing
}>()

const { isLoggedIn } = useAuth()
const { addItem } = useCraftingList()

const addedFlash = ref(false)

function handleAddToList(entry: CraftListing) {
  addItem(entry.item, 1, entry.recipe)
  addedFlash.value = true
  setTimeout(() => {
    addedFlash.value = false
  }, 2000)
}

function handleView(entry: CraftListing) {
  ;(window as any).navigateToItemDetails?.(entry.item)
}
</script>

<template>
  <div class="craft-browse-card">
    <div class="craft-browse-item">
      <ItemSprite
        :category="entry.item.sprite?.category"
        :sprite="entry.item.sprite?.sprite"
        :size="48"
      />
      <div class="craft-browse-meta">
        <div class="craft-browse-name">{{ entry.item.name }}</div>
        <div class="craft-browse-sub">
          <span v-translate="'label_level'"></span> {{ entry.item.level }} · {{ entry.item.pod }} <span v-translate="'label_pods'"></span>
        </div>
      </div>
    </div>

    <div class="craft-browse-ingredients">
      <CraftIngredientCard
        v-for="ingredient in entry.recipe"
        :key="ingredient.item.id"
        :ingredient="ingredient"
      />
    </div>

    <div class="craft-browse-actions">
      <button
        @click="handleView(entry)"
        class="btn-secondary craft-browse-btn"
        v-translate="'view_button'"
      ></button>
      <button
        v-if="isLoggedIn"
        @click="handleAddToList(entry)"
        class="craft-browse-btn"
        :class="addedFlash ? 'btn-secondary' : 'btn-primary'"
      >
        <span v-if="addedFlash" v-translate="'added_to_list'"></span>
        <span v-else v-translate="'add_to_list'"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.craft-browse-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}

.craft-browse-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 10rem;
}
.craft-browse-meta { }
.craft-browse-name {
  font-weight: 700;
  color: var(--color-accent);
  font-size: 0.9rem;
}
.craft-browse-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.15rem;
}

.craft-browse-ingredients {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.craft-browse-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.craft-browse-btn {
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  white-space: nowrap;
}
</style>
