<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { CraftingListItem } from '../../entities/CraftingListItem'
import type { Craft } from '../../entities/Craft'
import type { InventoryItem } from '../../entities/InventoryItem'
import { getCraftDetails } from '../../services/itemService'
import ItemSprite from '../atoms/ItemSprite.vue'
import SkeletonBlock from '../atoms/SkeletonBlock.vue'

const props = defineProps<{
  entry: CraftingListItem
  inventory: InventoryItem[]
}>()

const emit = defineEmits<{
  craft: [itemId: number]
  remove: [itemId: number]
}>()

const craft = ref<Craft | null>(null)
const loading = ref(false)

const canCraft = computed(() => {
  if (!craft.value || craft.value.length === 0) return false

  return craft.value.every(ingredient => {
    const owned = props.inventory.find(inv => inv.item.id === ingredient.item.id)?.quantity ?? 0
    return owned >= ingredient.quantity
  })
})

onMounted(async () => {
  if (props.entry.recipe && props.entry.recipe.length > 0) {
    craft.value = props.entry.recipe
    return
  }
  loading.value = true
  try {
    craft.value = await getCraftDetails(props.entry.item.id)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div
    class="craft-entry"
    :class="[
      entry.crafted ? 'craft-entry--crafted' : '',
      !entry.crafted && canCraft ? 'craft-entry--ready' : ''
    ]"
  >
    <div class="craft-entry-header">
      <div class="craft-entry-item">
        <ItemSprite :category="entry.item.sprite?.category" :sprite="entry.item.sprite?.sprite" :size="40" />
        <div class="craft-entry-meta">
          <h3 class="craft-entry-name" :class="entry.crafted ? 'craft-entry-name--crafted' : ''">
            {{ entry.item.name }}
          </h3>
          <p class="craft-entry-sub">
            <span v-if="entry.crafted" v-translate="'crafted_label'"></span>
            <span v-else><span v-translate="'quantity_label'"></span> {{ entry.quantity }}</span>
            {{ ' · ' }}<span v-translate="'label_level'"></span> {{ entry.item.level }}
          </p>
        </div>
      </div>

      <div class="craft-entry-actions">
        <div v-if="entry.crafted" class="status-badge status-badge--crafted" v-translate="'status_crafted'"></div>
        <div v-else-if="canCraft" class="status-badge status-badge--ready" v-translate="'status_can_craft'"></div>
        <button
          @click="emit('remove', entry.item.id)"
          class="btn-danger btn-sm"
          v-translate="'remove_button'"
        ></button>
      </div>
    </div>

    <template v-if="!entry.crafted">
      <div v-if="loading" class="ingredient-skeleton">
        <SkeletonBlock height="0.7rem" width="80%" />
        <SkeletonBlock height="0.7rem" width="60%" />
      </div>
      <div v-else-if="!craft || craft.length === 0" class="craft-entry-status" v-translate="'no_craft_available'"></div>
      <div v-else class="craft-ingredients">
        <p class="craft-ingredients-label" v-translate="'ingredients_label'"></p>
        <div
          v-for="ingredient in craft"
          :key="ingredient.item.id"
          class="ingredient-line"
        >
          <span class="ingredient-line-name">{{ ingredient.item.name }}</span>
          <div class="ingredient-line-qty">
            <span class="ingredient-line-need">{{ ingredient.quantity }}×</span>
            <span
              :class="(inventory.find(inv => inv.item.id === ingredient.item.id)?.quantity ?? 0) >= ingredient.quantity
                ? 'ingredient-line-owned--ok'
                : 'ingredient-line-owned--missing'"
            >
              ({{ inventory.find(inv => inv.item.id === ingredient.item.id)?.quantity ?? 0 }})
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="canCraft"
        @click="emit('craft', entry.item.id)"
        class="btn-primary craft-btn"
        v-translate="'craft_one_button'"
      ></button>
    </template>
  </div>
</template>

<style scoped>
.craft-entry {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  background: var(--color-bg-surface);
  transition: opacity 0.2s;
}
.craft-entry--crafted {
  opacity: 0.5;
}
.craft-entry--ready {
  border-color: var(--color-success);
}

.craft-entry-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
}

.craft-entry-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
}
.craft-entry-meta { flex: 1; }
.craft-entry-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  margin: 0;
}
.craft-entry-name--crafted {
  text-decoration: line-through;
  color: var(--color-text-muted);
}
.craft-entry-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0.15rem 0 0;
}

.craft-entry-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid;
  white-space: nowrap;
}
.status-badge--crafted {
  color: var(--color-text-muted);
  border-color: var(--color-border);
  background: var(--color-bg-elevated);
}
.status-badge--ready {
  color: var(--color-success);
  border-color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
}

.btn-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
}

.craft-entry-status {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.craft-ingredients {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.25rem;
}
.craft-ingredients-label {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  margin: 0 0 0.4rem;
}
.ingredient-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-bg-elevated);
  border-radius: 4px;
}
.ingredient-line-name { color: var(--color-text-secondary); }
.ingredient-line-qty { display: flex; gap: 0.4rem; align-items: center; }
.ingredient-line-need { color: var(--color-text-muted); }
.ingredient-line-owned--ok { color: var(--color-success); font-weight: 700; }
.ingredient-line-owned--missing { color: var(--color-error); font-weight: 700; }

.craft-btn {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.5rem;
}

.ingredient-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
}
</style>
