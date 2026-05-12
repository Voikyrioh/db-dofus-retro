<script setup lang="ts">
import type { CraftingListItem } from '../../entities/CraftingListItem'
import QuantityInput from '../atoms/QuantityInput.vue'

defineProps<{
  entry: CraftingListItem
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
  remove: [itemId: number]
  viewDetails: [itemId: number]
}>()
</script>

<template>
  <div class="list-entry">
    <div class="list-entry-info">
      <h3 class="list-entry-name">{{ entry.item.name }}</h3>
      <p class="list-entry-meta">
        <span v-translate="'label_level'"></span> {{ entry.item.level }} · <span v-translate="'label_type'"></span> {{ entry.item.type }}
      </p>
    </div>

    <div class="list-entry-controls">
      <div class="qty-row">
        <span class="qty-label" v-translate="'qty_label'"></span>
        <QuantityInput
          :model-value="entry.quantity"
          @update:model-value="emit('updateQuantity', entry.item.id, $event)"
        />
      </div>

      <button
        @click="emit('viewDetails', entry.item.id)"
        class="btn-secondary btn-sm"
        v-translate="'view_button'"
      ></button>

      <button
        @click="emit('remove', entry.item.id)"
        class="btn-danger btn-sm"
        v-translate="'remove_button'"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.list-entry {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.list-entry-info { flex: 1; }
.list-entry-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  margin: 0;
}
.list-entry-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0.15rem 0 0;
}

.list-entry-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.qty-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.qty-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.btn-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
}
</style>
