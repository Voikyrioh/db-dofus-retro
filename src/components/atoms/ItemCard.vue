<script setup lang="ts">
import type { Item } from '../../entities/Item'

defineProps<{
  item: Item
}>()

const emit = defineEmits<{
  click: [item: Item]
}>()
</script>

<template>
  <div
    @click="emit('click', item)"
    class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer"
  >
    <h3 class="text-lg font-semibold text-blue-400 mb-2">{{ item.name }}</h3>
    <div class="space-y-1 text-sm text-gray-300">
      <p><span class="text-gray-500">ID:</span> {{ item.id }}</p>
      <p><span class="text-gray-500">Type:</span> {{ item.type }}</p>
      <p><span class="text-gray-500">Level:</span> {{ item.level }}</p>
      <p><span class="text-gray-500">Weight:</span> {{ item.pod }} pods</p>
    </div>
  </div>
</template>

<style scoped>
</style>
