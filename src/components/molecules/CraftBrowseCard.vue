<script setup lang="ts">
import { ref } from 'vue'
import ItemSprite from '../atoms/ItemSprite.vue'
import CraftIngredientCard from '../atoms/CraftIngredientCard.vue'
import type { CraftListing } from '../../entities/Craft'
import { useAuth } from '../../composables/useAuth'
import { useCraftingList } from '../../composables/useCraftingList'

defineProps<{
  entry: CraftListing
}>()

const { isLoggedIn } = useAuth()
const { addItem } = useCraftingList()

const addedFlash = ref(false)

function handleAddToList(entry: CraftListing) {
  addItem(entry.item, 1, entry.recipe)
  addedFlash.value = true
  setTimeout(() => {
    addedFlash.value = false
  }, 2000)
}

function handleView(entry: CraftListing) {
  ;(window as any).navigateToItemDetails?.(entry.item)
}
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-wrap gap-4 items-start">
    <!-- Left: item info -->
    <div class="flex items-center gap-3 min-w-40">
      <ItemSprite
        :category="entry.item.sprite?.category"
        :sprite="entry.item.sprite?.sprite"
        :size="48"
      />
      <div>
        <div class="font-bold text-blue-400">{{ entry.item.name }}</div>
        <div class="text-xs text-gray-400 mt-1">
          <span v-translate="'label_level'"></span> {{ entry.item.level }} • {{ entry.item.pod }} <span v-translate="'label_pods'"></span>
        </div>
      </div>
    </div>

    <!-- Middle: ingredients -->
    <div class="flex-1 flex flex-wrap gap-2">
      <CraftIngredientCard
        v-for="ingredient in entry.recipe"
        :key="ingredient.item.id"
        :ingredient="ingredient"
      />
    </div>

    <!-- Right: actions -->
    <div class="flex flex-col gap-2">
      <button
        @click="handleView(entry)"
        class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-100 text-sm rounded transition-colors"
        v-translate="'view_button'"
      ></button>
      <button
        v-if="isLoggedIn"
        @click="handleAddToList(entry)"
        class="px-3 py-1.5 text-sm rounded transition-colors"
        :class="addedFlash ? 'bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'"
      >
        <span v-if="addedFlash" v-translate="'added_to_list'"></span>
        <span v-else v-translate="'add_to_list'"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
