<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

const { isLoggedIn, user, logout } = useAuth()

function navigate(page: 'home' | 'items' | 'crafting-list' | 'crafts' | 'login' | 'register') {
  ;(window as any).navigateTo?.(page)
}

async function handleLogout() {
  await logout()
  navigate('home')
}
</script>

<template>
  <header class="bg-gray-800 border-b border-gray-700">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-blue-400 cursor-pointer" @click="navigate('home')" v-translate="'site_title'"></h1>
        <nav class="flex gap-6 items-center">
          <a @click.prevent="navigate('home')" href="#" class="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" v-translate="'nav_home'"></a>
          <a @click.prevent="navigate('items')" href="#" class="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" v-translate="'nav_items'"></a>
          <a @click.prevent="navigate('crafts')" href="#" class="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" v-translate="'nav_crafts'"></a>
          <a v-if="isLoggedIn" @click.prevent="navigate('crafting-list')" href="#" class="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" v-translate="'nav_crafting_list'"></a>
          <template v-if="!isLoggedIn">
            <a @click.prevent="navigate('login')" href="#" class="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" v-translate="'nav_login'"></a>
          </template>
          <template v-else>
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-default select-none"
                :title="user?.username"
              >
                {{ user?.username?.charAt(0).toUpperCase() }}
              </div>
              <a @click.prevent="handleLogout" href="#" class="text-gray-400 hover:text-red-400 text-sm transition-colors" v-translate="'nav_logout'"></a>
            </div>
          </template>
          <div class="border border-gray-600 rounded px-2 py-0.5 ml-2">
            <SelectLang />
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
:deep(select) {
  background: transparent;
  color: rgb(209 213 219);
  font-size: 0.75rem;
  border: none;
  outline: none;
  cursor: pointer;
}
:deep(option) {
  background: rgb(31 41 55);
}
</style>
