<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'
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
  const craft = await getCraftDetails(itemId)
  if (!craft || craft.length === 0) return

  const materialsToDeduct = craft.map(ingredient => ({
    itemId: ingredient.item.id,
    quantity: ingredient.quantity
  }))
  deductMaterials(materialsToDeduct)
  craftItem(itemId)

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
  <div class="page-wrapper">
    <Header />

    <main class="page-main">
      <h2 class="page-title" v-translate="'crafting_page_title'"></h2>
      <p class="page-subtitle" v-translate="'crafting_page_subtitle'"></p>

      <!-- Success notification -->
      <div v-if="craftingSuccess" class="success-notif">
        <span v-translate="'craft_success_prefix'"></span> {{ craftedItemName }}!
      </div>

      <div class="content-grid">
        <!-- LEFT COLUMN - Crafting List -->
        <div>
          <div class="card-ornate crafting-card">
            <OrnateCorners />
            <div class="card-header">
              <h3 class="card-title" v-translate="'items_to_craft'"></h3>
              <button
                v-if="craftingList.some(e => e.crafted)"
                class="btn-secondary btn-sm"
                @click="clearCrafted"
                v-translate="'clear_crafted'"
              ></button>
            </div>

            <div v-if="!craftingList.some(e => !e.crafted) && craftingList.length === 0" class="empty-state">
              <p class="empty-text" v-translate="'crafting_list_empty'"></p>
              <button class="btn-primary" @click="navigateToSearch" v-translate="'search_items_button'"></button>
            </div>

            <div v-else-if="!craftingList.some(e => !e.crafted) && craftingList.length > 0" class="empty-state">
              <p class="all-crafted-text" v-translate="'all_items_crafted'"></p>
              <div class="empty-actions">
                <button class="btn-secondary" @click="clearCrafted" v-translate="'clear_list'"></button>
                <button class="btn-primary" @click="navigateToSearch" v-translate="'search_more_items'"></button>
              </div>
            </div>

            <div v-else class="crafting-items">
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
        <div class="materials-column">
          <AllMaterialsInventoryList
            :requirements="requirements"
            :missing-count="missingMaterials.length"
            @update-quantity="handleUpdateQuantity"
          />

          <div v-if="loading" class="card-ornate status-card">
            <OrnateCorners />
            <p class="status-text" v-translate="'calculating_requirements'"></p>
          </div>
          <div v-if="error" class="error-card">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.page-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
.page-main {
  flex: 1;
  padding: 1.5rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text-primary);
  text-align: center;
  margin: 0 0 0.25rem;
}
.page-subtitle {
  color: var(--color-text-muted);
  text-align: center;
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
}

.success-notif {
  background: var(--color-success-bg);
  border: 1px solid var(--color-success);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--color-success);
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
}

.crafting-card {
  padding: 1.25rem 1.5rem;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-accent);
  margin: 0;
}
.btn-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.empty-text { color: var(--color-text-muted); }
.all-crafted-text { color: var(--color-success); font-weight: 600; }
.empty-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }

.crafting-items { display: flex; flex-direction: column; gap: 1rem; }

.materials-column { display: flex; flex-direction: column; gap: 1rem; }

.status-card { padding: 1rem; }
.status-text { color: var(--color-text-muted); text-align: center; font-size: 0.875rem; margin: 0; }

.error-card {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--color-error);
  font-size: 0.875rem;
}
</style>
