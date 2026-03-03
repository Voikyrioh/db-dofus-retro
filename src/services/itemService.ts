import { API_BASE_URL } from '../constants/api'
import type { Item } from '../entities/Item'
import type { Craft } from '../entities/Craft'

export async function searchItems(searchText: string): Promise<Item[]> {
  const response = await fetch(`${API_BASE_URL}/items/search?search=${encodeURIComponent(searchText)}`)

  if (!response.ok) {
    throw new Error(`Failed to search items: ${response.statusText}`)
  }

  return response.json()
}

export async function getCraftDetails(itemId: number): Promise<Craft | null> {
  const response = await fetch(`${API_BASE_URL}/crafts/${itemId}`)

  // Return null if craft doesn't exist (404)
  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to get craft details: ${response.statusText}`)
  }

  return response.json()
}
