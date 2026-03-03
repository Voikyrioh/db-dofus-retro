import { ref, computed, watch, type Ref } from 'vue'
import type { MaterialRequirement } from '../entities/MaterialRequirement'
import type { Item } from '../entities/Item'
import type { CraftingListItem } from '../entities/CraftingListItem'
import type { InventoryItem } from '../entities/InventoryItem'
import { getCraftDetails } from '../services/itemService'

export function useMaterialCalculator(
  craftingListRef: Ref<CraftingListItem[]>,
  inventoryRef: Ref<InventoryItem[]>
) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const requirements = ref<MaterialRequirement[]>([])

  async function calculateRequirements() {
    const craftingList = craftingListRef.value
    const inventory = inventoryRef.value

    if (craftingList.length === 0) {
      requirements.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      // Map to store aggregated material needs { itemId: { item: Item, quantity: number } }
      const materialMap = new Map<number, { item: Item, quantity: number }>()

      // Fetch craft details for all items in the crafting list
      for (const listItem of craftingList) {
        const craft = await getCraftDetails(listItem.item.id)

        if (craft && craft.length > 0) {
          // Aggregate ingredients
          for (const ingredient of craft) {
            const totalNeeded = ingredient.quantity * listItem.quantity

            if (materialMap.has(ingredient.item.id)) {
              const existing = materialMap.get(ingredient.item.id)!
              existing.quantity += totalNeeded
            } else {
              materialMap.set(ingredient.item.id, {
                item: ingredient.item,
                quantity: totalNeeded
              })
            }
          }
        }
      }

      // Convert to MaterialRequirement array with owned/missing calculations
      const inventoryMap = new Map(
        inventory.map(inv => [inv.item.id, inv.quantity])
      )

      requirements.value = Array.from(materialMap.values()).map(material => {
        const owned = inventoryMap.get(material.item.id) ?? 0
        const missing = Math.max(0, material.quantity - owned)

        return {
          item: material.item,
          needed: material.quantity,
          owned,
          missing
        }
      })

      // Sort by missing quantity (descending) to show what's most needed first
      requirements.value.sort((a, b) => b.missing - a.missing)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to calculate material requirements'
      requirements.value = []
    } finally {
      loading.value = false
    }
  }

  // Auto-recalculate when crafting list or inventory changes
  watch([craftingListRef, inventoryRef], () => {
    calculateRequirements()
  }, { deep: true })

  // Computed property to get only missing materials
  const missingMaterials = computed(() =>
    requirements.value.filter(req => req.missing > 0)
  )

  // Computed property to get materials that are fully owned
  const completeMaterials = computed(() =>
    requirements.value.filter(req => req.missing === 0)
  )

  return {
    requirements,
    missingMaterials,
    completeMaterials,
    loading,
    error,
    calculateRequirements
  }
}
