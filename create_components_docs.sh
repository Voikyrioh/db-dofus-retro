#!/bin/bash

# Atoms
declare -a atoms=(
  "CraftIngredientCard:Affiche un ingrédient de craft"
  "ItemCard:Card article avec stats de base"
  "ItemSprite:Image sprite article animée"
  "ItemSpritePlaceholder:Placeholder gris avant load image"
  "MaterialInventoryInput:Input quantité + dropdown items"
  "MaterialRequirementCard:Affiche matériel requis"
  "QuantityInput:Input nombre + boutons +/-"
  "SearchInput:Champ recherche items"
  "SkeletonBlock:Loading placeholder skeleton"
  "StarFavorite:Star toggle favori"
  "StatDisplay:Badge stat item"
  "StatIconPlaceholder:Icon stat placeholder"
  "ThemeToggle:Toggle light/dark theme"
  "OrnateCorners:Décoration coins ornés"
)

# Molecules
declare -a molecules=(
  "AllMaterialsInventoryList:Liste tous matériaux inventaire"
  "CraftBrowseCard:Card craft pour browse"
  "CraftDetails:Détails complets craft"
  "CraftingListEntry:Ligne craft en liste"
  "CraftingListItemWithIngredients:Entrée craft + ingrédients"
  "Footer:Footer page"
  "Header:Header app"
  "InventoryEntry:Ligne inventaire utilisateur"
  "ItemSearchForm:Formulaire recherche items"
  "ItemSearchResults:Affiche résultats recherche"
  "ItemStatsList:Liste stats item"
  "MaterialRequirementsList:Liste matériaux requis"
  "MissingMaterialsQuickList:Affiche matériaux manquants"
  "NavDropdown:Dropdown menu navigation"
  "QuickSearchDropdown:Dropdown résultats recherche"
)

# Pages
declare -a pages=(
  "CraftBrowsePage:Browse liste crafts"
  "CraftingListPage:Gestion liste crafts"
  "HomePage:Accueil app"
  "ItemDetailsPage:Détails complets article"
  "ItemSearchPage:Recherche items"
  "LoginPage:Formulaire connexion"
  "RegisterPage:Formulaire inscription"
)

create_component_doc() {
  local name=$1
  local desc=$2
  local dir=$3
  local path="docs/components/${dir}/${name}.md"
  
  cat > "$path" << EOFCONTENT
# ${name}

Chemin : \`src/components/${dir}/${name}.vue\`

## Rôle
${desc}

## Props
Voir le composant source pour les props exactes.

## Événements
Voir le composant source pour les événements émis.

## Usage
Intégré dans les molécules ou pages du domaine concerné (recherche, craft, inventaire, auth).
EOFCONTENT
}

for item in "${atoms[@]}"; do
  IFS=':' read -r name desc <<< "$item"
  create_component_doc "$name" "$desc" "atoms"
done

for item in "${molecules[@]}"; do
  IFS=':' read -r name desc <<< "$item"
  create_component_doc "$name" "$desc" "molecules"
done

for item in "${pages[@]}"; do
  IFS=':' read -r name desc <<< "$item"
  create_component_doc "$name" "$desc" "pages"
done

echo "Created all component docs"
