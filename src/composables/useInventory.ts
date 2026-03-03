import { ref, watch } from 'vue'
import type { InventoryItem } from '../entities/InventoryItem'
import type { Item } from '../entities/Item'

const STORAGE_KEY = 'dofus-inventory'

const inventory = ref<InventoryItem[]>([])

// Load from localStorage on initialization
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      inventory.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load inventory from localStorage:', error)
  }
}

// Save to localStorage whenever the inventory changes
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory.value))
  } catch (error) {
    console.error('Failed to save inventory to localStorage:', error)
  }
}

export function useInventory() {
  // Initialize on first use
  if (inventory.value.length === 0) {
    loadFromStorage()
  }

  // Watch for changes and auto-save
  watch(inventory, saveToStorage, { deep: true })

  function addItem(item: Item, quantity: number = 1) {
    const existingIndex = inventory.value.findIndex(entry => entry.item.id === item.id)

    if (existingIndex !== -1) {
      // Update quantity if item already exists
      inventory.value[existingIndex].quantity += quantity
    } else {
      // Add new item
      inventory.value.push({ item, quantity })
    }
  }

  function removeItem(itemId: number) {
    inventory.value = inventory.value.filter(entry => entry.item.id !== itemId)
  }

  function updateQuantity(itemId: number, quantity: number) {
    const entry = inventory.value.find(entry => entry.item.id === itemId)
    if (entry) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        removeItem(itemId)
      } else {
        entry.quantity = quantity
      }
    }
  }

  function setQuantity(item: Item, quantity: number) {
    if (quantity <= 0) {
      removeItem(item.id)
      return
    }

    const existingIndex = inventory.value.findIndex(entry => entry.item.id === item.id)
    if (existingIndex !== -1) {
      inventory.value[existingIndex].quantity = quantity
    } else {
      inventory.value.push({ item, quantity })
    }
  }

  function clearInventory() {
    inventory.value = []
  }

  function getQuantity(itemId: number): number {
    const entry = inventory.value.find(entry => entry.item.id === itemId)
    return entry?.quantity ?? 0
  }

  function deductMaterials(materials: Array<{ itemId: number, quantity: number }>) {
    for (const material of materials) {
      const entry = inventory.value.find(inv => inv.item.id === material.itemId)
      if (entry) {
        const newQuantity = entry.quantity - material.quantity
        if (newQuantity <= 0) {
          removeItem(material.itemId)
        } else {
          entry.quantity = newQuantity
        }
      }
    }
  }

  return {
    inventory,
    addItem,
    removeItem,
    updateQuantity,
    setQuantity,
    clearInventory,
    getQuantity,
    deductMaterials
  }
}
