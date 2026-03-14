<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { CraftingListItem } from '../../entities/CraftingListItem'
import type { Craft } from '../../entities/Craft'
import type { InventoryItem } from '../../entities/InventoryItem'
import { getCraftDetails } from '../../services/itemService'
import ItemSprite from '../atoms/ItemSprite.vue'

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

// Check if item can be crafted
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
    class="border rounded-lg p-4 transition-opacity"
    :class="[
      entry.crafted ? 'bg-gray-800/50 border-gray-700 opacity-50' : 'bg-gray-800',
      !entry.crafted && canCraft ? 'border-green-600' : !entry.crafted ? 'border-gray-700' : ''
    ]"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-start gap-3 flex-1">
        <ItemSprite :category="entry.item.sprite?.category" :sprite="entry.item.sprite?.sprite" :size="40" />
        <div class="flex-1">
        <h3 class="font-semibold" :class="entry.crafted ? 'text-gray-400 line-through' : 'text-gray-100'">{{ entry.item.name }}</h3>
        <p class="text-xs text-gray-400 mt-1">
          <span v-if="entry.crafted" v-translate="'crafted_label'"></span>
          <span v-else><span v-translate="'quantity_label'"></span> {{ entry.quantity }}</span>
          {{ ' • ' }}<span v-translate="'label_level'"></span> {{ entry.item.level }}
        </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div v-if="entry.crafted" class="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-gray-400 font-semibold" v-translate="'status_crafted'"></div>
        <div v-else-if="canCraft" class="px-2 py-1 bg-green-900/30 border border-green-600 rounded text-xs text-green-400 font-semibold" v-translate="'status_can_craft'"></div>
        <button
          @click="emit('remove', entry.item.id)"
          class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
          v-translate="'remove_button'"
        ></button>
      </div>
    </div>

    <!-- Ingredients (hidden when crafted) -->
    <template v-if="!entry.crafted">
      <div v-if="loading" class="text-xs text-gray-500" v-translate="'loading_ingredients'"></div>
      <div v-else-if="!craft || craft.length === 0" class="text-xs text-gray-500" v-translate="'no_craft_available'"></div>
      <div v-else class="space-y-1">
        <p class="text-xs text-gray-500 mb-2" v-translate="'ingredients_label'"></p>
        <div
          v-for="ingredient in craft"
          :key="ingredient.item.id"
          class="flex items-center justify-between text-xs px-2 py-1 bg-gray-900/50 rounded"
        >
          <span class="text-gray-300">{{ ingredient.item.name }}</span>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">{{ ingredient.quantity }}×</span>
            <span
              :class="(inventory.find(inv => inv.item.id === ingredient.item.id)?.quantity ?? 0) >= ingredient.quantity
                ? 'text-green-400 font-semibold'
                : 'text-red-400'"
            >
              ({{ inventory.find(inv => inv.item.id === ingredient.item.id)?.quantity ?? 0 }})
            </span>
          </div>
        </div>
      </div>

      <!-- Craft Button -->
      <button
        v-if="canCraft"
        @click="emit('craft', entry.item.id)"
        class="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors"
        v-translate="'craft_one_button'"
      ></button>
    </template>
  </div>
</template>

<style scoped>
</style>
