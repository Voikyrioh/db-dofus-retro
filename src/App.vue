<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './components/pages/HomePage.vue'
import ItemSearchPage from './components/pages/ItemSearchPage.vue'
import ItemDetailsPage from './components/pages/ItemDetailsPage.vue'
import CraftingListPage from './components/pages/CraftingListPage.vue'
import CraftBrowsePage from './components/pages/CraftBrowsePage.vue'
import LoginPage from './components/pages/LoginPage.vue'
import RegisterPage from './components/pages/RegisterPage.vue'
import type { Item } from './entities/Item'
import { useAuth } from './composables/useAuth'

const { isLoggedIn } = useAuth()
const currentPage = ref<'home' | 'items' | 'item-details' | 'crafting-list' | 'crafts' | 'login' | 'register'>('home')
const selectedItem = ref<Item | null>(null)

// Simple page navigation without router
function setPage(page: 'home' | 'items' | 'crafting-list' | 'crafts' | 'login' | 'register') {
  if (page === 'crafting-list' && !isLoggedIn.value) {
    currentPage.value = 'login'
    selectedItem.value = null
    return
  }
  currentPage.value = page
  selectedItem.value = null
}

function navigateToItemDetails(item: Item) {
  selectedItem.value = item
  currentPage.value = 'item-details'
}

// Expose to window for Header navigation
;(window as any).navigateTo = setPage
;(window as any).navigateToItemDetails = navigateToItemDetails
</script>

<template>
  <HomePage v-if="currentPage === 'home'" />
  <ItemSearchPage v-else-if="currentPage === 'items'" />
  <ItemDetailsPage v-else-if="currentPage === 'item-details' && selectedItem" :item="selectedItem" />
  <CraftingListPage v-else-if="currentPage === 'crafting-list'" />
  <CraftBrowsePage v-else-if="currentPage === 'crafts'" />
  <LoginPage v-else-if="currentPage === 'login'" />
  <RegisterPage v-else-if="currentPage === 'register'" />
</template>

<style scoped>
</style>
