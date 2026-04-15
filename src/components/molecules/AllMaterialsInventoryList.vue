<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'
import MaterialInventoryInput from '../atoms/MaterialInventoryInput.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'

defineProps<{
  requirements: MaterialRequirement[]
  missingCount: number
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
}>()

function handleUpdateQuantity(itemId: number, quantity: number) {
  emit('updateQuantity', itemId, quantity)
}
</script>

<template>
  <div class="mat-list card-ornate">
    <OrnateCorners />
    <div class="mat-list-header">
      <h3 class="mat-list-title" v-translate="'required_materials'"></h3>
      <span
        v-if="requirements.length > 0"
        class="mat-badge"
        :class="missingCount === 0 ? 'mat-badge--ok' : 'mat-badge--missing'"
      >
        <span v-if="missingCount === 0" v-translate="'all_ready'"></span>
        <span v-else>{{ missingCount }} <span v-translate="'missing_label'"></span></span>
      </span>
    </div>

    <div v-if="requirements.length === 0" class="mat-empty">
      <p v-translate="'add_materials_hint'"></p>
    </div>

    <div v-else class="mat-entries">
      <MaterialInventoryInput
        v-for="requirement in requirements"
        :key="requirement.item.id"
        :requirement="requirement"
        @update-quantity="handleUpdateQuantity"
      />
    </div>
  </div>
</template>

<style scoped>
.mat-list {
  padding: 1rem 1.25rem;
}

.mat-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.mat-list-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-accent);
  margin: 0;
}

.mat-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid;
}
.mat-badge--ok {
  color: var(--color-success);
  border-color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
}
.mat-badge--missing {
  color: var(--color-error);
  border-color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 12%, transparent);
}

.mat-empty {
  text-align: center;
  padding: 1rem 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.mat-entries { display: flex; flex-direction: column; }
</style>
