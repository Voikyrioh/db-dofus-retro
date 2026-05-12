import { ref, watch } from 'vue'

const STORAGE_KEY = 'dofus-favorites'

const favoriteIds = ref<number[]>([])

function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      favoriteIds.value = JSON.parse(stored) as number[]
    }
  } catch {
    favoriteIds.value = []
  }
}

loadFromStorage()

export function useFavorites() {
  watch(favoriteIds, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function isFavorite(itemId: number): boolean {
    return favoriteIds.value.includes(itemId)
  }

  function toggleFavorite(itemId: number): void {
    const idx = favoriteIds.value.indexOf(itemId)
    if (idx === -1) {
      favoriteIds.value.push(itemId)
    } else {
      favoriteIds.value.splice(idx, 1)
    }
  }

  return { favoriteIds, isFavorite, toggleFavorite }
}
