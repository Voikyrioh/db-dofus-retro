import { ref, watch } from 'vue'
import type { CraftingListItem } from '../entities/CraftingListItem'
import type { Item } from '../entities/Item'

const STORAGE_KEY = 'dofus-crafting-list'

const craftingList = ref<CraftingListItem[]>([])

// Load from localStorage on initialization
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      craftingList.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load crafting list from localStorage:', error)
  }
}

// Save to localStorage whenever the list changes
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(craftingList.value))
  } catch (error) {
    console.error('Failed to save crafting list to localStorage:', error)
  }
}

export function useCraftingList() {
  // Initialize on first use
  if (craftingList.value.length === 0) {
    loadFromStorage()
  }

  // Watch for changes and auto-save
  watch(craftingList, saveToStorage, { deep: true })

  function addItem(item: Item, quantity: number = 1) {
    const existingIndex = craftingList.value.findIndex(entry => entry.item.id === item.id)

    if (existingIndex !== -1) {
      // Update quantity if item already exists
      craftingList.value[existingIndex].quantity += quantity
    } else {
      // Add new item
      craftingList.value.push({ item, quantity })
    }
  }

  function removeItem(itemId: number) {
    craftingList.value = craftingList.value.filter(entry => entry.item.id !== itemId)
  }

  function updateQuantity(itemId: number, quantity: number) {
    const entry = craftingList.value.find(entry => entry.item.id === itemId)
    if (entry) {
      entry.quantity = Math.max(1, quantity) // Ensure at least 1
    }
  }

  function clearList() {
    craftingList.value = []
  }

  function isInList(itemId: number): boolean {
    return craftingList.value.some(entry => entry.item.id === itemId)
  }

  function getQuantity(itemId: number): number {
    const entry = craftingList.value.find(entry => entry.item.id === itemId)
    return entry?.quantity ?? 0
  }

  function craftItem(itemId: number) {
    const entry = craftingList.value.find(entry => entry.item.id === itemId)
    if (entry) {
      if (entry.quantity <= 1) {
        // Remove item if quantity reaches 0
        removeItem(itemId)
      } else {
        // Decrease quantity by 1
        entry.quantity -= 1
      }
    }
  }

  return {
    craftingList,
    addItem,
    removeItem,
    updateQuantity,
    clearList,
    isInList,
    getQuantity,
    craftItem
  }
}
