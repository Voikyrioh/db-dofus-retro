# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript + Vite application named "dofus-retro-db". The project is a crafting and resource management tool for the game "Dofus Retro".

### Purpose
The application helps players manage their crafting objectives by:
- Tracking items they already own
- Planning items they want to craft
- Generating optimized lists of materials to gather and monsters to farm

### Key Features
- **Database**: Items and monsters with descriptions, properties, and drop tables
- **Admin Interface** (v1): Create and manage item recipes, items, and monsters
- **User Interface** (v1): Mark owned items, set crafting goals, and receive a generated farming/gathering plan

The project uses Vue 3's Composition API with `<script setup>` syntax in Single File Components (SFCs).

## Dofus Retro Game Context

### Game Overview
Dofus Retro is a tactical MMORPG set in the World of Twelve. This application focuses on helping players manage their crafting objectives and resource gathering efficiently.

### Core Terminology
- **Kamas**: The in-game currency used for trading and purchasing items
- **Pods**: Carrying capacity (inventory weight limit). Increased by Strength stat (+5 pods per point) and profession levels (+5 pods per level, +1000 bonus at level 100)
- **Prospecting**: A stat that affects drop rates from monsters
- **Sets**: Equipment collections that provide bonus stats when worn together
- **Resources**: Raw materials gathered from the environment or dropped by monsters
- **Recipes**: Crafting formulas that combine ingredients to create items

### Item System
Items are organized into four main categories:
- **Equipment**: Wearable items including weapons and armor
  - Weapon types: Axe, Bow, Dagger, Hammer, Lance, Pickaxe, Scythe, Shovel, Staff, Sword, Wand, Tool
  - Armor slots: Hat, Cloak, Backpack, Ring, Amulet, Boots, Belt, Shield
- **Resources**: Gathered or crafted materials used in recipes
- **Consumables**: Items that can be used/consumed (food, potions, etc.)
- **Quest Items**: Special items related to quests

### Crafting Mechanics
**Recipe Progression:**
- Level 1: Recipes can have up to 2 ingredient slots
- Level 10: 3 ingredient slots
- Level 20: 4 ingredient slots
- Every 20 levels after: +1 ingredient slot (max 8 slots at level 100)

**Success Rates:**
- Regular crafting: Starts at 50%, increases linearly to 99% at level 100
- Specialization crafting: Starts at 5%, increases linearly to 94% at level 100
- 1-4 slot recipes: 100% success rate for craftsmen

**Recipe Color Coding:**
- Green: Gives experience + 100% success rate
- Red: Gives experience + normal success rate
- Grey: No experience + 100% success rate

**Hidden Recipes:**
Some recipes don't appear in the crafter's recipe list. These are discovered through NPC hints and experimentation.

### Professions
**Gathering Professions** (collect resources):
- Alchemist (plants/flowers)
- Farmer (crops)
- Fisherman (fish)
- Hunter (animal resources)
- Lumberjack (wood)
- Miner (ores/minerals)

**Crafting Professions** (create items):
- Food Producers: Baker, Butcher, Fishmonger
- Equipment Producers: Jeweller, Shoemaker, Tailor, Shield Smith, Handyman

Most players pair a gathering profession with a complementary crafting profession (e.g., Lumberjack + Bow Carver).

### Drop System
Monsters drop items based on three key values:

**Drop Rate**: Base probability of an item dropping. Can be improved by prospecting.

**Prospecting Lock**: Minimum prospecting required for a drop to be possible. If the team's total prospecting doesn't meet this threshold, the item cannot drop regardless of drop rate.

**Drop Limit**: Maximum quantity of a specific item that can drop from a single monster (e.g., a monster with 2 horns might have a drop limit of 2 horns).

Each player in a team gets an individual drop roll for each item, unless the prospecting lock isn't met. Drops are received if the roll succeeds and the drop limit hasn't been reached.

## Development Commands

- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build` (runs type checking with vue-tsc then builds with Vite)
- **Preview production build**: `npm run preview`

## Architecture

### Tech Stack
- **Framework**: Vue 3.5+ with TypeScript
- **Build Tool**: Vite 8.0 (beta)
- **Type Checking**: vue-tsc 3.1+
- **TypeScript**: 5.9.3

### Project Structure
- `src/main.ts` - Application entry point, mounts the root App component
- `src/App.vue` - Root component
- `src/components/` - Vue components directory organized by Atomic Design principles:
  - `atoms/` - Basic UI elements (buttons, inputs, cards, etc.)
  - `molecules/` - Complex multi-part components (forms, modals, headers, etc.)
  - `pages/` - Complete pages composed only of molecules, atoms, and text
- `src/entities/` - TypeScript interfaces for data models
- `src/services/` - API service layer for backend communication
- `src/composables/` - Reusable composition functions for state management and logic
- `src/constants/` - Application constants (API URLs, configuration values, etc.)
- `src/assets/` - Static assets
- `src/style.css` - Global styles
- `public/` - Public static assets served as-is

### TypeScript Configuration
The project uses a split TypeScript configuration:
- `tsconfig.json` - Root config that references app and node configs
- `tsconfig.app.json` - App source code config with strict type checking enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, `erasableSyntaxOnly`)
- `tsconfig.node.json` - Vite config file type checking

### Vue Component Patterns
Components use `<script setup lang="ts">` syntax with:
- Composition API
- `defineProps<Type>()` for type-safe props
- `ref()` for reactive state

### Entities Pattern
Entities are TypeScript interfaces that define the shape of data models. They should be:
- Stored in `src/entities/` directory
- Named with PascalCase (e.g., `Item.ts`, `Monster.ts`, `Recipe.ts`)
- Exported as named exports using the `interface` keyword
- Used for type safety across components and services

**Example:**
```typescript
// src/entities/Item.ts
export interface Item {
  id: number
  name: string
  type: number
  pod: number
  level: number
}
```

### Services Pattern
Services handle API communication and business logic. They should:
- Be stored in `src/services/` directory
- Named with camelCase followed by "Service" (e.g., `itemService.ts`, `monsterService.ts`)
- Export async functions that return typed data using entities
- Use the fetch API for HTTP requests
- Import API base URL from `src/constants/api.ts`
- Handle errors appropriately and throw meaningful error messages
- Use `encodeURIComponent()` for query parameters

**Example:**
```typescript
// src/services/itemService.ts
import { API_BASE_URL } from '../constants/api'
import type { Item } from '../entities/Item'

export async function searchItems(searchText: string): Promise<Item[]> {
  const response = await fetch(`${API_BASE_URL}/items/search?search=${encodeURIComponent(searchText)}`)

  if (!response.ok) {
    throw new Error(`Failed to search items: ${response.statusText}`)
  }

  return response.json()
}
```

### Composables Pattern
Composables are reusable composition functions that encapsulate reactive state and logic. They should:
- Be stored in `src/composables/` directory
- Named with `use` prefix in camelCase (e.g., `useCraftingList.ts`, `useInventory.ts`)
- Export a function that returns reactive state and methods
- Use `ref()` and `watch()` for reactive state management
- Implement localStorage persistence when needed for client-side data storage
- Share state across components using module-level reactive variables

**Example:**
```typescript
// src/composables/useCraftingList.ts
import { ref, watch } from 'vue'
import type { CraftingListItem } from '../entities/CraftingListItem'
import type { Item } from '../entities/Item'

const STORAGE_KEY = 'dofus-crafting-list'

// Module-level state (shared across all component instances)
const craftingList = ref<CraftingListItem[]>([])

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      craftingList.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(craftingList.value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function useCraftingList() {
  // Initialize on first use
  if (craftingList.value.length === 0) {
    loadFromStorage()
  }

  // Auto-save on changes
  watch(craftingList, saveToStorage, { deep: true })

  function addItem(item: Item, quantity: number = 1) {
    const existing = craftingList.value.find(entry => entry.item.id === item.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      craftingList.value.push({ item, quantity })
    }
  }

  function removeItem(itemId: number) {
    craftingList.value = craftingList.value.filter(entry => entry.item.id !== itemId)
  }

  return {
    craftingList,
    addItem,
    removeItem
  }
}
```

**LocalStorage Keys:**
- `dofus-crafting-list` - User's crafting list (items to craft with quantities)
- `dofus-inventory` - User's inventory (owned items with quantities)

## API Endpoints

The backend API is available at `http://localhost:3000` (configurable in `src/constants/api.ts`).

### Items
- **Search Items**: `GET /items/search?search=<search_text>`
  - Returns: `Item[]`
  - Item interface: `{ id: number, name: string, type: number, pod: number, level: number }`

### Crafts
- **Get Craft Details**: `GET /crafts/:item_id`
  - Returns: `Craft` (array of craft ingredients) or `404` if item/craft doesn't exist
  - Craft type: `Array<{ item: Item, quantity: number }>`
  - CraftIngredient interface: `{ item: Item, quantity: number }`
  - Returns empty array or null if the item cannot be crafted
  - Note: 404 responses should be handled gracefully (item may not have a craft recipe)

## Important Notes

- This project uses Vite 8.0 beta (specified in overrides)
- TypeScript strict mode is enabled with additional linting rules
- All source files must pass type checking before build succeeds
