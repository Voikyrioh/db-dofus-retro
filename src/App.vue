<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './components/pages/HomePage.vue'
import ItemSearchPage from './components/pages/ItemSearchPage.vue'
import CraftingListPage from './components/pages/CraftingListPage.vue'
import CraftBrowsePage from './components/pages/CraftBrowsePage.vue'
import LoginPage from './components/pages/LoginPage.vue'
import RegisterPage from './components/pages/RegisterPage.vue'
import type { Item } from './entities/Item'
import { useAuth } from './composables/useAuth'

const { isLoggedIn } = useAuth()
const currentPage = ref<'home' | 'items' | 'crafting-list' | 'crafts' | 'login' | 'register'>('home')
const preselectedItem = ref<Item | null>(null)

function setPage(page: 'home' | 'items' | 'crafting-list' | 'crafts' | 'login' | 'register'): void {
  if (page === 'crafting-list' && !isLoggedIn.value) {
    currentPage.value = 'login'
    preselectedItem.value = null
    return
  }
  currentPage.value = page
  preselectedItem.value = null
}

function navigateToItemSearch(item: Item): void {
  preselectedItem.value = item
  currentPage.value = 'items'
}

;(window as any).navigateTo = setPage
;(window as any).navigateToItemSearch = navigateToItemSearch
// Rétrocompatibilité pour composants utilisant encore navigateToItemDetails
;(window as any).navigateToItemDetails = navigateToItemSearch
</script>

<template>
  <HomePage v-if="currentPage === 'home'" />
  <ItemSearchPage
    v-else-if="currentPage === 'items'"
    :initial-item="preselectedItem"
  />
  <CraftingListPage v-else-if="currentPage === 'crafting-list'" />
  <CraftBrowsePage v-else-if="currentPage === 'crafts'" />
  <LoginPage v-else-if="currentPage === 'login'" />
  <RegisterPage v-else-if="currentPage === 'register'" />
</template>

<style scoped>
</style>
