---
id: ADR-0002
titre: Atomic design (atoms/molecules/pages)
type: architecture
statut: acceptée
date: 2026-09-14
portee: repo
remplace: —
liens: []
---

# ADR-0002 — Atomic design

## Contexte
Composants Vue multiples sans structure de réutilisabilité = duplication, maintenance difficile. Atomic design = hiérarchie claire.

## Décision
Organiser composants par niveaux : atomes (UI élémentaires), molécules (atomes composés), pages (routes).

## Comment l'appliquer
- **Atoms** (`src/components/atoms/`) : QuantityInput, ItemSprite, SearchInput — pas de dépendances inter-atoms
- **Molecules** (`src/components/molecules/`) : CraftDetails, ItemSearchForm — composent des atoms, contiennent logique simple
- **Pages** (`src/components/pages/`) : ItemDetailsPage, CraftBrowsePage — routes, orchestrent composables + molecules

## Quand NE PAS l'appliquer / limites
- Utilitaires purs (format, validation) → `src/utilities/` ou composable
- Layout global → `App.vue` ou layout composable

## Alternatives rejetées
- Flat structure : perte de lisibilité à 30+ composants
- Feature-based : trop granulaire pour une app simple

## Conséquences
- Nouveau composant : créer dans bon dossier (atoms/molecules/pages)
- Tests : structure miroir `tests/components/atoms/…`

## Références
- Atomic Design book (Brad Frost)
- Voir ADR-0001 pour Vue conventions
