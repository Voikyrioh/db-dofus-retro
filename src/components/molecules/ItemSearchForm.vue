<script setup lang="ts">
import { ref } from 'vue'
import SearchInput from '../atoms/SearchInput.vue'

const emit = defineEmits<{
  search: [searchText: string]
}>()

const searchText = ref('')

function handleSearch(event: Event) {
  event.preventDefault()
  if (searchText.value.trim()) {
    emit('search', searchText.value.trim())
  }
}
</script>

<template>
  <form @submit="handleSearch" class="w-full">
    <div class="flex gap-3">
      <div class="flex-1">
        <SearchInput
          v-model="searchText"
          placeholder="Search for items..."
        />
      </div>
      <button
        type="submit"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Search
      </button>
    </div>
  </form>
</template>

<style scoped>
</style>
