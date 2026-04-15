<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'
import MaterialRequirementCard from '../atoms/MaterialRequirementCard.vue'

defineProps<{
  requirements: MaterialRequirement[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  updateInventory: [itemId: number, quantity: number]
}>()
</script>

<template>
  <div class="mat-req-list">
    <div v-if="loading" class="mat-req-status">
      <p v-translate="'calculating_materials'"></p>
    </div>

    <div v-else-if="error" class="mat-req-error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="requirements.length === 0" class="mat-req-status">
      <p v-translate="'no_materials_required'"></p>
    </div>

    <div v-else class="mat-req-content">
      <div class="mat-req-summary">
        <p class="mat-req-count">
          {{ requirements.length }} <span v-translate="requirements.length !== 1 ? 'material_plural' : 'material_singular'"></span>
        </p>
        <div class="mat-req-stats">
          <span class="mat-req-ok">
            ✓ {{ requirements.filter(r => r.missing === 0).length }} <span v-translate="'complete_label'"></span>
          </span>
          <span class="mat-req-missing">
            {{ requirements.filter(r => r.missing > 0).length }} <span v-translate="'missing_label'"></span>
          </span>
        </div>
      </div>

      <div class="mat-req-cards">
        <MaterialRequirementCard
          v-for="requirement in requirements"
          :key="requirement.item.id"
          :requirement="requirement"
          @update-inventory="(itemId, quantity) => emit('updateInventory', itemId, quantity)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mat-req-status {
  text-align: center;
  padding: 2rem 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.mat-req-error {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error);
  border-radius: 8px;
  padding: 1rem;
  color: var(--color-error);
  font-size: 0.875rem;
}

.mat-req-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.mat-req-count {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}
.mat-req-stats { display: flex; gap: 1rem; font-size: 0.75rem; }
.mat-req-ok { color: var(--color-success); font-weight: 700; }
.mat-req-missing { color: var(--color-error); font-weight: 700; }

.mat-req-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
