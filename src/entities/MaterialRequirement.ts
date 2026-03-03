import type { Item } from './Item'

export interface MaterialRequirement {
  item: Item
  needed: number
  owned: number
  missing: number
}
