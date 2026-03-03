<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import CraftingListItemWithIngredients from '../molecules/CraftingListItemWithIngredients.vue'
import AllMaterialsInventoryList from '../molecules/AllMaterialsInventoryList.vue'
import { useCraftingList } from '../../composables/useCraftingList'
import { useInventory } from '../../composables/useInventory'
import { useMaterialCalculator } from '../../composables/useMaterialCalculator'
import { getCraftDetails } from '../../services/itemService'

const { craftingList, removeItem: removeFromList, craftItem, clearCrafted } = useCraftingList()
const { inventory, setQuantity, deductMaterials } = useInventory()
const { requirements, missingMaterials, loading, error, calculateRequirements } = useMaterialCalculator(craftingList, inventory)

const craftingSuccess = ref(false)
const craftedItemName = ref('')

// Calculate requirements on mount
onMounted(() => {
  calculateRequirements()
})

function navigateToSearch() {
  ;(window as any).navigateTo?.('items')
}

function handleUpdateQuantity(itemId: number, quantity: number) {
  const requirement = requirements.value.find(req => req.item.id === itemId)
  if (requirement) {
    setQuantity(requirement.item, quantity)
  }
}

async function handleCraft(itemId: number) {
  // Get craft details
  const craft = await getCraftDetails(itemId)
  if (!craft || craft.length === 0) return

  // Deduct materials from inventory
  const materialsToDeduct = craft.map(ingredient => ({
    itemId: ingredient.item.id,
    quantity: ingredient.quantity
  }))
  deductMaterials(materialsToDeduct)

  // Decrease crafting list quantity
  craftItem(itemId)

  // Show success message
  const craftedItem = craftingList.value.find(entry => entry.item.id === itemId)
  if (craftedItem) {
    craftedItemName.value = craftedItem.item.name
  }
  craftingSuccess.value = true
  setTimeout(() => {
    craftingSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-2">Crafting List</h2>
        <p class="text-gray-400 text-center mb-8">
          Manage your crafting goals and track required materials
        </p>

        <!-- Success notification -->
        <div
          v-if="craftingSuccess"
          class="mb-6 bg-green-900/20 border border-green-600 rounded-lg p-4 text-center"
        >
          <p class="text-green-400 font-semibold">✓ Successfully crafted {{ craftedItemName }}!</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- LEFT COLUMN - Crafting List -->
          <div>
            <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-blue-400">Items to Craft</h3>
                <button
                  v-if="craftingList.some(e => e.crafted)"
                  @click="clearCrafted"
                  class="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                >
                  Clear crafted
                </button>
              </div>

              <div v-if="!craftingList.some(e => !e.crafted) && craftingList.length === 0" class="text-center py-8">
                <p class="text-gray-400 mb-4">Your crafting list is empty</p>
                <button
                  @click="navigateToSearch"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Search Items
                </button>
              </div>

              <div v-else-if="!craftingList.some(e => !e.crafted) && craftingList.length > 0" class="text-center py-8">
                <p class="text-green-400 font-semibold mb-2">✓ All items crafted!</p>
                <div class="flex justify-center gap-3">
                  <button
                    @click="clearCrafted"
                    class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Clear list
                  </button>
                  <button
                    @click="navigateToSearch"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Search more items
                  </button>
                </div>
              </div>

              <div v-else class="space-y-4">
                <CraftingListItemWithIngredients
                  v-for="entry in [...craftingList].sort((a, b) => (a.crafted ? 1 : 0) - (b.crafted ? 1 : 0))"
                  :key="entry.item.id"
                  :entry="entry"
                  :inventory="inventory"
                  @craft="handleCraft"
                  @remove="removeFromList"
                />
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN - Materials Section -->
          <div class="space-y-6">
            <!-- All Materials with Inventory Input -->
            <AllMaterialsInventoryList
              :requirements="requirements"
              :missing-count="missingMaterials.length"
              @update-quantity="handleUpdateQuantity"
            />

            <!-- Loading/Error States -->
            <div v-if="loading" class="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <p class="text-gray-400">Calculating requirements...</p>
            </div>
            <div v-if="error" class="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p class="text-red-400">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
</style>
