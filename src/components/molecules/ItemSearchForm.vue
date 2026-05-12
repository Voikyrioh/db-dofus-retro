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
  <form @submit="handleSearch" class="search-form">
    <SearchInput v-model="searchText" placeholder="Search for items..." />
    <button type="submit" class="btn-primary search-submit" v-translate="'search_button'"></button>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}
.search-submit {
  white-space: nowrap;
}
</style>
