import { ref } from 'vue'
import type { Item } from '../entities/Item'
import { searchItems } from '../services/itemService'

const query = ref('')
const results = ref<Item[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const selectedIndex = ref(-1)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

export function useQuicksearch() {
  function openDropdown(): void {
    if (results.value.length > 0 || query.value.length >= 2) {
      isOpen.value = true
    }
  }

  function closeDropdown(): void {
    isOpen.value = false
    selectedIndex.value = -1
  }

  function clearSearch(): void {
    query.value = ''
    results.value = []
    isOpen.value = false
    selectedIndex.value = -1
  }

  async function handleInput(value: string): Promise<void> {
    query.value = value
    selectedIndex.value = -1

    if (value.length < 2) {
      results.value = []
      isOpen.value = false
      return
    }

    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      isLoading.value = true
      try {
        const all = await searchItems(value)
        results.value = all.slice(0, 8)
        isOpen.value = true
      } catch {
        results.value = []
      } finally {
        isLoading.value = false
      }
    }, 250)
  }

  function moveSelection(direction: 1 | -1): void {
    const max = results.value.length - 1
    if (selectedIndex.value === -1 && direction === 1) {
      selectedIndex.value = 0
    } else {
      selectedIndex.value = Math.max(0, Math.min(max, selectedIndex.value + direction))
    }
  }

  function getSelectedItem(): Item | null {
    return results.value[selectedIndex.value] ?? null
  }

  return {
    query,
    results,
    isOpen,
    isLoading,
    selectedIndex,
    handleInput,
    openDropdown,
    closeDropdown,
    clearSearch,
    moveSelection,
    getSelectedItem
  }
}
