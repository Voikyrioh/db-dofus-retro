# src/components/molecules/ — Composants combinés
Maj : 2026-09-14

## Contenu
- 15 composants métier : formulaires, listes, détails, recherche
- Composent des atoms, utilisent composables (search, inventory, craft)
- AllMaterialsInventoryList, CraftBrowseCard, CraftDetails, CraftingListEntry, CraftingListItemWithIngredients, Footer, Header, InventoryEntry, ItemSearchForm, ItemSearchResults, ItemStatsList, MaterialRequirementsList, MissingMaterialsQuickList, NavDropdown, QuickSearchDropdown

## Règles du dossier
- Composent des atoms + composables réutilisables
- Logique métier légère (filtrage, tri, affichage)
- Événements simples pour remonter actions aux pages
- Pas d'appels API directs (utiliser services via composables)

## Points d'entrée
- Chaque molecule = domaine fonctionnel (search, craft, inventory)
