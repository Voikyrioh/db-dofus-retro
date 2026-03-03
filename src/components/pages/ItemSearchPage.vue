<script setup lang="ts">
import { ref } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import ItemSearchForm from '../molecules/ItemSearchForm.vue'
import ItemSearchResults from '../molecules/ItemSearchResults.vue'
import { searchItems } from '../../services/itemService'
import type { Item } from '../../entities/Item'

const items = ref<Item[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const hasSearched = ref(false)

async function handleSearch(searchText: string) {
  loading.value = true
  error.value = null
  hasSearched.value = true

  try {
    items.value = await searchItems(searchText)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while searching'
    items.value = []
  } finally {
    loading.value = false
  }
}

function handleItemClick(item: Item) {
  ;(window as any).navigateToItemDetails?.(item)
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-2" v-translate="'items_page_title'"></h2>
        <p class="text-gray-400 text-center mb-8" v-translate="'items_page_subtitle'"></p>

        <div class="mb-8">
          <ItemSearchForm @search="handleSearch" />
        </div>

        <ItemSearchResults
          v-if="hasSearched"
          :items="items"
          :loading="loading"
          :error="error"
          @item-click="handleItemClick"
        />
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
</style>
