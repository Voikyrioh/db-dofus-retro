<script setup lang="ts">
import ItemSprite from './ItemSprite.vue'
import type { Item } from '../../entities/Item'

defineProps<{
  item: Item
}>()

const emit = defineEmits<{
  click: [item: Item]
}>()
</script>

<template>
  <div class="item-card" @click="emit('click', item)">
    <div class="item-card-header">
      <ItemSprite
        :category="item.sprite?.category"
        :sprite="item.sprite?.sprite"
        :size="40"
      />
      <h3 class="item-card-name">{{ item.name }}</h3>
    </div>
    <div class="item-card-stats">
      <p><span class="item-card-label" v-translate="'label_id'"></span>: {{ item.id }}</p>
      <p><span class="item-card-label" v-translate="'label_type'"></span>: {{ item.type }}</p>
      <p><span class="item-card-label" v-translate="'label_level'"></span>: {{ item.level }}</p>
      <p><span class="item-card-label" v-translate="'label_weight'"></span>: {{ item.pod }} <span v-translate="'label_pods'"></span></p>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: border-color 0.15s;
}
.item-card:hover { border-color: var(--color-accent); }

.item-card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.item-card-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-accent);
  flex: 1;
  margin: 0;
}

.item-card-stats {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}
.item-card-label { color: var(--color-text-muted); }
</style>
