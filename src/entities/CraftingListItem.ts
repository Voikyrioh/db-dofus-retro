import type { Item } from './Item'
import type { CraftIngredient } from './Craft'

export interface CraftingListItem {
  item: Item
  quantity: number
  crafted?: boolean
  recipe?: CraftIngredient[]
}
