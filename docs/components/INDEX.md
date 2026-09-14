# Composants — dofus-retro-db

## Atoms (UI élémentaires, réutilisables)

| Composant | Chemin | Rôle |
|---|---|---|
| [CraftIngredientCard](./atoms/CraftIngredientCard.md) | `src/components/atoms/` | Affiche un ingrédient de craft (item + quantité) |
| [ItemCard](./atoms/ItemCard.md) | `src/components/atoms/` | Card article avec stats de base |
| [ItemSprite](./atoms/ItemSprite.md) | `src/components/atoms/` | Image sprite article animée |
| [ItemSpritePlaceholder](./atoms/ItemSpritePlaceholder.md) | `src/components/atoms/` | Placeholder gris avant load image |
| [MaterialInventoryInput](./atoms/MaterialInventoryInput.md) | `src/components/atoms/` | Input quantité + dropdown items |
| [MaterialRequirementCard](./atoms/MaterialRequirementCard.md) | `src/components/atoms/` | Affiche matériel requis pour craft |
| [QuantityInput](./atoms/QuantityInput.md) | `src/components/atoms/` | Input nombre + boutons +/- |
| [SearchInput](./atoms/SearchInput.md) | `src/components/atoms/` | Champ recherche items |
| [SkeletonBlock](./atoms/SkeletonBlock.md) | `src/components/atoms/` | Loading placeholder skeleton |
| [StarFavorite](./atoms/StarFavorite.md) | `src/components/atoms/` | Star toggle favori/not-favori |
| [StatDisplay](./atoms/StatDisplay.md) | `src/components/atoms/` | Badge stat item (dégâts, PA, etc.) |
| [StatIconPlaceholder](./atoms/StatIconPlaceholder.md) | `src/components/atoms/` | Icon stat placeholder |
| [ThemeToggle](./atoms/ThemeToggle.md) | `src/components/atoms/` | Toggle light/dark theme |
| [OrnateCorners](./atoms/OrnateCorners.md) | `src/components/atoms/` | Décoration coins ornés (design) |

## Molecules (Composants combinés)

| Composant | Chemin | Rôle |
|---|---|---|
| [AllMaterialsInventoryList](./molecules/AllMaterialsInventoryList.md) | `src/components/molecules/` | Liste tous les matériaux en inventaire |
| [CraftBrowseCard](./molecules/CraftBrowseCard.md) | `src/components/molecules/` | Card craft pour browse (nom, stats) |
| [CraftDetails](./molecules/CraftDetails.md) | `src/components/molecules/` | Détails complets craft (ingrédients, résultat) |
| [CraftingListEntry](./molecules/CraftingListEntry.md) | `src/components/molecules/` | Ligne craft en liste avec actions |
| [CraftingListItemWithIngredients](./molecules/CraftingListItemWithIngredients.md) | `src/components/molecules/` | Entrée craft détaillée + ingrédients |
| [Footer](./molecules/Footer.md) | `src/components/molecules/` | Footer page (liens, copyright) |
| [Header](./molecules/Header.md) | `src/components/molecules/` | Header app (logo, nav, user) |
| [InventoryEntry](./molecules/InventoryEntry.md) | `src/components/molecules/` | Ligne inventaire utilisateur |
| [ItemSearchForm](./molecules/ItemSearchForm.md) | `src/components/molecules/` | Formulaire recherche items |
| [ItemSearchResults](./molecules/ItemSearchResults.md) | `src/components/molecules/` | Affiche résultats recherche items |
| [ItemStatsList](./molecules/ItemStatsList.md) | `src/components/molecules/` | Liste stats item (badge array) |
| [MaterialRequirementsList](./molecules/MaterialRequirementsList.md) | `src/components/molecules/` | Liste matériaux requis craft |
| [MissingMaterialsQuickList](./molecules/MissingMaterialsQuickList.md) | `src/components/molecules/` | Affiche matériaux manquants craft |
| [NavDropdown](./molecules/NavDropdown.md) | `src/components/molecules/` | Dropdown menu navigation |
| [QuickSearchDropdown](./molecules/QuickSearchDropdown.md) | `src/components/molecules/` | Dropdown résultats recherche rapide |

## Pages (Routes)

| Composant | Chemin | Rôle |
|---|---|---|
| [CraftBrowsePage](./pages/CraftBrowsePage.md) | `src/components/pages/` | Browse liste crafts avec filtres |
| [CraftingListPage](./pages/CraftingListPage.md) | `src/components/pages/` | Gestion liste crafts utilisateur |
| [HomePage](./pages/HomePage.md) | `src/components/pages/` | Accueil app |
| [ItemDetailsPage](./pages/ItemDetailsPage.md) | `src/components/pages/` | Détails complets article + craft |
| [ItemSearchPage](./pages/ItemSearchPage.md) | `src/components/pages/` | Recherche items |
| [LoginPage](./pages/LoginPage.md) | `src/components/pages/` | Formulaire connexion |
| [RegisterPage](./pages/RegisterPage.md) | `src/components/pages/` | Formulaire inscription |
