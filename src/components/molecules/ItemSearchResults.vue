<script setup lang="ts">
import type { Item } from '../../entities/Item'
import ItemCard from '../atoms/ItemCard.vue'

defineProps<{
  items: Item[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  itemClick: [item: Item]
}>()
</script>

<template>
  <div class="w-full">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-400">Searching...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-700 rounded-lg p-4">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Results -->
    <div v-else-if="items.length > 0" class="space-y-4">
      <p class="text-gray-400 text-sm">Found {{ items.length }} item{{ items.length !== 1 ? 's' : '' }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @click="emit('itemClick', item)"
        />
      </div>
    </div>

    <!-- No results -->
    <div v-else class="text-center py-8">
      <p class="text-gray-400">No items found</p>
    </div>
  </div>
</template>

<style scoped>
</style>
