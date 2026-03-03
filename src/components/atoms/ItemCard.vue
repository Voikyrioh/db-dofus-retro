<script setup lang="ts">
import ItemSprite from './ItemSprite.vue'
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
    <div class="flex items-start gap-3 mb-2">
      <ItemSprite
        :category="item.sprite?.category"
        :sprite="item.sprite?.sprite"
        :size="40"
      />
      <h3 class="text-lg font-semibold text-blue-400 flex-1">{{ item.name }}</h3>
    </div>
    <div class="space-y-1 text-sm text-gray-300">
      <p><span class="text-gray-500" v-translate="'label_id'"></span>: {{ item.id }}</p>
      <p><span class="text-gray-500" v-translate="'label_type'"></span>: {{ item.type }}</p>
      <p><span class="text-gray-500" v-translate="'label_level'"></span>: {{ item.level }}</p>
      <p><span class="text-gray-500" v-translate="'label_weight'"></span>: {{ item.pod }} <span v-translate="'label_pods'"></span></p>
    </div>
  </div>
</template>

<style scoped>
</style>
