<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import CraftDetails from '../molecules/CraftDetails.vue'
import QuantityInput from '../atoms/QuantityInput.vue'
import { getCraftDetails } from '../../services/itemService'
import { useCraftingList } from '../../composables/useCraftingList'
import type { Item } from '../../entities/Item'
import type { Craft } from '../../entities/Craft'

const props = defineProps<{
  item: Item
}>()

const craft = ref<Craft | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const quantityToAdd = ref(1)
const showAddSuccess = ref(false)

const { addItem, isInList, getQuantity } = useCraftingList()

async function loadCraftDetails() {
  loading.value = true
  error.value = null

  try {
    craft.value = await getCraftDetails(props.item.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while loading craft details'
  } finally {
    loading.value = false
  }
}

function handleAddToCraftingList() {
  addItem(props.item, quantityToAdd.value)
  showAddSuccess.value = true
  setTimeout(() => {
    showAddSuccess.value = false
  }, 2000)
}

function goToCraftingList() {
  ;(window as any).navigateTo?.('crafting-list')
}

function goBackToSearch() {
  ;(window as any).navigateTo?.('items')
}

onMounted(() => {
  loadCraftDetails()
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Back button -->
        <button
          @click="goBackToSearch"
          class="mb-6 text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to search</span>
        </button>

        <!-- Item details -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-3xl font-bold text-blue-400">{{ item.name }}</h2>

            <!-- Add to Crafting List -->
            <div class="flex items-center gap-3">
              <div v-if="isInList(item.id)" class="text-sm text-green-400">
                In list ({{ getQuantity(item.id) }})
              </div>
              <div class="flex items-center gap-2">
                <QuantityInput v-model="quantityToAdd" :min="1" />
                <button
                  @click="handleAddToCraftingList"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
                >
                  Add to List
                </button>
              </div>
            </div>
          </div>

          <!-- Success message -->
          <div
            v-if="showAddSuccess"
            class="mb-4 bg-green-900/20 border border-green-700 rounded-lg p-3 flex items-center justify-between"
          >
            <span class="text-green-400">✓ Added to crafting list!</span>
            <button
              @click="goToCraftingList"
              class="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              View List
            </button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p class="text-gray-500 mb-1">ID</p>
              <p class="text-gray-100 font-semibold">{{ item.id }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-1">Type</p>
              <p class="text-gray-100 font-semibold">{{ item.type }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-1">Level</p>
              <p class="text-gray-100 font-semibold">{{ item.level }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-1">Weight</p>
              <p class="text-gray-100 font-semibold">{{ item.pod }} pods</p>
            </div>
          </div>
        </div>

        <!-- Craft details -->
        <CraftDetails :craft="craft" :loading="loading" :error="error" />
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
</style>
