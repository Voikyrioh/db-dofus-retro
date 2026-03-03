# Dofus Retro DB

A crafting and resource management tool for the game Dofus Retro, built with Vue 3, TypeScript, and Vite.

## Features

### 🔍 Item Search
- Search through the Dofus Retro item database
- View detailed item information (type, level, weight)
- See crafting recipes with required ingredients
- Add items directly to your crafting list

### 📋 Crafting List Management
- Create and manage a list of items you want to craft
- Track quantities for each item
- Visual "Can Craft" indicators when you have all materials
- One-click crafting that automatically deducts materials
- Persistent storage in browser (localStorage)

### 📦 Inventory Tracking
- Track what materials you already own
- Quick input fields for updating quantities
- Automatic calculation of missing materials
- Priority view showing what you need most

### 🎯 Material Requirements
- Automatic aggregation of all required materials across your crafting list
- Real-time updates as you modify inventory
- Missing materials highlighted with quantities needed
- Quick +1 buttons for easy inventory updates

## Tech Stack

- **Vue 3.5+** - Progressive JavaScript framework
- **TypeScript 5.9** - Type-safe development
- **Vite 8.0** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Composition API** - Modern Vue patterns with `<script setup>`
- **localStorage** - Client-side data persistence

## Project Structure

```
src/
├── components/          # Vue components (Atomic Design)
│   ├── atoms/          # Basic UI elements
│   ├── molecules/      # Composite components
│   └── pages/          # Full page components
├── composables/        # Reusable composition functions
├── entities/           # TypeScript interfaces
├── services/           # API service layer
├── constants/          # App constants
└── assets/            # Static assets
```

## Development

### Prerequisites
- Node.js 18+ recommended
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Requirements

The application expects a backend API running at `http://localhost:3000` with the following endpoints:

- `GET /items/search?search=<query>` - Search for items
- `GET /crafts/:item_id` - Get crafting recipe for an item

See `CLAUDE.md` for detailed API documentation and data structures.

## Browser Storage

The app uses localStorage to persist:
- **Crafting List** (`dofus-crafting-list`) - Items you want to craft
- **Inventory** (`dofus-inventory`) - Items you own

Clear your browser's localStorage to reset all data.

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
