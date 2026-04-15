<script setup lang="ts">
import type { Item } from '../../entities/Item'
import ItemCard from '../atoms/ItemCard.vue'

defineProps<{
  items: Item[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  itemClick: [item: Item]
}>()
</script>

<template>
  <div class="results">
    <div v-if="loading" class="results-status">
      <p v-translate="'searching_label'"></p>
    </div>

    <div v-else-if="error" class="results-error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="items.length > 0" class="results-found">
      <p class="results-count">
        <span v-translate="'found_label'"></span>
        {{ items.length }}
        <span v-translate="items.length !== 1 ? 'item_plural' : 'item_singular'"></span>
      </p>
      <div class="results-grid">
        <ItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @click="emit('itemClick', item)"
        />
      </div>
    </div>

    <div v-else class="results-status">
      <p v-translate="'no_items_found'"></p>
    </div>
  </div>
</template>

<style scoped>
.results { width: 100%; }

.results-status {
  text-align: center;
  padding: 2rem 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.results-error {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error);
  border-radius: 8px;
  padding: 1rem;
  color: var(--color-error);
  font-size: 0.875rem;
}

.results-count {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0 0 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
</style>
