import type { Statistics } from './Statistics'

export interface Item {
  id: number
  name: string
  type: number
  pod: number
  level: number
  stats?: Statistics
  sprite?: {
    category: number
    sprite: number
  }
}
