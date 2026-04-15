<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Item } from '../../entities/Item'
import type { Craft } from '../../entities/Craft'
import { searchItems, getCraftDetails } from '../../services/itemService'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import ItemSprite from '../atoms/ItemSprite.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'
import StarFavorite from '../atoms/StarFavorite.vue'
import ItemStatsList from '../molecules/ItemStatsList.vue'
import CraftDetails from '../molecules/CraftDetails.vue'
import { useCraftingList } from '../../composables/useCraftingList'
import QuantityInput from '../atoms/QuantityInput.vue'

const props = defineProps<{
  initialItem?: Item | null
}>()

const searchQuery = ref('')
const filterMinLevel = ref<number | ''>('')
const filterMaxLevel = ref<number | ''>('')

const items = ref<Item[]>([])
const isSearching = ref(false)
const hasSearched = ref(false)

const selectedItem = ref<Item | null>(props.initialItem ?? null)
const craftQuantity = ref(1)
const justAdded = ref(false)

const craft = ref<Craft | null>(null)
const craftLoading = ref(false)
const craftError = ref<string | null>(null)

const { addItem, craftingList } = useCraftingList()

const isInList = (itemId: number) => craftingList.value.some(e => e.item.id === itemId)

async function doSearch(): Promise<void> {
  if (searchQuery.value.length < 2 && filterMinLevel.value === '') {
    return
  }
  isSearching.value = true
  hasSearched.value = true
  try {
    const results = await searchItems(searchQuery.value)
    items.value = results.filter(item => {
      if (filterMinLevel.value !== '' && item.level < filterMinLevel.value) return false
      if (filterMaxLevel.value !== '' && item.level > filterMaxLevel.value) return false
      return true
    })
  } catch {
    items.value = []
  } finally {
    isSearching.value = false
  }
}

async function loadCraft(itemId: number): Promise<void> {
  craftLoading.value = true
  craftError.value = null
  craft.value = null
  try {
    craft.value = await getCraftDetails(itemId)
  } catch (err) {
    craftError.value = err instanceof Error ? err.message : 'Erreur lors du chargement'
  } finally {
    craftLoading.value = false
  }
}

function selectItem(item: Item): void {
  selectedItem.value = item
  craftQuantity.value = 1
  justAdded.value = false
}

function addToList(): void {
  if (!selectedItem.value) return
  addItem(selectedItem.value, craftQuantity.value)
  justAdded.value = true
  setTimeout(() => { justAdded.value = false }, 2000)
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') doSearch()
}

watch(selectedItem, (item) => {
  if (item) loadCraft(item.id)
})

onMounted(() => {
  if (props.initialItem) {
    doSearch()
    loadCraft(props.initialItem.id)
  }
})
</script>

<template>
  <div class="page-wrapper">
    <Header />
    <main class="search-main">
      <div class="search-layout">

        <!-- ── Panneau gauche : filtres + liste ── -->
        <aside class="search-panel">
          <h1 class="panel-title" v-translate="'items_page_title'"></h1>

          <!-- Filtres -->
          <div class="filters">
            <input
              class="input-field"
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher un objet..."
              @keydown="handleKeydown"
            />
            <div class="filter-row">
              <input
                class="input-field filter-level"
                type="number"
                v-model.number="filterMinLevel"
                placeholder="Niv. min"
              />
              <input
                class="input-field filter-level"
                type="number"
                v-model.number="filterMaxLevel"
                placeholder="Niv. max"
              />
            </div>
            <button class="btn-primary search-btn" @click="doSearch" v-translate="'search_button'"></button>
          </div>

          <!-- Résultats -->
          <div class="results-list">
            <p v-if="isSearching" class="list-status" v-translate="'searching_label'"></p>
            <p v-else-if="hasSearched && items.length === 0" class="list-status" v-translate="'no_items_found'"></p>
            <p v-else-if="!hasSearched" class="list-status list-status--hint">
              Utilisez la recherche pour trouver des objets.
            </p>
            <ul v-else class="items-list">
              <li
                v-for="item in items"
                :key="item.id"
                class="item-row"
                :class="{ 'item-row--active': selectedItem?.id === item.id }"
                @click="selectItem(item)"
              >
                <div class="item-row-sprite">
                  <ItemSprite :category="item.sprite?.category" :sprite="item.sprite?.sprite" :size="28" />
                </div>
                <div class="item-row-info">
                  <span class="item-row-name">{{ item.name }}</span>
                  <span class="item-row-meta">Niv. {{ item.level }}</span>
                </div>
                <StarFavorite :item-id="item.id" />
              </li>
            </ul>
          </div>
        </aside>

        <!-- ── Panneau droit : détail ── -->
        <section class="detail-panel">
          <div v-if="!selectedItem" class="detail-empty">
            <div class="detail-empty-icon">🗡</div>
            <p class="detail-empty-text" v-translate="'detail_placeholder'"></p>
            <p class="detail-empty-sub" v-translate="'detail_placeholder_sub'"></p>
          </div>

          <div v-else class="detail-content card-ornate">
            <OrnateCorners />
            <div class="detail-header">
              <div class="detail-sprite">
                <ItemSprite :category="selectedItem.sprite?.category" :sprite="selectedItem.sprite?.sprite" :size="64" />
              </div>
              <div class="detail-meta">
                <h2 class="detail-name">{{ selectedItem.name }}</h2>
                <span class="detail-level">
                  <span v-translate="'label_level'"></span> {{ selectedItem.level }}
                  · {{ selectedItem.pod }} <span v-translate="'label_pods'"></span>
                </span>
              </div>
              <StarFavorite :item-id="selectedItem.id" />
            </div>

            <ItemStatsList :stats="selectedItem.stats" />
            <CraftDetails :craft="craft" :loading="craftLoading" :error="craftError" />

            <div class="detail-actions">
              <QuantityInput v-model="craftQuantity" :min="1" :max="99" />
              <button
                v-if="!justAdded"
                class="btn-primary"
                @click="addToList"
                v-translate="isInList(selectedItem.id) ? 'in_list_label' : 'add_to_list'"
              ></button>
              <span v-else class="added-confirmation" v-translate="'added_to_list'"></span>
            </div>
          </div>
        </section>

      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.search-main {
  flex: 1;
  padding: 1.5rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.search-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 900px) {
  .search-layout { grid-template-columns: 1fr; }
}

/* Panneau gauche */
.search-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 110px);
  overflow: hidden;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.filter-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.filter-level {
  font-size: 0.8rem;
}
.search-btn {
  width: 100%;
}

.results-list {
  overflow-y: auto;
  flex: 1;
}
.list-status {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  padding: 0.5rem 0;
}
.list-status--hint {
  font-style: italic;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.item-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}
.item-row:hover {
  border-color: var(--color-accent);
}
.item-row--active {
  border-color: var(--color-border-accent);
  background: var(--color-bg-elevated);
}
.item-row-sprite {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  background: var(--color-bg-elevated);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.item-row-name {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-row-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Panneau droit */
.detail-panel {
  min-width: 0;
}
.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
}
.detail-empty-icon { font-size: 3rem; opacity: 0.3; }
.detail-empty-text { font-weight: 700; font-size: 1rem; }
.detail-empty-sub { font-size: 0.85rem; }

.detail-content {
  padding: 1.5rem;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--color-border);
}
.detail-sprite {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background: var(--color-bg-elevated);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-meta {
  flex: 1;
}
.detail-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
}
.detail-level {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--color-border);
}
.added-confirmation {
  color: var(--color-success);
  font-weight: 700;
  font-size: 0.875rem;
}
</style>
