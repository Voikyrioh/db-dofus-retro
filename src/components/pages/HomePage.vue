<script setup lang="ts">
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-4">Welcome to Dofus Retro DB</h2>
        <p class="text-gray-400 text-center">
          Your ultimate tool for managing crafting objectives and resource gathering in Dofus Retro.
        </p>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
</style>
