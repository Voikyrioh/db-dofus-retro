<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { CraftListing } from '../../entities/Craft'
import { getCraftList } from '../../services/itemService'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'
import StarFavorite from '../atoms/StarFavorite.vue'
import CraftDetails from '../molecules/CraftDetails.vue'
import ItemSprite from '../atoms/ItemSprite.vue'
import ItemStatsList from '../molecules/ItemStatsList.vue'
import { useCraftingList } from '../../composables/useCraftingList'
import QuantityInput from '../atoms/QuantityInput.vue'
import SkeletonBlock from '../atoms/SkeletonBlock.vue'

const PAGE_SIZE = 10
const entries = ref<CraftListing[]>([])
const isLoading = ref(false)
const hasMore = ref(true)
const page = ref(0)
const loadError = ref<string | null>(null)

const selectedEntry = ref<CraftListing | null>(null)
const craftQuantity = ref(1)
const justAdded = ref(false)

const { addItem, craftingList } = useCraftingList()
const isInList = (id: number) => craftingList.value.some(e => e.item.id === id)

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function loadMore(): Promise<void> {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  loadError.value = null
  try {
    page.value++
    const result = await getCraftList(page.value, PAGE_SIZE)
    entries.value.push(...result)
    if (result.length < PAGE_SIZE) hasMore.value = false
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Erreur de chargement'
    page.value--
  } finally {
    isLoading.value = false
  }
  if (hasMore.value && sentinelRef.value) {
    const { top } = sentinelRef.value.getBoundingClientRect()
    if (top < window.innerHeight) loadMore()
  }
}

function selectEntry(entry: CraftListing): void {
  selectedEntry.value = entry
  craftQuantity.value = 1
  justAdded.value = false
}

function addToList(): void {
  if (!selectedEntry.value) return
  addItem(selectedEntry.value.item, craftQuantity.value)
  justAdded.value = true
  setTimeout(() => { justAdded.value = false }, 2000)
}

onMounted(() => {
  loadMore()
  observer = new IntersectionObserver((obs) => {
    if (obs[0]?.isIntersecting) loadMore()
  })
  if (sentinelRef.value) observer.observe(sentinelRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="page-wrapper">
    <Header />
    <main class="craft-main">
      <div class="craft-layout">

        <!-- Panneau gauche -->
        <aside class="craft-panel">
          <h1 class="panel-title" v-translate="'crafts_page_title'"></h1>
          <p class="panel-sub" v-translate="'crafts_page_subtitle'"></p>

          <!-- Skeleton liste pendant le chargement initial -->
          <div v-if="isLoading && entries.length === 0" class="skeleton-list">
            <div v-for="n in 7" :key="n" class="skeleton-row">
              <SkeletonBlock width="28px" height="28px" />
              <div class="skeleton-row-info">
                <SkeletonBlock height="0.8rem" width="70%" />
                <SkeletonBlock height="0.65rem" width="40%" />
              </div>
            </div>
          </div>

          <ul v-else class="crafts-list">
            <li
              v-for="entry in entries"
              :key="entry.item.id"
              class="item-row"
              :class="{ 'item-row--active': selectedEntry?.item.id === entry.item.id }"
              @click="selectEntry(entry)"
            >
              <div class="item-row-sprite">
                <ItemSprite :category="entry.item.sprite?.category" :sprite="entry.item.sprite?.sprite" :size="28" />
              </div>
              <div class="item-row-info">
                <span class="item-row-name">{{ entry.item.name }}</span>
                <span class="item-row-meta">Niv. {{ entry.item.level }}</span>
              </div>
              <StarFavorite :item-id="entry.item.id" />
            </li>
          </ul>

          <div ref="sentinelRef" class="loader-trigger">
            <span v-if="isLoading" v-translate="'loading_crafts'"></span>
            <span v-else-if="!hasMore" v-translate="'no_more_crafts'"></span>
          </div>
          <p v-if="loadError" class="load-error">{{ loadError }}</p>
        </aside>

        <!-- Panneau droit -->
        <section class="detail-panel">
          <div v-if="!selectedEntry" class="detail-empty">
            <div class="detail-empty-icon">📜</div>
            <p class="detail-empty-text" v-translate="'detail_placeholder'"></p>
            <p class="detail-empty-sub" v-translate="'detail_placeholder_sub'"></p>
          </div>

          <div v-else class="detail-content card-ornate">
            <OrnateCorners />
            <div class="detail-header">
              <div class="detail-sprite">
                <ItemSprite :category="selectedEntry.item.sprite?.category" :sprite="selectedEntry.item.sprite?.sprite" :size="64" />
              </div>
              <div class="detail-meta">
                <h2 class="detail-name">{{ selectedEntry.item.name }}</h2>
                <span class="detail-level">
                  <span v-translate="'label_level'"></span> {{ selectedEntry.item.level }}
                </span>
              </div>
              <StarFavorite :item-id="selectedEntry.item.id" />
            </div>

            <ItemStatsList :stats="selectedEntry.item.stats" />
            <CraftDetails :craft="selectedEntry.recipe" :loading="false" :error="null" />

            <div class="detail-actions">
              <QuantityInput v-model="craftQuantity" :min="1" :max="99" />
              <button
                v-if="!justAdded"
                class="btn-primary"
                @click="addToList"
                v-translate="isInList(selectedEntry.item.id) ? 'in_list_label' : 'add_to_list'"
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
.page-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
.craft-main {
  flex: 1;
  padding: 1.5rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}
.craft-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 900px) {
  .craft-layout { grid-template-columns: 1fr; }
}

.craft-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 110px);
  overflow: hidden;
}
.panel-title { font-size: 1.25rem; font-weight: 800; color: var(--color-text-primary); margin: 0; }
.panel-sub { font-size: 0.875rem; color: var(--color-text-muted); margin: 0; }

.crafts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.item-row {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.5rem 0.75rem; border-radius: 8px;
  border: 1px solid var(--color-border); background: var(--color-bg-surface);
  cursor: pointer; transition: border-color 0.15s, background-color 0.15s;
}
.item-row:hover { border-color: var(--color-accent); }
.item-row--active { border-color: var(--color-border-accent); background: var(--color-bg-elevated); }
.item-row-sprite {
  width: 28px; height: 28px; flex-shrink: 0;
  background: var(--color-bg-elevated); border-radius: 4px;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.item-row-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.item-row-name { font-weight: 700; font-size: 0.875rem; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-row-meta { font-size: 0.75rem; color: var(--color-text-muted); }

.loader-trigger { padding: 0.75rem; text-align: center; color: var(--color-text-muted); font-size: 0.85rem; }
.load-error { color: var(--color-error); font-size: 0.875rem; padding: 0.5rem 0; }

.detail-panel { min-width: 0; }
.detail-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 400px; gap: 0.75rem;
  color: var(--color-text-muted); text-align: center;
}
.detail-empty-icon { font-size: 3rem; opacity: 0.3; }
.detail-empty-text { font-weight: 700; font-size: 1rem; }
.detail-empty-sub { font-size: 0.85rem; }

.detail-content { padding: 1.5rem; }

.detail-header {
  display: flex; align-items: flex-start; gap: 1rem;
  margin-bottom: 1.25rem; padding-bottom: 1rem;
  border-bottom: 1px dashed var(--color-border);
}
.detail-sprite {
  width: 64px; height: 64px; flex-shrink: 0;
  background: var(--color-bg-elevated); border-radius: 8px;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.detail-meta { flex: 1; }
.detail-name { font-size: 1.2rem; font-weight: 800; color: var(--color-text-primary); margin: 0 0 0.25rem; }
.detail-level { font-size: 0.875rem; color: var(--color-text-muted); }

.detail-actions {
  display: flex; align-items: center; gap: 0.75rem;
  margin-top: 1.25rem; padding-top: 1rem;
  border-top: 1px dashed var(--color-border);
}
.added-confirmation { color: var(--color-success); font-weight: 700; font-size: 0.875rem; }

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  overflow: hidden;
}
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}
.skeleton-row-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
</style>
