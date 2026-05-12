<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'
import ItemSprite from './ItemSprite.vue'

const props = defineProps<{
  requirement: MaterialRequirement
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
}>()

function handleInput(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value, 10)
  if (!isNaN(value) && value >= 0) {
    emit('updateQuantity', props.requirement.item.id, value)
  }
}
</script>

<template>
  <div class="mat-row" :class="requirement.missing === 0 ? 'mat-row--done' : ''">
    <ItemSprite :category="requirement.item.sprite?.category" :sprite="requirement.item.sprite?.sprite" :size="32" />
    <div class="mat-info">
      <p class="mat-name">{{ requirement.item.name }}</p>
      <p class="mat-need"><span v-translate="'need_label'"></span> {{ requirement.needed }}</p>
    </div>
    <div class="mat-controls">
      <input
        type="number"
        :value="requirement.owned"
        @input="handleInput"
        min="0"
        class="mat-input input-field"
      />
      <div class="mat-status">
        <span v-if="requirement.missing > 0" class="mat-missing">-{{ requirement.missing }}</span>
        <span v-else class="mat-ok">✓</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mat-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  transition: opacity 0.2s;
}
.mat-row:last-child { border-bottom: none; }
.mat-row--done { opacity: 0.45; }

.mat-info { flex: 1; min-width: 0; }
.mat-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mat-need {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.mat-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mat-input {
  width: 5rem;
  text-align: center;
  padding: 0.25rem 0.4rem;
  font-size: 0.875rem;
}

.mat-status { width: 3.5rem; text-align: right; }
.mat-missing { font-size: 0.75rem; font-weight: 700; color: var(--color-error); }
.mat-ok { font-size: 0.75rem; font-weight: 700; color: var(--color-success); }

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] { -moz-appearance: textfield; }
</style>
