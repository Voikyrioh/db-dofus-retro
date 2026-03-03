<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-800 border-t border-gray-700 mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-gray-400 text-sm">
          &copy; {{ currentYear }} <span v-translate="'footer_rights'"></span>
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-gray-400 hover:text-blue-400 text-sm transition-colors" v-translate="'footer_about'"></a>
          <a href="#" class="text-gray-400 hover:text-blue-400 text-sm transition-colors" v-translate="'footer_contact'"></a>
          <a href="#" class="text-gray-400 hover:text-blue-400 text-sm transition-colors" v-translate="'footer_github'"></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
</style>
