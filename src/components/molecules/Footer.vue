<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-800 border-t border-gray-700 mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-gray-400 text-sm">
          &copy; {{ currentYear }} Dofus Retro DB. All rights reserved.
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-gray-400 hover:text-blue-400 text-sm transition-colors">About</a>
          <a href="#" class="text-gray-400 hover:text-blue-400 text-sm transition-colors">Contact</a>
          <a href="#" class="text-gray-400 hover:text-blue-400 text-sm transition-colors">GitHub</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
</style>
