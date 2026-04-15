<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuicksearch } from '../../composables/useQuicksearch'
import ItemSprite from '../atoms/ItemSprite.vue'
import StarFavorite from '../atoms/StarFavorite.vue'

const {
  query,
  results,
  isOpen,
  isLoading,
  selectedIndex,
  handleInput,
  closeDropdown,
  clearSearch,
  moveSelection,
  getSelectedItem
} = useQuicksearch()

const inputRef = ref<HTMLInputElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)

function onInput(e: Event): void {
  handleInput((e.target as HTMLInputElement).value)
}

function onKeydown(e: KeyboardEvent): void {
  if (!isOpen.value) return
  if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1) }
  if (e.key === 'Escape') { closeDropdown(); inputRef.value?.blur() }
  if (e.key === 'Enter') {
    const item = getSelectedItem()
    if (item) selectItem(item)
  }
}

function selectItem(item: { id: number; name: string; type: number; pod: number; level: number }): void {
  ;(window as any).navigateToItemSearch?.(item)
  clearSearch()
  inputRef.value?.blur()
}

function goToSearch(): void {
  ;(window as any).navigateTo?.('items')
  clearSearch()
}

function onDocumentClick(e: MouseEvent): void {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="wrapperRef" class="qs-wrapper">
    <input
      ref="inputRef"
      class="qs-input input-search"
      type="text"
      :value="query"
      placeholder="Rechercher un objet..."
      @input="onInput"
      @keydown="onKeydown"
    />

    <div v-if="isOpen" class="qs-dropdown">
      <div v-if="isLoading" class="qs-loading">
        <span>…</span>
      </div>

      <template v-else-if="results.length > 0">
        <button
          v-for="(item, idx) in results"
          :key="item.id"
          class="qs-row"
          :class="{ 'qs-row--active': idx === selectedIndex }"
          @click="selectItem(item)"
        >
          <div class="qs-sprite">
            <ItemSprite :category="item.type" :sprite="(item as any).gfxId ?? 1" :size="28" />
          </div>
          <div class="qs-info">
            <span class="qs-name">{{ item.name }}</span>
            <span class="qs-meta">Niv. {{ item.level }}</span>
          </div>
          <StarFavorite :item-id="item.id" />
        </button>

        <button class="qs-see-all" @click="goToSearch" v-translate="'quicksearch_see_all'"></button>
      </template>

      <div v-else class="qs-empty" v-translate="'quicksearch_no_results'"></div>
    </div>
  </div>
</template>

<style scoped>
.qs-wrapper {
  position: relative;
}

.qs-input {
  width: 220px;
}

.qs-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 420px;
  max-width: 90vw;
  background: var(--color-bg-nav-top);
  border: 1px solid var(--color-border-accent);
  border-radius: 8px;
  z-index: 300;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.qs-loading,
.qs-empty {
  padding: 0.75rem 1rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  text-align: center;
}

.qs-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-border-accent);
  cursor: pointer;
  transition: background-color 0.1s;
  text-align: left;
}
.qs-row:last-of-type {
  border-bottom: none;
}
.qs-row:hover,
.qs-row--active {
  background: rgba(212, 168, 92, 0.1);
}

.qs-sprite {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--color-bg-elevated);
  overflow: hidden;
}

.qs-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.qs-name {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-text-nav-active);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.qs-meta {
  font-size: 0.75rem;
  color: var(--color-text-nav);
}

.qs-see-all {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: rgba(212, 168, 92, 0.06);
  border: none;
  border-top: 1px solid var(--color-border-accent);
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
}
.qs-see-all:hover {
  background: rgba(212, 168, 92, 0.12);
}
</style>
