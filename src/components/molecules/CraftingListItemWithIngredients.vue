<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { CraftingListItem } from '../../entities/CraftingListItem'
import type { Craft } from '../../entities/Craft'
import type { InventoryItem } from '../../entities/InventoryItem'
import { getCraftDetails } from '../../services/itemService'

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
  loading.value = true
  try {
    craft.value = await getCraftDetails(props.entry.item.id)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="bg-gray-800 border rounded-lg p-4" :class="canCraft ? 'border-green-600' : 'border-gray-700'">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-100">{{ entry.item.name }}</h3>
        <p class="text-xs text-gray-400 mt-1">Quantity: {{ entry.quantity }} • Level {{ entry.item.level }}</p>
      </div>

      <div class="flex items-center gap-2">
        <div v-if="canCraft" class="px-2 py-1 bg-green-900/30 border border-green-600 rounded text-xs text-green-400 font-semibold">
          ✓ Can Craft
        </div>
        <button
          @click="emit('remove', entry.item.id)"
          class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
        >
          Remove
        </button>
      </div>
    </div>

    <!-- Ingredients -->
    <div v-if="loading" class="text-xs text-gray-500">Loading ingredients...</div>
    <div v-else-if="!craft || craft.length === 0" class="text-xs text-gray-500">No craft recipe available</div>
    <div v-else class="space-y-1">
      <p class="text-xs text-gray-500 mb-2">Ingredients:</p>
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
    >
      Craft 1
    </button>
  </div>
</template>

<style scoped>
</style>
