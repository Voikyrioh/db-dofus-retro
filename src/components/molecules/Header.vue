<script setup lang="ts">
function navigate(page: 'home' | 'items' | 'crafting-list') {
  ;(window as any).navigateTo?.(page)
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
          <a @click.prevent="navigate('crafting-list')" href="#" class="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" v-translate="'nav_crafting_list'"></a>
          <a href="#" class="text-gray-300 hover:text-blue-400 transition-colors" v-translate="'nav_monsters'"></a>
          <a href="#" class="text-gray-300 hover:text-blue-400 transition-colors" v-translate="'nav_recipes'"></a>
          <SelectLang />
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>
