import type { Item } from './Item'

export interface CraftIngredient {
  item: Item
  quantity: number
}

export type Craft = CraftIngredient[]

export interface CraftListing {
  item: Item
  recipe: CraftIngredient[]
}
