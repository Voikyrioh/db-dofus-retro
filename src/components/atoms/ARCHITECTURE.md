# src/components/atoms/ — UI élémentaires
Maj : 2026-09-14

## Contenu
- 14 composants d'UI minimaliste : inputs, cards, images, displays, toggles
- CraftIngredientCard, ItemCard, ItemSprite, ItemSpritePlaceholder, MaterialInventoryInput, MaterialRequirementCard, QuantityInput, SearchInput, SkeletonBlock, StarFavorite, StatDisplay, StatIconPlaceholder, ThemeToggle, OrnateCorners

## Règles du dossier
- Composants réutilisables sans métier
- Props simples, pas de composables ni services
- Styling Tailwind + scoped CSS si besoin
- Pas d'événements complexes (v-model ou simple emit)

## Points d'entrée
- Chaque atom = composant isolé avec une seule responsabilité
