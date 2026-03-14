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

  // Aggregated totals from craft recipes — rebuilt only when the crafting list changes
  const materialNeeds = ref<Map<number, { item: Item, quantity: number }>>(new Map())

  // Requirements are computed synchronously from materialNeeds + current inventory,
  // so updating owned quantities is instant without any API call
  const requirements = computed<MaterialRequirement[]>(() => {
    const inventoryMap = new Map(inventoryRef.value.map(inv => [inv.item.id, inv.quantity]))

    const result = Array.from(materialNeeds.value.values()).map(material => {
      const owned = inventoryMap.get(material.item.id) ?? 0
      const missing = Math.max(0, material.quantity - owned)
      return { item: material.item, needed: material.quantity, owned, missing }
    })

    // Sort: incomplete materials first (by level), then complete materials (by level)
    return result.sort((a, b) => {
      const aMissing = a.missing > 0 ? 0 : 1
      const bMissing = b.missing > 0 ? 0 : 1
      if (aMissing !== bMissing) return aMissing - bMissing
      return a.item.level - b.item.level
    })
  })

  async function calculateRequirements() {
    const craftingList = craftingListRef.value

    if (craftingList.length === 0) {
      materialNeeds.value = new Map()
      return
    }

    loading.value = true
    error.value = null

    try {
      const newMap = new Map<number, { item: Item, quantity: number }>()

      for (const listItem of craftingList) {
        if (listItem.crafted) continue

        const craft = (listItem.recipe && listItem.recipe.length > 0)
          ? listItem.recipe
          : await getCraftDetails(listItem.item.id)

        if (craft && craft.length > 0) {
          for (const ingredient of craft) {
            const totalNeeded = ingredient.quantity * listItem.quantity
            const existing = newMap.get(ingredient.item.id)
            if (existing) {
              existing.quantity += totalNeeded
            } else {
              newMap.set(ingredient.item.id, { item: ingredient.item, quantity: totalNeeded })
            }
          }
        }
      }

      materialNeeds.value = newMap
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to calculate material requirements'
      materialNeeds.value = new Map()
    } finally {
      loading.value = false
    }
  }

  // Only re-fetch craft details when the crafting list changes
  watch(craftingListRef, () => {
    calculateRequirements()
  }, { deep: true })

  const missingMaterials = computed(() => requirements.value.filter(req => req.missing > 0))
  const completeMaterials = computed(() => requirements.value.filter(req => req.missing === 0))

  return {
    requirements,
    missingMaterials,
    completeMaterials,
    loading,
    error,
    calculateRequirements
  }
}
