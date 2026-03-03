<script setup lang="ts">
import type { CraftingListItem } from '../../entities/CraftingListItem'
import QuantityInput from '../atoms/QuantityInput.vue'

defineProps<{
  entry: CraftingListItem
}>()

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number]
  remove: [itemId: number]
  viewDetails: [itemId: number]
}>()
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
    <div class="flex-1">
      <h3 class="font-semibold text-gray-100">{{ entry.item.name }}</h3>
      <p class="text-xs text-gray-400 mt-1">
        <span v-translate="'label_level'"></span> {{ entry.item.level }} • <span v-translate="'label_type'"></span> {{ entry.item.type }}
      </p>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-400" v-translate="'qty_label'"></span>
        <QuantityInput
          :model-value="entry.quantity"
          @update:model-value="emit('updateQuantity', entry.item.id, $event)"
        />
      </div>

      <button
        @click="emit('viewDetails', entry.item.id)"
        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        v-translate="'view_button'"
      ></button>

      <button
        @click="emit('remove', entry.item.id)"
        class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
        v-translate="'remove_button'"
      ></button>
    </div>
  </div>
</template>

<style scoped>
</style>
