<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'

defineProps<{
  missingMaterials: MaterialRequirement[]
}>()

const emit = defineEmits<{
  addOne: [itemId: number]
}>()
</script>

<template>
  <div class="missing-card card-ornate">
    <h3 class="missing-title" v-translate="'missing_materials_title'"></h3>

    <div v-if="missingMaterials.length === 0" class="missing-all-ok">
      <p v-translate="'all_materials_available'"></p>
    </div>

    <div v-else class="missing-list">
      <div
        v-for="material in missingMaterials"
        :key="material.item.id"
        class="missing-row"
      >
        <p class="missing-name">{{ material.item.name }}</p>
        <div class="missing-controls">
          <span class="missing-qty">-{{ material.missing }}</span>
          <button
            @click="emit('addOne', material.item.id)"
            class="btn-secondary missing-add-btn"
          >+1</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.missing-card {
  padding: 1rem 1.25rem;
}

.missing-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-error);
  margin: 0 0 0.75rem;
}

.missing-all-ok {
  text-align: center;
  padding: 0.75rem 0;
  color: var(--color-success);
  font-weight: 700;
  font-size: 0.875rem;
}

.missing-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.missing-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 0.35rem 0.6rem;
  background: var(--color-error-bg);
  border-radius: 4px;
}
.missing-name {
  color: var(--color-error);
  font-weight: 600;
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.missing-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
.missing-qty {
  color: var(--color-error);
  font-weight: 700;
}
.missing-add-btn {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
}
</style>
