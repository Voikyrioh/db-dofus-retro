# Architecture — dofus-retro-db
Stack : Vue 3, TypeScript, Vite · Style : atomic design + composables · Entrée : `src/main.ts`
Maj : 2026-09-14 (commit bb62c6a)

## Vue d'ensemble
Frontend de consultation de la base de données Dofus Rétro. Interface Vue 3 avec pages d'authentification, recherche d'items, browse de crafts, et gestion d'inventaire. Architecture atomique : atomes (UI bruts) → molécules (composants combinés) → pages (routes). Composables pour logique réutilisable (recherche, auth, inventaire).

## Carte
```
src/
├── components/      → atomic design (atoms/, molecules/, pages/) [ARCHITECTURE.md]
├── composables/     → logique métier réutilisable (search, inventory, auth)
├── services/        → appels API (fetch, gestion tokens)
├── entities/        → types/modèles (Item, Craft, Account)
├── types/           → interfaces TypeScript globales
├── constants/       → valeurs statiques (API URLs, thèmes)
├── App.vue          → racine SPA, routing
├── main.ts          → bootstrap Vue + Vite
└── style.css        → styles globaux

docs/                → INDEX.md (components, adr, business-rules, bugs, guides)
```

## Flux principaux
- Navigation : `App.vue` → routes → Pages chargent composables/services
- Authentification : LoginPage → service.login() → token stocké → protège routes
- Recherche items : ItemSearchPage → composable useItemSearch → API endpoint /items/search → ItemSearchResults
- Détails craft : ItemDetailsPage → useCraft() → affiche CraftDetails + materiel requis

## Conventions locales
- **Atomic design** : atoms (QuantityInput, ItemSprite), molecules (CraftDetails, ItemSearchForm), pages (ItemDetailsPage)
- **Composables** : une par domaine logique (`useSearch`, `useInventory`, `useAuth`)
- **Pas de style inline** : Tailwind classes + `<style>` scoped si besoin
- **Props typées** : interface ou type champ par champ, jamais `any`

## Commandes
- Dev : `npm run dev` · Lint : `npm run lint` · Build : `npm run build` (SSG Vite)

## Où chercher
| Je cherche… | Dossier / fichier |
|---|---|
| un composant | `docs/components/INDEX.md` puis `src/components/{atoms,molecules,pages}/…` |
| la logique recherche | `src/composables/useItemSearch.ts` |
| l'API backend | `src/services/…` |
| une page route | `src/components/pages/…` |
