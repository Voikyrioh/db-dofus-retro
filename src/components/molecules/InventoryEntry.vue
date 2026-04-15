<script setup lang="ts">
import type { InventoryItem } from '../../entities/InventoryItem'
import QuantityInput from '../atoms/QuantityInput.vue'

defineProps<{
  entry: InventoryItem
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
  remove: [itemId: number]
}>()
</script>

<template>
  <div class="inv-entry">
    <div class="inv-entry-info">
      <h4 class="inv-entry-name">{{ entry.item.name }}</h4>
      <p class="inv-entry-meta"><span v-translate="'label_level'"></span> {{ entry.item.level }}</p>
    </div>

    <div class="inv-entry-controls">
      <QuantityInput
        :model-value="entry.quantity"
        :min="0"
        @update:model-value="emit('updateQuantity', entry.item.id, $event)"
      />
      <button
        @click="emit('remove', entry.item.id)"
        class="btn-danger inv-remove-btn"
        title="Remove from inventory"
      >×</button>
    </div>
  </div>
</template>

<style scoped>
.inv-entry {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.inv-entry-info { flex: 1; }
.inv-entry-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  margin: 0;
}
.inv-entry-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0.1rem 0 0;
}

.inv-entry-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-remove-btn {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
