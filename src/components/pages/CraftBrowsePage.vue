<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import CraftBrowseCard from '../molecules/CraftBrowseCard.vue'
import type { CraftListing } from '../../entities/Craft'
import { getCraftList } from '../../services/itemService'

const PAGE_SIZE = 10
const entries = ref<CraftListing[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const page = ref(0)
const hasMore = ref(true)
const sentinelRef = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

async function loadMore() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  error.value = null
  try {
    page.value++
    const result = await getCraftList(page.value, PAGE_SIZE)
    entries.value.push(...result)
    if (result.length < PAGE_SIZE) {
      hasMore.value = false
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    page.value--
  } finally {
    loading.value = false
  }
  // If sentinel is still visible after loading, fetch the next page
  if (hasMore.value && sentinelRef.value) {
    const { top } = sentinelRef.value.getBoundingClientRect()
    if (top < window.innerHeight) {
      loadMore()
    }
  }
}

onMounted(() => {
  loadMore()
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      loadMore()
    }
  })
  if (sentinelRef.value) {
    observer.observe(sentinelRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-1 container mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold text-center mb-2" v-translate="'crafts_page_title'"></h2>
      <p class="text-gray-400 text-center mb-8" v-translate="'crafts_page_subtitle'"></p>

      <div class="space-y-4">
        <CraftBrowseCard
          v-for="entry in entries"
          :key="entry.item.id"
          :entry="entry"
        />
      </div>

      <div v-if="loading" class="text-center py-6 text-gray-400" v-translate="'loading_crafts'"></div>
      <p v-else-if="!hasMore && entries.length > 0" class="text-center py-6 text-gray-500" v-translate="'no_more_crafts'"></p>
      <p v-if="error" class="text-center py-4 text-red-400">{{ error }}</p>

      <div ref="sentinelRef" class="h-1"></div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
</style>
