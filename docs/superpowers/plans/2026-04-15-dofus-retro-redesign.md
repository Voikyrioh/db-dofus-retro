# Dofus Retro DB — Refonte Graphique Complète

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le thème dark générique (gray-900 + bleu) par une identité visuelle Dofus Retro : parchemin doré, cadres ornementaux, Nunito, double barre de navigation, dark mode brun profond, et pages de recherche en mode hybride liste+panneau.

**Architecture:** Tokens CSS custom properties définis dans `style.css` (`:root` light / `.dark` dark), consommés via `var(--color-*)` dans tous les composants. Navigation refaite en double barre sticky. `ItemSearchPage` et `CraftBrowsePage` passent en layout hybride `360px | 1fr`. Quicksearch dans le header appelle l'API existante.

**Tech Stack:** Vue 3.5 + TypeScript 5.9, Tailwind CSS v4, Nunito (Google Fonts), CSS custom properties pour theming, localStorage pour préférence de thème.

> **Contraintes connues :**
> - `v-translate` est **value-based uniquement** (`v-translate="'key'"`) — il ne supporte pas la syntaxe argument (`v-translate:placeholder`). Pour les placeholders traduits, passer la valeur en dur ou via une prop du composant.
> - L'entité `Item` (`src/entities/Item.ts`) n'expose pas `gfxId`. Les casts `(item as any).gfxId ?? 1` dans ce plan sont intentionnels et devront être remplacés quand `gfxId` sera ajouté à l'entité.
> - `useMaterialCalculator` : vérifier avant Task 7 si `missingMaterials` est exposé. Si absent, adapter HomePage à utiliser les données disponibles (`materials` filtrés sur `missing > 0`).

> **Note tests :** Ce projet n'a pas de framework de tests unitaires. La vérification se fait via `npm run build` (TypeScript 0 erreur) + `npm run dev` (inspection visuelle). Chaque tâche se termine par ces deux étapes.

---

## Fichiers créés / modifiés

| Fichier | Action | Responsabilité |
|---------|--------|----------------|
| `index.html` | Modifier | Ajouter Nunito preconnect, retirer `class="dark"` |
| `src/style.css` | Réécrire | Tous les tokens CSS, `.card-ornate`, `.btn-*`, `.input-*` |
| `public/i18n/fr-FR` | Modifier | Ajouter clés nav_database, nav_tools, quicksearch_*, home_dashboard_* |
| `public/i18n/en-US` | Modifier | Même ajouts en anglais |
| `src/composables/useTheme.ts` | Créer | Gestion dark/light + localStorage |
| `src/composables/useQuicksearch.ts` | Créer | État et logique de la recherche rapide header |
| `src/composables/useFavorites.ts` | Créer | Favoris items (localStorage) |
| `src/components/atoms/ThemeToggle.vue` | Créer | Bouton ☀/🌙 |
| `src/components/atoms/OrnateCorners.vue` | Créer | 4 coins en L dorés |
| `src/components/atoms/StarFavorite.vue` | Créer | Étoile toggle favori |
| `src/components/molecules/NavDropdown.vue` | Créer | Sous-menu navigation |
| `src/components/molecules/QuickSearchDropdown.vue` | Créer | Dropdown résultats quicksearch |
| `src/components/molecules/Header.vue` | Réécrire | Double barre + quicksearch + theme toggle |
| `src/components/molecules/Footer.vue` | Réécrire | Restyling avec tokens |
| `src/components/pages/HomePage.vue` | Réécrire | Hero (non-connecté) / Dashboard (connecté) |
| `src/components/pages/ItemSearchPage.vue` | Réécrire | Mode hybride 360px + 1fr |
| `src/components/pages/CraftBrowsePage.vue` | Réécrire | Mode hybride 360px + 1fr |
| `src/components/pages/CraftingListPage.vue` | Modifier | Restyling ornamental |
| `src/components/pages/LoginPage.vue` | Modifier | Carte centrée ornementale |
| `src/components/pages/RegisterPage.vue` | Modifier | Carte centrée ornementale |
| `src/App.vue` | Modifier | Ajouter navigateToItemSearch(item) |
| Atoms/molecules restants | Modifier | Migration vers var(--color-*) |
| `docs/superpowers/specs/2026-04-15-dofus-retro-redesign-design.md` | Créer | Spec de design |

---

## Task 1: Fondations CSS & Typographie

**Files:**
- Modify: `index.html`
- Rewrite: `src/style.css`

- [ ] **Step 1: Mettre à jour index.html**

Remplacer le contenu de `index.html` par :

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dofus Retro DB - Crafting & Resource Management</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

> Note : `class="dark"` supprimé — c'est `useTheme.ts` (Task 2) qui le gère dynamiquement.

- [ ] **Step 2: Réécrire src/style.css**

```css
@import "tailwindcss";

@layer base {
  :root {
    /* Backgrounds */
    --color-bg-base:      #f5e6c8;
    --color-bg-surface:   #ede0c0;
    --color-bg-elevated:  #e8d5a3;
    --color-bg-nav:       #3d2b0f;
    --color-bg-nav-top:   #2a1f0e;
    --color-bg-input:     #3d2b0f;

    /* Text */
    --color-text-primary:    #2a1507;
    --color-text-secondary:  #6b4c0f;
    --color-text-muted:      #8b6914;
    --color-text-nav:        #8b7040;
    --color-text-nav-active: #d4a85c;
    --color-text-on-dark:    #f5e6c8;

    /* Borders */
    --color-border:        #c9a85c;
    --color-border-accent: #8b6914;
    --color-border-corner: #d4a85c;

    /* Accent */
    --color-accent:       #d4a85c;
    --color-accent-hover: #c9975a;

    /* Status */
    --color-success:      #3a6b20;
    --color-success-bg:   rgba(58, 107, 32, 0.12);
    --color-error:        #8b1a1a;
    --color-error-bg:     rgba(139, 26, 26, 0.10);
    --color-warning:      #8b6914;
  }

  .dark {
    /* Backgrounds */
    --color-bg-base:      #1f150a;
    --color-bg-surface:   #2e1e0e;
    --color-bg-elevated:  #3d2b0f;
    --color-bg-nav:       #1a0f06;
    --color-bg-nav-top:   #120a04;
    --color-bg-input:     #2e1e0e;

    /* Text */
    --color-text-primary:    #f5e6c8;
    --color-text-secondary:  #c9a85c;
    --color-text-muted:      #8b7040;
    --color-text-nav:        #8b7040;
    --color-text-nav-active: #d4a85c;
    --color-text-on-dark:    #f5e6c8;

    /* Borders */
    --color-border:        #5a3a10;
    --color-border-accent: #8b6914;
    --color-border-corner: #d4a85c;

    /* Accent */
    --color-accent:       #d4a85c;
    --color-accent-hover: #e8b86a;

    /* Status */
    --color-success:      #5a9b38;
    --color-success-bg:   rgba(90, 155, 56, 0.15);
    --color-error:        #c04040;
    --color-error-bg:     rgba(192, 64, 64, 0.12);
    --color-warning:      #c9a85c;
  }

  body {
    background-color: var(--color-bg-base);
    color: var(--color-text-primary);
    font-family: 'Nunito', system-ui, sans-serif;
    min-height: 100vh;
    transition: background-color 0.2s, color 0.2s;
  }
}

@layer components {
  /* ── Carte ornementale ─────────────────── */
  .card-ornate {
    background: var(--color-bg-surface);
    border: 2px solid var(--color-border-accent);
    border-radius: 10px;
    box-shadow: inset 0 0 0 1px var(--color-bg-base), 0 2px 8px rgba(0, 0, 0, 0.10);
    position: relative;
    overflow: visible;
  }

  /* ── Boutons ───────────────────────────── */
  .btn-primary {
    background: var(--color-bg-nav);
    color: var(--color-text-on-dark);
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    border: 1px solid var(--color-border-accent);
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .btn-primary:hover {
    background: var(--color-border-accent);
    border-color: var(--color-accent);
  }
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-text-secondary);
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .btn-secondary:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .btn-danger {
    background: transparent;
    color: var(--color-error);
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    border: 1px solid var(--color-error);
    cursor: pointer;
    transition: background-color 0.15s;
  }
  .btn-danger:hover {
    background: var(--color-error-bg);
  }

  /* ── Inputs ────────────────────────────── */
  .input-field {
    background: var(--color-bg-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-accent);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    font-family: 'Nunito', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    width: 100%;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .input-field::placeholder {
    color: var(--color-text-muted);
  }
  .input-field:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 20%, transparent);
  }

  .input-search {
    background: var(--color-bg-input);
    color: var(--color-text-on-dark);
    border: 1px solid var(--color-border-accent);
    border-radius: 8px;
    padding: 0.35rem 0.75rem;
    font-family: 'Nunito', sans-serif;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.15s;
  }
  .input-search::placeholder {
    color: var(--color-text-nav);
  }
  .input-search:focus {
    border-color: var(--color-accent);
  }
}
```

- [ ] **Step 3: Vérifier le build TypeScript**

```bash
cd /c/Lab/dofus-retro-db && npm run build
```

Résultat attendu : `✓ built in` sans erreur TypeScript.

- [ ] **Step 4: Vérification visuelle**

```bash
npm run dev
```

Ouvrir http://localhost:5173. Le fond doit être beige (#f5e6c8), texte brun foncé, police Nunito. L'ancien thème gris-900 doit avoir disparu.

- [ ] **Step 5: Commit**

```bash
cd /c/Lab/dofus-retro-db
git add src/style.css index.html
git commit -m "feat: CSS foundations — Nunito, color tokens, card-ornate, btn/input classes"
```

---

## Task 2: Dark Mode — useTheme + ThemeToggle

**Files:**
- Create: `src/composables/useTheme.ts`
- Create: `src/components/atoms/ThemeToggle.vue`

- [ ] **Step 1: Créer src/composables/useTheme.ts**

```typescript
import { ref, watch } from 'vue'

const STORAGE_KEY = 'dofus-theme'

function getInitialDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref(getInitialDark())

function applyTheme(dark: boolean): void {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
}

// Appliquer immédiatement au chargement du module
applyTheme(isDark.value)

export function useTheme() {
  function toggleTheme(): void {
    isDark.value = !isDark.value
  }

  watch(isDark, applyTheme)

  return { isDark, toggleTheme }
}
```

- [ ] **Step 2: Créer src/components/atoms/ThemeToggle.vue**

```vue
<script setup lang="ts">
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="theme-toggle"
    :title="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
    @click="toggleTheme"
  >
    <span v-if="isDark">☀</span>
    <span v-else>🌙</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: transparent;
  border: 1px solid var(--color-border-accent);
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-text-nav);
  line-height: 1;
  transition: border-color 0.15s, color 0.15s;
}
.theme-toggle:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

Résultat attendu : 0 erreur TypeScript.

- [ ] **Step 4: Test visuel du toggle**

`npm run dev` — Tester dans la console :
```javascript
document.documentElement.classList.toggle('dark')
```
Le fond doit basculer entre `#f5e6c8` (light) et `#1f150a` (dark).

- [ ] **Step 5: Commit**

```bash
git add src/composables/useTheme.ts src/components/atoms/ThemeToggle.vue
git commit -m "feat: dark mode composable and theme toggle atom"
```

---

## Task 3: OrnateCorners + StarFavorite atoms

**Files:**
- Create: `src/components/atoms/OrnateCorners.vue`
- Create: `src/composables/useFavorites.ts`
- Create: `src/components/atoms/StarFavorite.vue`

- [ ] **Step 1: Créer src/components/atoms/OrnateCorners.vue**

```vue
<template>
  <span class="corner corner--tl" aria-hidden="true"></span>
  <span class="corner corner--tr" aria-hidden="true"></span>
  <span class="corner corner--bl" aria-hidden="true"></span>
  <span class="corner corner--br" aria-hidden="true"></span>
</template>

<style scoped>
.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  pointer-events: none;
  z-index: 1;
}
.corner--tl {
  top: 3px;
  left: 3px;
  border-top: 2px solid var(--color-border-corner);
  border-left: 2px solid var(--color-border-corner);
  border-radius: 2px 0 0 0;
}
.corner--tr {
  top: 3px;
  right: 3px;
  border-top: 2px solid var(--color-border-corner);
  border-right: 2px solid var(--color-border-corner);
  border-radius: 0 2px 0 0;
}
.corner--bl {
  bottom: 3px;
  left: 3px;
  border-bottom: 2px solid var(--color-border-corner);
  border-left: 2px solid var(--color-border-corner);
  border-radius: 0 0 0 2px;
}
.corner--br {
  bottom: 3px;
  right: 3px;
  border-bottom: 2px solid var(--color-border-corner);
  border-right: 2px solid var(--color-border-corner);
  border-radius: 0 0 2px 0;
}
</style>
```

- [ ] **Step 2: Créer src/composables/useFavorites.ts**

```typescript
import { ref, watch } from 'vue'

const STORAGE_KEY = 'dofus-favorites'

const favoriteIds = ref<number[]>([])

function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      favoriteIds.value = JSON.parse(stored) as number[]
    }
  } catch {
    favoriteIds.value = []
  }
}

loadFromStorage()

export function useFavorites() {
  watch(favoriteIds, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function isFavorite(itemId: number): boolean {
    return favoriteIds.value.includes(itemId)
  }

  function toggleFavorite(itemId: number): void {
    const idx = favoriteIds.value.indexOf(itemId)
    if (idx === -1) {
      favoriteIds.value.push(itemId)
    } else {
      favoriteIds.value.splice(idx, 1)
    }
  }

  return { favoriteIds, isFavorite, toggleFavorite }
}
```

- [ ] **Step 3: Créer src/components/atoms/StarFavorite.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useFavorites } from '../../composables/useFavorites'

const props = defineProps<{ itemId: number }>()
const { isFavorite, toggleFavorite } = useFavorites()

const active = computed(() => isFavorite(props.itemId))
</script>

<template>
  <button
    class="star-btn"
    :class="{ 'star-btn--active': active }"
    :title="active ? 'Retirer des favoris' : 'Ajouter aux favoris'"
    @click.stop="toggleFavorite(itemId)"
  >
    ★
  </button>
</template>

<style scoped>
.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0.1rem;
  color: var(--color-border);
  transition: color 0.15s, transform 0.1s;
}
.star-btn:hover {
  color: var(--color-accent);
  transform: scale(1.15);
}
.star-btn--active {
  color: var(--color-accent);
}
</style>
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/atoms/OrnateCorners.vue src/composables/useFavorites.ts src/components/atoms/StarFavorite.vue
git commit -m "feat: OrnateCorners atom, useFavorites composable, StarFavorite atom"
```

---

## Task 4: Clés i18n manquantes

**Files:**
- Modify: `public/i18n/fr-FR`
- Modify: `public/i18n/en-US`

- [ ] **Step 1: Ajouter les clés dans public/i18n/fr-FR**

Ajouter après `"nav_logout": "Déconnexion",` :

```json
  "nav_database": "Base de données",
  "nav_tools": "Outils",
```

Ajouter après `"home_subtitle": "..."` :

```json
  "home_cta_search": "Rechercher un objet",
  "home_tile_items": "Objets",
  "home_tile_items_sub": "Armes, armures, ressources...",
  "home_tile_crafts": "Recettes",
  "home_tile_crafts_sub": "Parcourir les fabrications",
  "home_tile_monsters": "Monstres",
  "home_tile_monsters_sub": "Bientôt disponible",
  "home_tile_login": "Mon compte",
  "home_tile_login_sub": "Connexion ou inscription",
  "home_dashboard_crafting": "Ma liste de craft",
  "home_dashboard_see_list": "Voir ma liste →",
  "home_dashboard_missing": "Ressources manquantes",
  "home_dashboard_empty_craft": "Votre liste de craft est vide.",
  "home_dashboard_start": "Commencer à crafter",
```

Ajouter après `"no_items_found": "Aucun objet trouvé",` :

```json
  "quicksearch_placeholder": "Rechercher un objet...",
  "quicksearch_see_all": "Voir tous les résultats →",
  "quicksearch_no_results": "Aucun résultat",
  "detail_placeholder": "Sélectionnez un objet pour voir ses détails",
  "detail_placeholder_sub": "Utilisez la recherche ou les filtres à gauche",
```

- [ ] **Step 2: Ajouter les clés dans public/i18n/en-US**

Ajouter après `"nav_logout": "Logout",` :

```json
  "nav_database": "Database",
  "nav_tools": "Tools",
```

Ajouter après `"home_subtitle": "..."` :

```json
  "home_cta_search": "Search for an item",
  "home_tile_items": "Items",
  "home_tile_items_sub": "Weapons, armor, resources...",
  "home_tile_crafts": "Crafts",
  "home_tile_crafts_sub": "Browse craftable items",
  "home_tile_monsters": "Monsters",
  "home_tile_monsters_sub": "Coming soon",
  "home_tile_login": "My Account",
  "home_tile_login_sub": "Login or register",
  "home_dashboard_crafting": "My Crafting List",
  "home_dashboard_see_list": "View my list →",
  "home_dashboard_missing": "Missing Materials",
  "home_dashboard_empty_craft": "Your crafting list is empty.",
  "home_dashboard_start": "Start crafting",
```

Ajouter après `"no_items_found": "No items found",` :

```json
  "quicksearch_placeholder": "Search for an item...",
  "quicksearch_see_all": "See all results →",
  "quicksearch_no_results": "No results",
  "detail_placeholder": "Select an item to view details",
  "detail_placeholder_sub": "Use the search or filters on the left",
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add public/i18n/fr-FR public/i18n/en-US
git commit -m "feat: add i18n keys for nav groups, quicksearch, home dashboard"
```

---

## Task 5: Header — double barre + NavDropdown

**Files:**
- Create: `src/components/molecules/NavDropdown.vue`
- Rewrite: `src/components/molecules/Header.vue`

- [ ] **Step 1: Créer src/components/molecules/NavDropdown.vue**

```vue
<script setup lang="ts">
defineProps<{
  label: string
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
  close: []
}>()
</script>

<template>
  <div class="nav-dropdown" @mouseleave="$emit('close')">
    <button
      class="nav-tab nav-tab--dropdown"
      :class="{ 'nav-tab--active': isOpen }"
      @click="$emit('toggle')"
    >
      <span v-translate="label"></span>
      <span class="arrow">▾</span>
    </button>
    <div v-if="isOpen" class="dropdown-menu">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nav-dropdown {
  position: relative;
}

.nav-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-nav);
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.55rem 1rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
  height: 100%;
}
.nav-tab:hover,
.nav-tab--active {
  color: var(--color-text-nav-active);
  border-bottom-color: var(--color-accent);
}

.arrow {
  font-size: 0.65rem;
  margin-top: 1px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-bg-nav);
  border: 1px solid var(--color-border-accent);
  border-top: none;
  border-radius: 0 0 8px 8px;
  min-width: 180px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
</style>
```

- [ ] **Step 2: Réécrire src/components/molecules/Header.vue**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import ThemeToggle from '../atoms/ThemeToggle.vue'
import NavDropdown from './NavDropdown.vue'
import QuickSearchDropdown from './QuickSearchDropdown.vue'

const { isLoggedIn, user, logout } = useAuth()

const activeDropdown = ref<string | null>(null)

type Page = 'home' | 'items' | 'crafting-list' | 'crafts' | 'login' | 'register'

function navigate(page: Page): void {
  ;(window as any).navigateTo?.(page)
  activeDropdown.value = null
}

async function handleLogout(): Promise<void> {
  await logout()
  navigate('home')
}

function toggleDropdown(name: string): void {
  activeDropdown.value = activeDropdown.value === name ? null : name
}

function closeDropdowns(): void {
  activeDropdown.value = null
}
</script>

<template>
  <header class="site-header">
    <!-- Barre 1 : Logo + Quicksearch + Controls -->
    <div class="header-top">
      <div class="header-inner">
        <button class="site-logo" @click="navigate('home')">
          ⚔ <span v-translate="'site_title'"></span>
        </button>

        <div class="header-controls">
          <QuickSearchDropdown />
          <ThemeToggle />
          <div class="lang-wrapper">
            <SelectLang />
          </div>
          <template v-if="!isLoggedIn">
            <button class="btn-nav-pill" @click="navigate('login')" v-translate="'nav_login'"></button>
          </template>
          <template v-else>
            <div class="user-avatar" :title="user?.username">
              {{ user?.username?.charAt(0).toUpperCase() }}
            </div>
            <button class="btn-nav-pill btn-nav-pill--logout" @click="handleLogout" v-translate="'nav_logout'"></button>
          </template>
        </div>
      </div>
    </div>

    <!-- Barre 2 : Navigation onglets -->
    <nav class="header-nav" @click.self="closeDropdowns">
      <div class="header-inner header-inner--nav">
        <button class="nav-tab" @click="navigate('home')" v-translate="'nav_home'"></button>

        <NavDropdown
          label="nav_database"
          :is-open="activeDropdown === 'database'"
          @toggle="toggleDropdown('database')"
          @close="closeDropdowns"
        >
          <button class="nav-dropdown-item" @click="navigate('items')" v-translate="'nav_items'"></button>
          <button class="nav-dropdown-item" @click="navigate('crafts')" v-translate="'nav_crafts'"></button>
          <button class="nav-dropdown-item nav-dropdown-item--disabled" disabled v-translate="'nav_monsters'"></button>
        </NavDropdown>

        <NavDropdown
          v-if="isLoggedIn"
          label="nav_tools"
          :is-open="activeDropdown === 'tools'"
          @toggle="toggleDropdown('tools')"
          @close="closeDropdowns"
        >
          <button class="nav-dropdown-item" @click="navigate('crafting-list')" v-translate="'nav_crafting_list'"></button>
        </NavDropdown>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Barre top */
.header-top {
  background: var(--color-bg-nav-top);
  border-bottom: 1px solid var(--color-border-accent);
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.45rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.site-logo {
  background: none;
  border: none;
  color: var(--color-accent);
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lang-wrapper {
  border: 1px solid var(--color-border-accent);
  border-radius: 6px;
  padding: 0.15rem 0.5rem;
}

.btn-nav-pill {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-nav);
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-nav-pill:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.btn-nav-pill--logout:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-bg-nav);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.75rem;
}

/* Barre nav */
.header-nav {
  background: var(--color-bg-nav);
  border-bottom: 1px solid var(--color-border-accent);
}
.header-inner--nav {
  padding: 0 1.25rem;
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 38px;
}

.nav-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-nav);
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.55rem 1rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.nav-tab:hover {
  color: var(--color-text-nav-active);
  border-bottom-color: var(--color-accent);
}

.nav-dropdown-item {
  background: none;
  border: none;
  color: var(--color-text-nav);
  font-family: 'Nunito', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s, background-color 0.15s;
}
.nav-dropdown-item:hover {
  color: var(--color-text-nav-active);
  background: rgba(212, 168, 92, 0.08);
}
.nav-dropdown-item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

:deep(select) {
  background: transparent;
  color: var(--color-text-nav);
  font-size: 0.75rem;
  border: none;
  outline: none;
  cursor: pointer;
}
:deep(option) {
  background: var(--color-bg-nav);
  color: var(--color-text-nav);
}
</style>
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

Si erreur "QuickSearchDropdown not found" : c'est normal, on le crée à la Task 6. Temporairement, commenter l'import et `<QuickSearchDropdown />` dans Header.vue.

- [ ] **Step 4: Vérification visuelle**

`npm run dev` — Vérifier : double barre visible, dropdowns fonctionnels au clic, toggle de thème dans le header.

- [ ] **Step 5: Commit**

```bash
git add src/components/molecules/NavDropdown.vue src/components/molecules/Header.vue
git commit -m "feat: header redesign — double navbar, dropdowns, theme toggle"
```

---

## Task 6: Quicksearch Header

**Files:**
- Create: `src/composables/useQuicksearch.ts`
- Create: `src/components/molecules/QuickSearchDropdown.vue`
- Modify: `src/components/molecules/Header.vue` (décommenter l'import)
- Modify: `src/App.vue` (ajouter navigateToItemSearch)

- [ ] **Step 1: Créer src/composables/useQuicksearch.ts**

```typescript
import { ref } from 'vue'
import type { Item } from '../entities/Item'
import { searchItems } from '../services/itemService'

const query = ref('')
const results = ref<Item[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const selectedIndex = ref(-1)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

export function useQuicksearch() {
  function openDropdown(): void {
    if (results.value.length > 0 || query.value.length >= 2) {
      isOpen.value = true
    }
  }

  function closeDropdown(): void {
    isOpen.value = false
    selectedIndex.value = -1
  }

  function clearSearch(): void {
    query.value = ''
    results.value = []
    isOpen.value = false
    selectedIndex.value = -1
  }

  async function handleInput(value: string): Promise<void> {
    query.value = value
    selectedIndex.value = -1

    if (value.length < 2) {
      results.value = []
      isOpen.value = false
      return
    }

    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      isLoading.value = true
      try {
        const all = await searchItems(value)
        results.value = all.slice(0, 8)
        isOpen.value = true
      } catch {
        results.value = []
      } finally {
        isLoading.value = false
      }
    }, 250)
  }

  function moveSelection(direction: 1 | -1): void {
    const max = results.value.length - 1
    if (selectedIndex.value === -1 && direction === 1) {
      selectedIndex.value = 0
    } else {
      selectedIndex.value = Math.max(0, Math.min(max, selectedIndex.value + direction))
    }
  }

  function getSelectedItem(): Item | null {
    return results.value[selectedIndex.value] ?? null
  }

  return {
    query,
    results,
    isOpen,
    isLoading,
    selectedIndex,
    handleInput,
    openDropdown,
    closeDropdown,
    clearSearch,
    moveSelection,
    getSelectedItem
  }
}
```

- [ ] **Step 2: Mettre à jour src/App.vue**

Ajouter un état `preselectedItem` et une fonction `navigateToItemSearch` :

```vue
<script setup lang="ts">
import { ref } from 'vue'
import HomePage from './components/pages/HomePage.vue'
import ItemSearchPage from './components/pages/ItemSearchPage.vue'
import CraftingListPage from './components/pages/CraftingListPage.vue'
import CraftBrowsePage from './components/pages/CraftBrowsePage.vue'
import LoginPage from './components/pages/LoginPage.vue'
import RegisterPage from './components/pages/RegisterPage.vue'
import type { Item } from './entities/Item'
import { useAuth } from './composables/useAuth'

const { isLoggedIn } = useAuth()
const currentPage = ref<'home' | 'items' | 'crafting-list' | 'crafts' | 'login' | 'register'>('home')
const preselectedItem = ref<Item | null>(null)

function setPage(page: 'home' | 'items' | 'crafting-list' | 'crafts' | 'login' | 'register'): void {
  if (page === 'crafting-list' && !isLoggedIn.value) {
    currentPage.value = 'login'
    preselectedItem.value = null
    return
  }
  currentPage.value = page
  preselectedItem.value = null
}

function navigateToItemSearch(item: Item): void {
  preselectedItem.value = item
  currentPage.value = 'items'
}

;(window as any).navigateTo = setPage
;(window as any).navigateToItemSearch = navigateToItemSearch
// Compatibilité rétro pour tout composant encore appelant navigateToItemDetails
;(window as any).navigateToItemDetails = navigateToItemSearch
</script>

<template>
  <HomePage v-if="currentPage === 'home'" />
  <ItemSearchPage
    v-else-if="currentPage === 'items'"
    :initial-item="preselectedItem"
  />
  <CraftingListPage v-else-if="currentPage === 'crafting-list'" />
  <CraftBrowsePage v-else-if="currentPage === 'crafts'" />
  <LoginPage v-else-if="currentPage === 'login'" />
  <RegisterPage v-else-if="currentPage === 'register'" />
</template>

<style scoped>
</style>
```

> Note : `ItemDetailsPage` n'est plus monté directement dans App — il est utilisé comme composant interne dans `ItemSearchPage`.

- [ ] **Step 3: Créer src/components/molecules/QuickSearchDropdown.vue**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useQuicksearch } from '../../composables/useQuicksearch'
import ItemSprite from '../atoms/ItemSprite.vue'
import StarFavorite from '../atoms/StarFavorite.vue'

const {
  query,
  results,
  isOpen,
  isLoading,
  selectedIndex,
  handleInput,
  closeDropdown,
  clearSearch,
  moveSelection,
  getSelectedItem
} = useQuicksearch()

const inputRef = ref<HTMLInputElement | null>(null)

function onInput(e: Event): void {
  handleInput((e.target as HTMLInputElement).value)
}

function onKeydown(e: KeyboardEvent): void {
  if (!isOpen.value) return
  if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1) }
  if (e.key === 'Escape') { closeDropdown(); inputRef.value?.blur() }
  if (e.key === 'Enter') {
    const item = getSelectedItem()
    if (item) selectItem(item)
  }
}

function selectItem(item: { id: number; name: string; type: number; pod: number; level: number }): void {
  ;(window as any).navigateToItemSearch?.(item)
  clearSearch()
  inputRef.value?.blur()
}

function goToSearch(): void {
  ;(window as any).navigateTo?.('items')
  clearSearch()
}
</script>

<template>
  <div class="qs-wrapper" v-click-outside="closeDropdown">
    <input
      ref="inputRef"
      class="qs-input input-search"
      type="text"
      :value="query"
      placeholder="Rechercher un objet..."
      <!-- Note: v-translate ne supporte pas les attributs — placeholder en dur, à localiser manuellement si besoin -->
      @input="onInput"
      @keydown="onKeydown"
      @focus="() => { if (results.length > 0) closeDropdown(); }"
    />

    <div v-if="isOpen" class="qs-dropdown">
      <div v-if="isLoading" class="qs-loading">
        <span>…</span>
      </div>

      <template v-else-if="results.length > 0">
        <button
          v-for="(item, idx) in results"
          :key="item.id"
          class="qs-row"
          :class="{ 'qs-row--active': idx === selectedIndex }"
          @click="selectItem(item)"
        >
          <div class="qs-sprite">
            <ItemSprite :type-id="item.type" :gfx-id="(item as any).gfxId ?? 1" :size="28" />
          </div>
          <div class="qs-info">
            <span class="qs-name">{{ item.name }}</span>
            <span class="qs-meta">Niv. {{ item.level }}</span>
          </div>
          <StarFavorite :item-id="item.id" />
        </button>

        <button class="qs-see-all" @click="goToSearch" v-translate="'quicksearch_see_all'"></button>
      </template>

      <div v-else class="qs-empty" v-translate="'quicksearch_no_results'"></div>
    </div>
  </div>
</template>

<style scoped>
.qs-wrapper {
  position: relative;
}

.qs-input {
  width: 220px;
}

.qs-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 420px;
  max-width: 90vw;
  background: var(--color-bg-nav-top);
  border: 1px solid var(--color-border-accent);
  border-radius: 8px;
  z-index: 300;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.qs-loading,
.qs-empty {
  padding: 0.75rem 1rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  text-align: center;
}

.qs-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-border-accent);
  cursor: pointer;
  transition: background-color 0.1s;
  text-align: left;
}
.qs-row:last-of-type {
  border-bottom: none;
}
.qs-row:hover,
.qs-row--active {
  background: rgba(212, 168, 92, 0.1);
}

.qs-sprite {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--color-bg-elevated);
  overflow: hidden;
}

.qs-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.qs-name {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-text-nav-active);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.qs-meta {
  font-size: 0.75rem;
  color: var(--color-text-nav);
}

.qs-see-all {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: rgba(212, 168, 92, 0.06);
  border: none;
  border-top: 1px solid var(--color-border-accent);
  color: var(--color-accent);
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
}
.qs-see-all:hover {
  background: rgba(212, 168, 92, 0.12);
}
</style>
```

> Note : `v-click-outside` n'est pas une directive native Vue. Remplacer par une gestion via `@blur` ou un watcher sur `document.addEventListener('click', ...)` si ce n'est pas disponible. Alternative simple : utiliser `@focusout` sur `.qs-wrapper` avec un `setTimeout` de 150ms pour laisser le clic se propager.

**Correction pour le click-outside (sans directive externe)** — Ajouter dans le `<script setup>` :

```typescript
import { onMounted, onUnmounted } from 'vue'

const wrapperRef = ref<HTMLDivElement | null>(null)

function onDocumentClick(e: MouseEvent): void {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
```

Et remplacer `v-click-outside="closeDropdown"` par `ref="wrapperRef"` sur `.qs-wrapper`.

- [ ] **Step 4: Décommenter QuickSearchDropdown dans Header.vue**

Si l'import avait été commenté à la Task 5, le décommenter maintenant.

- [ ] **Step 5: Build check**

```bash
npm run build
```

Erreur possible : `ItemSprite` attend des props différentes. Vérifier la signature dans `src/components/atoms/ItemSprite.vue` et adapter l'appel si nécessaire.

- [ ] **Step 6: Vérification visuelle**

`npm run dev` — Taper "épée" dans le champ header → dropdown doit apparaître avec des résultats. Navigation clavier (↑↓) doit fonctionner.

- [ ] **Step 7: Commit**

```bash
git add src/composables/useQuicksearch.ts src/components/molecules/QuickSearchDropdown.vue src/App.vue
git commit -m "feat: quicksearch header with keyboard nav and item pre-selection"
```

---

## Task 7: HomePage — Hero + Dashboard

**Files:**
- Rewrite: `src/components/pages/HomePage.vue`

- [ ] **Step 1: Réécrire src/components/pages/HomePage.vue**

```vue
<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import { useCraftingList } from '../../composables/useCraftingList'
import { useMaterialCalculator } from '../../composables/useMaterialCalculator'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'

const { isLoggedIn } = useAuth()
const { craftingList } = useCraftingList()
const { missingMaterials } = useMaterialCalculator()

function navigate(page: 'items' | 'crafts' | 'login' | 'crafting-list'): void {
  ;(window as any).navigateTo?.(page)
}
</script>

<template>
  <div class="page-wrapper">
    <Header />

    <main class="home-main">
      <!-- ── Mode non-connecté : Hero + tuiles ── -->
      <template v-if="!isLoggedIn">
        <section class="hero">
          <div class="hero-inner">
            <div class="hero-icon">⚔</div>
            <h1 class="hero-title" v-translate="'site_title'"></h1>
            <p class="hero-subtitle" v-translate="'home_subtitle'"></p>
            <button class="btn-primary hero-cta" @click="navigate('items')" v-translate="'home_cta_search'"></button>
          </div>
        </section>

        <section class="tiles-section">
          <div class="tiles-grid">
            <button class="tile card-ornate" @click="navigate('items')">
              <OrnateCorners />
              <div class="tile-icon">🗡</div>
              <div class="tile-label" v-translate="'home_tile_items'"></div>
              <div class="tile-sub" v-translate="'home_tile_items_sub'"></div>
            </button>
            <button class="tile card-ornate" @click="navigate('crafts')">
              <OrnateCorners />
              <div class="tile-icon">📜</div>
              <div class="tile-label" v-translate="'home_tile_crafts'"></div>
              <div class="tile-sub" v-translate="'home_tile_crafts_sub'"></div>
            </button>
            <button class="tile card-ornate tile--disabled" disabled>
              <OrnateCorners />
              <div class="tile-icon">👾</div>
              <div class="tile-label" v-translate="'home_tile_monsters'"></div>
              <div class="tile-sub" v-translate="'home_tile_monsters_sub'"></div>
            </button>
            <button class="tile card-ornate" @click="navigate('login')">
              <OrnateCorners />
              <div class="tile-icon">👤</div>
              <div class="tile-label" v-translate="'home_tile_login'"></div>
              <div class="tile-sub" v-translate="'home_tile_login_sub'"></div>
            </button>
          </div>
        </section>
      </template>

      <!-- ── Mode connecté : Dashboard ── -->
      <template v-else>
        <section class="dashboard">
          <div class="dashboard-grid">
            <!-- Colonne gauche : liste de craft -->
            <div class="dashboard-card card-ornate">
              <OrnateCorners />
              <h2 class="dashboard-title" v-translate="'home_dashboard_crafting'"></h2>
              <div v-if="craftingList.length === 0" class="dashboard-empty">
                <p v-translate="'home_dashboard_empty_craft'"></p>
                <button class="btn-primary" @click="navigate('items')" v-translate="'home_dashboard_start'"></button>
              </div>
              <ul v-else class="craft-preview-list">
                <li
                  v-for="entry in craftingList.slice(0, 5)"
                  :key="entry.item.id"
                  class="craft-preview-item"
                >
                  <span class="craft-preview-name">{{ entry.item.name }}</span>
                  <span class="craft-preview-qty">×{{ entry.quantity }}</span>
                </li>
                <li v-if="craftingList.length > 5" class="craft-preview-more">
                  +{{ craftingList.length - 5 }} autres...
                </li>
              </ul>
              <button
                v-if="craftingList.length > 0"
                class="btn-secondary dashboard-see-list"
                @click="navigate('crafting-list')"
                v-translate="'home_dashboard_see_list'"
              ></button>
            </div>

            <!-- Colonne droite : matériaux manquants -->
            <div class="dashboard-card card-ornate">
              <OrnateCorners />
              <h2 class="dashboard-title" v-translate="'home_dashboard_missing'"></h2>
              <div v-if="missingMaterials.length === 0" class="dashboard-all-ok">
                <span v-translate="'all_materials_available'"></span>
              </div>
              <ul v-else class="missing-list">
                <li
                  v-for="mat in missingMaterials.slice(0, 8)"
                  :key="mat.item.id"
                  class="missing-item"
                >
                  <span class="missing-name">{{ mat.item.name }}</span>
                  <span class="missing-qty">×{{ mat.missing }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </template>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.home-main {
  flex: 1;
}

/* Hero */
.hero {
  background: linear-gradient(160deg, var(--color-bg-nav-top) 0%, var(--color-bg-nav) 100%);
  padding: 4rem 1.25rem;
  text-align: center;
  border-bottom: 2px solid var(--color-border-accent);
}
.hero-inner {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.hero-icon {
  font-size: 3rem;
}
.hero-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-accent);
  margin: 0;
}
.hero-subtitle {
  font-size: 1rem;
  color: var(--color-text-on-dark);
  opacity: 0.8;
  line-height: 1.6;
  margin: 0;
}
.hero-cta {
  margin-top: 0.5rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
}

/* Tuiles */
.tiles-section {
  padding: 2.5rem 1.25rem;
  max-width: 900px;
  margin: 0 auto;
}
.tiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}
.tile {
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  border: none;
  font-family: 'Nunito', sans-serif;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}
.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}
.tile--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.tile--disabled:hover {
  transform: none;
  box-shadow: none;
}
.tile-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}
.tile-label {
  font-weight: 800;
  font-size: 1rem;
  color: var(--color-text-primary);
}
.tile-sub {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* Dashboard */
.dashboard {
  padding: 2rem 1.25rem;
  max-width: 1000px;
  margin: 0 auto;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 700px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}

.dashboard-card {
  padding: 1.25rem 1.5rem;
}
.dashboard-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 1rem;
}
.dashboard-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
.dashboard-all-ok {
  color: var(--color-success);
  font-size: 0.875rem;
  font-weight: 700;
}
.dashboard-see-list {
  margin-top: 1rem;
  font-size: 0.8rem;
}

.craft-preview-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.craft-preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  border-bottom: 1px dashed var(--color-border);
  padding-bottom: 0.3rem;
}
.craft-preview-name {
  font-weight: 600;
}
.craft-preview-qty {
  font-weight: 700;
  color: var(--color-accent);
}
.craft-preview-more {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.missing-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.missing-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-error-bg);
  border-radius: 4px;
  color: var(--color-error);
}
.missing-name { font-weight: 600; }
.missing-qty { font-weight: 700; }
</style>
```

> Note : `useMaterialCalculator` doit exposer `missingMaterials`. Si ce n'est pas le cas, vérifier le composable existant et adapter (utiliser les données disponibles : `missingCount`, `materials` filtrés, etc.).

- [ ] **Step 2: Build check**

```bash
npm run build
```

- [ ] **Step 3: Vérification visuelle**

`npm run dev` — Page d'accueil doit montrer le hero + tuiles quand non-connecté, dashboard quand connecté.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/HomePage.vue
git commit -m "feat: homepage — hero+tiles for guests, dashboard for logged-in users"
```

---

## Task 8: ItemSearchPage — mode hybride

**Files:**
- Rewrite: `src/components/pages/ItemSearchPage.vue`

La page est refaite en layout `360px | 1fr`. Le panneau droit réutilise les composants `CraftDetails` et `ItemStatsList` déjà existants.

- [ ] **Step 1: Réécrire src/components/pages/ItemSearchPage.vue**

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Item } from '../../entities/Item'
import { searchItems } from '../../services/itemService'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import ItemSprite from '../atoms/ItemSprite.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'
import StarFavorite from '../atoms/StarFavorite.vue'
import ItemStatsList from '../molecules/ItemStatsList.vue'
import CraftDetails from '../molecules/CraftDetails.vue'
import { useCraftingList } from '../../composables/useCraftingList'
import QuantityInput from '../atoms/QuantityInput.vue'

const props = defineProps<{
  initialItem?: Item | null
}>()

const searchQuery = ref('')
const filterType = ref<number | ''>('')
const filterMinLevel = ref<number | ''>('')
const filterMaxLevel = ref<number | ''>('')

const items = ref<Item[]>([])
const isSearching = ref(false)
const hasSearched = ref(false)

const selectedItem = ref<Item | null>(props.initialItem ?? null)
const craftQuantity = ref(1)
const justAdded = ref(false)

const { addItem, craftingList } = useCraftingList()

const isInList = (itemId: number) => craftingList.value.some(e => e.item.id === itemId)

async function doSearch(): Promise<void> {
  if (searchQuery.value.length < 2 && filterType.value === '' && filterMinLevel.value === '') {
    return
  }
  isSearching.value = true
  hasSearched.value = true
  try {
    const results = await searchItems(searchQuery.value)
    items.value = results.filter(item => {
      if (filterType.value !== '' && item.type !== filterType.value) return false
      if (filterMinLevel.value !== '' && item.level < filterMinLevel.value) return false
      if (filterMaxLevel.value !== '' && item.level > filterMaxLevel.value) return false
      return true
    })
  } catch {
    items.value = []
  } finally {
    isSearching.value = false
  }
}

function selectItem(item: Item): void {
  selectedItem.value = item
  craftQuantity.value = 1
  justAdded.value = false
}

function addToList(): void {
  if (!selectedItem.value) return
  addItem(selectedItem.value, craftQuantity.value)
  justAdded.value = true
  setTimeout(() => { justAdded.value = false }, 2000)
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') doSearch()
}

onMounted(() => {
  if (props.initialItem) {
    doSearch()
  }
})
</script>

<template>
  <div class="page-wrapper">
    <Header />
    <main class="search-main">
      <div class="search-layout">

        <!-- ── Panneau gauche : filtres + liste ── -->
        <aside class="search-panel">
          <h1 class="panel-title" v-translate="'items_page_title'"></h1>

          <!-- Filtres -->
          <div class="filters">
            <input
              class="input-field"
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher un objet..."
      <!-- Note: v-translate ne supporte pas les attributs — placeholder en dur, à localiser manuellement si besoin -->
              @keydown="handleKeydown"
            />
            <div class="filter-row">
              <input
                class="input-field filter-level"
                type="number"
                v-model.number="filterMinLevel"
                placeholder="Niv. min"
              />
              <input
                class="input-field filter-level"
                type="number"
                v-model.number="filterMaxLevel"
                placeholder="Niv. max"
              />
            </div>
            <button class="btn-primary search-btn" @click="doSearch" v-translate="'search_button'"></button>
          </div>

          <!-- Résultats -->
          <div class="results-list">
            <p v-if="isSearching" class="list-status" v-translate="'searching_label'"></p>
            <p v-else-if="hasSearched && items.length === 0" class="list-status" v-translate="'no_items_found'"></p>
            <p v-else-if="!hasSearched" class="list-status list-status--hint">
              Utilisez la recherche pour trouver des objets.
            </p>
            <ul v-else class="items-list">
              <li
                v-for="item in items"
                :key="item.id"
                class="item-row"
                :class="{ 'item-row--active': selectedItem?.id === item.id }"
                @click="selectItem(item)"
              >
                <div class="item-row-sprite">
                  <ItemSprite :type-id="item.type" :gfx-id="(item as any).gfxId ?? 1" :size="28" />
                </div>
                <div class="item-row-info">
                  <span class="item-row-name">{{ item.name }}</span>
                  <span class="item-row-meta">Niv. {{ item.level }}</span>
                </div>
                <StarFavorite :item-id="item.id" />
              </li>
            </ul>
          </div>
        </aside>

        <!-- ── Panneau droit : détail ── -->
        <section class="detail-panel">
          <div v-if="!selectedItem" class="detail-empty">
            <div class="detail-empty-icon">🗡</div>
            <p class="detail-empty-text" v-translate="'detail_placeholder'"></p>
            <p class="detail-empty-sub" v-translate="'detail_placeholder_sub'"></p>
          </div>

          <div v-else class="detail-content card-ornate">
            <OrnateCorners />
            <div class="detail-header">
              <div class="detail-sprite">
                <ItemSprite :type-id="selectedItem.type" :gfx-id="(selectedItem as any).gfxId ?? 1" :size="64" />
              </div>
              <div class="detail-meta">
                <h2 class="detail-name">{{ selectedItem.name }}</h2>
                <span class="detail-level">
                  <span v-translate="'label_level'"></span> {{ selectedItem.level }}
                  · {{ selectedItem.pod }} <span v-translate="'label_pods'"></span>
                </span>
              </div>
              <StarFavorite :item-id="selectedItem.id" />
            </div>

            <ItemStatsList :item="selectedItem" />
            <CraftDetails :item-id="selectedItem.id" />

            <div class="detail-actions">
              <QuantityInput v-model="craftQuantity" :min="1" :max="99" />
              <button
                v-if="!justAdded"
                class="btn-primary"
                @click="addToList"
                v-translate="isInList(selectedItem.id) ? 'in_list_label' : 'add_to_list'"
              ></button>
              <span v-else class="added-confirmation" v-translate="'added_to_list'"></span>
            </div>
          </div>
        </section>

      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.search-main {
  flex: 1;
  padding: 1.5rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.search-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 900px) {
  .search-layout { grid-template-columns: 1fr; }
}

/* Panneau gauche */
.search-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 110px);
  overflow: hidden;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.filter-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.filter-level {
  font-size: 0.8rem;
}
.search-btn {
  width: 100%;
}

.results-list {
  overflow-y: auto;
  flex: 1;
}
.list-status {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  padding: 0.5rem 0;
}
.list-status--hint {
  font-style: italic;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.item-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}
.item-row:hover {
  border-color: var(--color-accent);
}
.item-row--active {
  border-color: var(--color-border-accent);
  background: var(--color-bg-elevated);
}
.item-row-sprite {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  background: var(--color-bg-elevated);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.item-row-name {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-row-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Panneau droit */
.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
}
.detail-empty-icon { font-size: 3rem; opacity: 0.3; }
.detail-empty-text { font-weight: 700; font-size: 1rem; }
.detail-empty-sub { font-size: 0.85rem; }

.detail-content {
  padding: 1.5rem;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--color-border);
}
.detail-sprite {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background: var(--color-bg-elevated);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-meta {
  flex: 1;
}
.detail-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
}
.detail-level {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--color-border);
}
.added-confirmation {
  color: var(--color-success);
  font-weight: 700;
  font-size: 0.875rem;
}
</style>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

- [ ] **Step 3: Vérification visuelle**

`npm run dev` — Page Objets doit afficher le layout 2 panneaux. Rechercher "épée", cliquer un item → détails dans le panneau droit.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/ItemSearchPage.vue
git commit -m "feat: ItemSearchPage hybrid layout — filter panel + detail panel"
```

---

## Task 9: CraftBrowsePage — mode hybride

**Files:**
- Rewrite: `src/components/pages/CraftBrowsePage.vue`

- [ ] **Step 1: Lire l'implémentation actuelle de CraftBrowsePage.vue**

Lire `src/components/pages/CraftBrowsePage.vue` pour noter :
- La logique de chargement et pagination (IntersectionObserver + PAGE_SIZE)
- Le service API utilisé
- Les composants enfants (CraftBrowseCard, etc.)

- [ ] **Step 2: Réécrire src/components/pages/CraftBrowsePage.vue**

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Item } from '../../entities/Item'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'
import StarFavorite from '../atoms/StarFavorite.vue'
import CraftDetails from '../molecules/CraftDetails.vue'
import ItemSprite from '../atoms/ItemSprite.vue'
import { useCraftingList } from '../../composables/useCraftingList'
import QuantityInput from '../atoms/QuantityInput.vue'

// Reprend la logique de pagination de l'ancien CraftBrowsePage
const PAGE_SIZE = 20
const crafts = ref<Item[]>([])
const isLoading = ref(false)
const hasMore = ref(true)
const page = ref(0)
const error = ref('')

const selectedItem = ref<Item | null>(null)
const craftQuantity = ref(1)
const justAdded = ref(false)

const { addItem, craftingList } = useCraftingList()
const isInList = (id: number) => craftingList.value.some(e => e.item.id === id)

const loaderRef = ref<HTMLDivElement | null>(null)
let observer: IntersectionObserver | null = null

async function loadMore(): Promise<void> {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true
  try {
    const response = await fetch(`/api/crafts?page=${page.value}&limit=${PAGE_SIZE}`)
    if (!response.ok) throw new Error(response.statusText)
    const data: Item[] = await response.json()
    if (data.length < PAGE_SIZE) hasMore.value = false
    crafts.value.push(...data)
    page.value++
  } catch (e) {
    error.value = String(e)
  } finally {
    isLoading.value = false
  }
}

function selectItem(item: Item): void {
  selectedItem.value = item
  craftQuantity.value = 1
  justAdded.value = false
}

function addToList(): void {
  if (!selectedItem.value) return
  addItem(selectedItem.value, craftQuantity.value)
  justAdded.value = true
  setTimeout(() => { justAdded.value = false }, 2000)
}

onMounted(() => {
  loadMore()
  observer = new IntersectionObserver(
    (entries) => { if (entries[0]?.isIntersecting) loadMore() },
    { threshold: 0.1 }
  )
  if (loaderRef.value) observer.observe(loaderRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="page-wrapper">
    <Header />
    <main class="craft-main">
      <div class="craft-layout">

        <!-- Panneau gauche -->
        <aside class="craft-panel">
          <h1 class="panel-title" v-translate="'crafts_page_title'"></h1>
          <p class="panel-sub" v-translate="'crafts_page_subtitle'"></p>

          <ul class="crafts-list">
            <li
              v-for="item in crafts"
              :key="item.id"
              class="item-row"
              :class="{ 'item-row--active': selectedItem?.id === item.id }"
              @click="selectItem(item)"
            >
              <div class="item-row-sprite">
                <ItemSprite :type-id="item.type" :gfx-id="(item as any).gfxId ?? 1" :size="28" />
              </div>
              <div class="item-row-info">
                <span class="item-row-name">{{ item.name }}</span>
                <span class="item-row-meta">Niv. {{ item.level }}</span>
              </div>
              <StarFavorite :item-id="item.id" />
            </li>
          </ul>

          <div ref="loaderRef" class="loader-trigger">
            <span v-if="isLoading" v-translate="'loading_crafts'"></span>
            <span v-else-if="!hasMore" v-translate="'no_more_crafts'"></span>
          </div>
        </aside>

        <!-- Panneau droit -->
        <section class="detail-panel">
          <div v-if="!selectedItem" class="detail-empty">
            <div class="detail-empty-icon">📜</div>
            <p class="detail-empty-text" v-translate="'detail_placeholder'"></p>
            <p class="detail-empty-sub" v-translate="'detail_placeholder_sub'"></p>
          </div>

          <div v-else class="detail-content card-ornate">
            <OrnateCorners />
            <div class="detail-header">
              <div class="detail-sprite">
                <ItemSprite :type-id="selectedItem.type" :gfx-id="(selectedItem as any).gfxId ?? 1" :size="64" />
              </div>
              <div class="detail-meta">
                <h2 class="detail-name">{{ selectedItem.name }}</h2>
                <span class="detail-level">Niv. {{ selectedItem.level }}</span>
              </div>
              <StarFavorite :item-id="selectedItem.id" />
            </div>

            <CraftDetails :item-id="selectedItem.id" />

            <div class="detail-actions">
              <QuantityInput v-model="craftQuantity" :min="1" :max="99" />
              <button
                v-if="!justAdded"
                class="btn-primary"
                @click="addToList"
                v-translate="isInList(selectedItem.id) ? 'in_list_label' : 'add_to_list'"
              ></button>
              <span v-else class="added-confirmation" v-translate="'added_to_list'"></span>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.page-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
.craft-main {
  flex: 1;
  padding: 1.5rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}
.craft-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 900px) {
  .craft-layout { grid-template-columns: 1fr; }
}

.craft-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 110px);
  overflow: hidden;
}
.panel-title { font-size: 1.25rem; font-weight: 800; color: var(--color-text-primary); margin: 0; }
.panel-sub { font-size: 0.875rem; color: var(--color-text-muted); margin: 0; }

.crafts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.item-row {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.5rem 0.75rem; border-radius: 8px;
  border: 1px solid var(--color-border); background: var(--color-bg-surface);
  cursor: pointer; transition: border-color 0.15s, background-color 0.15s;
}
.item-row:hover { border-color: var(--color-accent); }
.item-row--active { border-color: var(--color-border-accent); background: var(--color-bg-elevated); }
.item-row-sprite {
  width: 28px; height: 28px; flex-shrink: 0;
  background: var(--color-bg-elevated); border-radius: 4px;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.item-row-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.item-row-name { font-weight: 700; font-size: 0.875rem; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-row-meta { font-size: 0.75rem; color: var(--color-text-muted); }

.loader-trigger { padding: 0.75rem; text-align: center; color: var(--color-text-muted); font-size: 0.85rem; }

.detail-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 400px; gap: 0.75rem;
  color: var(--color-text-muted); text-align: center;
}
.detail-empty-icon { font-size: 3rem; opacity: 0.3; }
.detail-empty-text { font-weight: 700; font-size: 1rem; }
.detail-empty-sub { font-size: 0.85rem; }

.detail-content { padding: 1.5rem; }
.detail-header {
  display: flex; align-items: flex-start; gap: 1rem;
  margin-bottom: 1.25rem; padding-bottom: 1rem;
  border-bottom: 1px dashed var(--color-border);
}
.detail-sprite {
  width: 64px; height: 64px; flex-shrink: 0;
  background: var(--color-bg-elevated); border-radius: 8px;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.detail-meta { flex: 1; }
.detail-name { font-size: 1.2rem; font-weight: 800; color: var(--color-text-primary); margin: 0 0 0.25rem; }
.detail-level { font-size: 0.875rem; color: var(--color-text-muted); }

.detail-actions {
  display: flex; align-items: center; gap: 0.75rem;
  margin-top: 1.25rem; padding-top: 1rem;
  border-top: 1px dashed var(--color-border);
}
.added-confirmation { color: var(--color-success); font-weight: 700; font-size: 0.875rem; }
</style>
```

> Note : Le endpoint `/api/crafts?page=N&limit=N` doit exister dans le backend. Si l'ancien code utilisait un endpoint différent, adapter l'URL dans `loadMore()`.

- [ ] **Step 2: Build check** `npm run build`

- [ ] **Step 3: Vérification visuelle** — Page Recettes : liste à gauche avec infinite scroll, détail à droite au clic.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/CraftBrowsePage.vue
git commit -m "feat: CraftBrowsePage hybrid layout — infinite scroll list + detail panel"
```

---

## Task 10: CraftingListPage — restyling ornamental

**Files:**
- Modify: `src/components/pages/CraftingListPage.vue`

- [ ] **Step 1: Lire le fichier actuel**

Lire `src/components/pages/CraftingListPage.vue` pour noter la structure de template existante.

- [ ] **Step 2: Remplacer les classes Tailwind hardcodées par des tokens CSS**

Effectuer les remplacements suivants dans le template :
- `bg-gray-900` → `style="background: var(--color-bg-base)"`
- `bg-gray-800` → `style="background: var(--color-bg-surface)"` ou classe `card-ornate`
- `text-gray-100` → `style="color: var(--color-text-primary)"`
- `text-gray-400` → `style="color: var(--color-text-muted)"`
- `border-gray-700` → `style="border-color: var(--color-border)"`
- `text-blue-400` → `style="color: var(--color-accent)"`
- `text-green-400` / `bg-green-900/20` → `style="color: var(--color-success); background: var(--color-success-bg)"`
- `text-red-400` / `bg-red-900/20` → `style="color: var(--color-error); background: var(--color-error-bg)"`

Ajouter `<OrnateCorners />` + classe `card-ornate` sur les cartes des items à crafter et le panneau de matériaux.

Ajouter en haut du script setup :
```typescript
import OrnateCorners from '../atoms/OrnateCorners.vue'
```

Wrapper `div.page-wrapper` avec flex-col + min-h-screen en CSS scoped :
```css
.page-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
.page-main { flex: 1; padding: 1.5rem 1.25rem; max-width: 1280px; margin: 0 auto; width: 100%; }
```

- [ ] **Step 3: Build check** `npm run build`

- [ ] **Step 4: Vérification visuelle** — Page liste de craft doit avoir les couleurs parchemin et des cadres ornementaux.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/CraftingListPage.vue
git commit -m "feat: CraftingListPage ornamental restyling with CSS tokens"
```

---

## Task 11: Login/Register — cartes centrées ornementales

**Files:**
- Modify: `src/components/pages/LoginPage.vue`
- Modify: `src/components/pages/RegisterPage.vue`

- [ ] **Step 1: Réécrire le template de LoginPage.vue**

Remplacer le template par :

```vue
<template>
  <div class="auth-page">
    <Header />
    <main class="auth-main">
      <div class="auth-card card-ornate">
        <OrnateCorners />
        <h1 class="auth-title" v-translate="'login_title'"></h1>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label" v-translate="'login_username_label'"></label>
            <input class="input-field" type="text" v-model="username" required autocomplete="username" />
          </div>
          <div class="form-group">
            <label class="form-label" v-translate="'login_password_label'"></label>
            <input class="input-field" type="password" v-model="password" required autocomplete="current-password" />
          </div>
          <button type="submit" class="btn-primary auth-submit" :disabled="isLoading" v-translate="'login_submit_button'"></button>
        </form>

        <p class="auth-link">
          <span v-translate="'login_no_account'"></span>
          <button class="auth-link-btn" @click="navigate('register')" v-translate="'login_register_link'"></button>
        </p>
      </div>
    </main>
    <Footer />
  </div>
</template>
```

Ajouter dans `<script setup>` :
```typescript
import OrnateCorners from '../atoms/OrnateCorners.vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
function navigate(page: 'register'): void {
  ;(window as any).navigateTo?.(page)
}
```

Ajouter `<style scoped>` :
```css
.auth-page { display: flex; flex-direction: column; min-height: 100vh; }
.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(160deg, var(--color-bg-nav-top) 0%, var(--color-bg-nav) 60%, var(--color-bg-base) 100%);
}
.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
}
.auth-title { font-size: 1.5rem; font-weight: 800; color: var(--color-accent); text-align: center; margin: 0 0 1.5rem; }
.auth-error { color: var(--color-error); background: var(--color-error-bg); border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.875rem; margin-bottom: 1rem; }
.auth-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-secondary); }
.auth-submit { width: 100%; padding: 0.6rem; font-size: 0.95rem; }
.auth-link { text-align: center; margin-top: 1.25rem; font-size: 0.875rem; color: var(--color-text-muted); display: flex; gap: 0.4rem; justify-content: center; flex-wrap: wrap; }
.auth-link-btn { background: none; border: none; color: var(--color-accent); font-family: 'Nunito', sans-serif; font-size: 0.875rem; font-weight: 700; cursor: pointer; padding: 0; text-decoration: underline; }
```

- [ ] **Step 2: Appliquer le même restyling à RegisterPage.vue**

Même structure que LoginPage, adaptée avec les champs `username`, `email`, `password`, `confirmPassword` et les clés i18n `register_*`.

Le `navigate` navigue vers `'login'` au lieu de `'register'`.

- [ ] **Step 3: Build check** `npm run build`

- [ ] **Step 4: Vérification visuelle** — Pages login/register : carte ornementale centrée sur fond dégradé sombre.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/LoginPage.vue src/components/pages/RegisterPage.vue
git commit -m "feat: login/register ornamental centered card design"
```

---

## Task 12: Footer restyling

**Files:**
- Modify: `src/components/molecules/Footer.vue`

- [ ] **Step 1: Réécrire Footer.vue**

```vue
<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-copy">
        &copy; {{ currentYear }} <span v-translate="'footer_rights'"></span>
      </p>
      <div class="footer-links">
        <a href="#" class="footer-link" v-translate="'footer_about'"></a>
        <a href="#" class="footer-link" v-translate="'footer_contact'"></a>
        <a href="#" class="footer-link" v-translate="'footer_github'"></a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--color-bg-nav-top);
  border-top: 1px solid var(--color-border-accent);
  margin-top: auto;
}
.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .footer-inner { flex-direction: row; justify-content: space-between; }
}
.footer-copy {
  color: var(--color-text-nav);
  font-size: 0.8rem;
  margin: 0;
}
.footer-links {
  display: flex;
  gap: 1.5rem;
}
.footer-link {
  color: var(--color-text-nav);
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}
.footer-link:hover {
  color: var(--color-accent);
}
</style>
```

- [ ] **Step 2: Build check + commit**

```bash
npm run build
git add src/components/molecules/Footer.vue
git commit -m "feat: footer restyling with CSS tokens"
```

---

## Task 13: Migration atoms/molecules restants

**Files:**
- Modify: tous les atoms et molecules non encore migrés

- [ ] **Step 1: Lire et migrer SearchInput.vue**

Remplacer les classes `bg-gray-*`, `text-gray-*`, `border-gray-*` par `var(--color-*)` via style inline ou classes scoped.

Pattern général : 
- `class="bg-gray-800 border border-gray-700 text-gray-100 ..."` → utiliser la classe CSS `.input-field` déjà définie dans style.css

- [ ] **Step 2: Lire et migrer ItemCard.vue**

Ajouter la classe `card-ornate` sur le conteneur principal + `<OrnateCorners />`. Remplacer les classes de couleur hardcodées.

- [ ] **Step 3: Lire et migrer CraftIngredientCard.vue, MaterialRequirementCard.vue, InventoryEntry.vue**

Même traitement : couleurs → tokens CSS, cards → `.card-ornate`.

- [ ] **Step 4: Lire et migrer StatDisplay.vue, ItemStatsList.vue, CraftDetails.vue**

Remplacer toutes les couleurs Tailwind `gray-*`, `blue-*` par les tokens correspondants.

- [ ] **Step 5: Build check final**

```bash
npm run build
```

0 erreur TypeScript attendu.

- [ ] **Step 6: Test visuel complet**

`npm run dev` — Parcourir toutes les pages et vérifier :
1. Cohérence des couleurs parchemin sur toutes les pages
2. Toggle dark mode fonctionne sur chaque page
3. Navigation header fonctionne (dropdowns, quicksearch)
4. Liste de craft opérationnelle
5. Recherche d'items avec panneau de détail

- [ ] **Step 7: Commit**

```bash
git add src/components/atoms/ src/components/molecules/
git commit -m "feat: migrate all atoms and molecules to CSS custom properties"
```

---

## Task 14: Design doc + spec

**Files:**
- Create: `docs/superpowers/specs/2026-04-15-dofus-retro-redesign-design.md`

- [ ] **Step 1: Créer le dossier et copier la spec**

```bash
mkdir -p docs/superpowers/specs
```

Créer `docs/superpowers/specs/2026-04-15-dofus-retro-redesign-design.md` avec le contenu du plan de design approuvé (contenu du fichier `C:\Users\hauwk\.claude\plans\dynamic-napping-crown.md`).

- [ ] **Step 2: Ajouter .superpowers à .gitignore**

Ajouter dans `.gitignore` (ou créer si absent) :
```
.superpowers/
```

- [ ] **Step 3: Commit final**

```bash
git add docs/ .gitignore
git commit -m "docs: add visual redesign spec and design decisions"
```

---

## Checklist de vérification finale

Avant de considérer la refonte terminée :

- [ ] `npm run build` — 0 erreur TypeScript
- [ ] Fond parchemin `#f5e6c8` visible sur toutes les pages en mode light
- [ ] Fond brun `#1f150a` visible sur toutes les pages en mode dark
- [ ] Toggle ☀/🌙 dans le header bascule les deux thèmes, préférence persistée dans localStorage
- [ ] Navigation double barre sticky avec dropdowns fonctionnels
- [ ] Quicksearch header : dropdown de résultats + navigation clavier + clic → panel détail
- [ ] Cadres ornementaux avec coins en L visibles sur les cards
- [ ] Nunito utilisée sur l'ensemble du site (vérifier dans DevTools → Computed → font-family)
- [ ] Page d'accueil : hero si non-connecté, dashboard si connecté
- [ ] ItemSearchPage : layout 2 panneaux, item pré-sélectionnable depuis quicksearch
- [ ] CraftBrowsePage : layout 2 panneaux avec infinite scroll
- [ ] Login/Register : carte centrée ornementale sur fond dégradé sombre
- [ ] Responsive : aucune régression majeure sur mobile (grid → 1 colonne)
