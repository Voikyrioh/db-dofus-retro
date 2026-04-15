<script setup lang="ts">
import type { MaterialRequirement } from '../../entities/MaterialRequirement'

defineProps<{
  requirement: MaterialRequirement
}>()

const emit = defineEmits<{
  updateInventory: [itemId: number, quantity: number]
}>()
</script>

<template>
  <div class="req-card">
    <div class="req-card-header">
      <div class="req-card-info">
        <h4 class="req-card-name">{{ requirement.item.name }}</h4>
        <p class="req-card-meta"><span v-translate="'label_level'"></span> {{ requirement.item.level }} · {{ requirement.item.pod }} <span v-translate="'label_pods'"></span></p>
      </div>
      <div v-if="requirement.missing === 0" class="req-status-ok" v-translate="'status_complete'"></div>
    </div>

    <div class="req-grid">
      <div class="req-col">
        <p class="req-col-label" v-translate="'col_needed'"></p>
        <p class="req-col-value req-col-value--accent">{{ requirement.needed }}</p>
      </div>
      <div class="req-col">
        <p class="req-col-label" v-translate="'col_owned'"></p>
        <p class="req-col-value">{{ requirement.owned }}</p>
      </div>
      <div class="req-col">
        <p class="req-col-label" v-translate="'col_missing'"></p>
        <p class="req-col-value" :class="requirement.missing > 0 ? 'req-col-value--error' : 'req-col-value--ok'">
          {{ requirement.missing }}
        </p>
      </div>
    </div>

    <div class="req-progress">
      <div
        class="req-progress-bar"
        :class="requirement.missing === 0 ? 'req-progress-bar--ok' : 'req-progress-bar--partial'"
        :style="{ width: `${Math.min(100, (requirement.owned / requirement.needed) * 100)}%` }"
      ></div>
    </div>

    <div class="req-btns">
      <button
        @click="emit('updateInventory', requirement.item.id, requirement.owned + 1)"
        class="btn-secondary req-btn"
        v-translate="'add_one_button'"
      ></button>
      <button
        v-if="requirement.owned > 0"
        @click="emit('updateInventory', requirement.item.id, Math.max(0, requirement.owned - 1))"
        class="btn-secondary req-btn"
        v-translate="'remove_one_button'"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.req-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

.req-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.req-card-info { flex: 1; }
.req-card-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  margin: 0;
}
.req-card-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0.15rem 0 0;
}
.req-status-ok {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-success);
}

.req-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  text-align: center;
  margin-bottom: 0.75rem;
}
.req-col-label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin: 0 0 0.2rem;
}
.req-col-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  margin: 0;
}
.req-col-value--accent { color: var(--color-accent); }
.req-col-value--ok { color: var(--color-success); }
.req-col-value--error { color: var(--color-error); }

.req-progress {
  background: var(--color-bg-elevated);
  border-radius: 999px;
  height: 6px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.req-progress-bar {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s;
}
.req-progress-bar--ok { background: var(--color-success); }
.req-progress-bar--partial { background: var(--color-accent); }

.req-btns {
  display: flex;
  gap: 0.5rem;
}
.req-btn {
  flex: 1;
  font-size: 0.78rem;
  padding: 0.25rem 0.5rem;
}
</style>
