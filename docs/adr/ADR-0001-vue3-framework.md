---
id: ADR-0001
titre: Vue 3 + TypeScript pour le frontend
type: librairie
statut: acceptée
date: 2026-09-14
portee: repo
remplace: —
liens: []
---

# ADR-0001 — Vue 3 framework

## Contexte
Interface SPA pour consultation DB Dofus Rétro. Vue 3 + TS offre réactivité native, composants typés, et outillage mature (Vite).

## Décision
Vue 3 (Composition API) + TypeScript pour le frontend. Vite comme bundler (hot-reload dev, build optimisé prod).

## Comment l'appliquer
- Composants : fichiers `.vue` avec `<script setup>` TypeScript
- Props/emits : interfaces ou types explicites, jamais `any`
- Réactivité : `ref()`, `reactive()`, `computed()`, `watch()` de `@vue/composition-api`
- Composables : fichier `use*.ts` pour logique réutilisable

## Quand NE PAS l'appliquer / limites
- State global lourd → Pinia (pour états partagés complexes, non utilisé ici)
- SSR : Vite défaut = CSR uniquement (suffisant pour DB viewer)

## Alternatives rejetées
- React : apprendre courbe, JSX moins lisible pour consult UI
- Svelte : écosystème moins mature que Vue

## Conséquences
- Nouveau composant → fichier `.vue` + script setup typé
- Tests composants : Vitest + @vue/test-utils

## Références
- Vue 3 docs : https://vuejs.org
- Vite : https://vitejs.dev
