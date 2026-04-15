# Dofus Retro DB — Refonte Graphique Complète

**Date:** 2026-04-15
**Branche:** feat/redesign-graphique
**Statut:** Implémenté

---

## Objectif

Remplacer l'interface générique (thème Bootstrap gris/bleu) par une identité visuelle fidèle à Dofus Retro : couleurs parchemin doré, typographie Nunito, navigation double barre, cadres ornementaux, mode sombre.

---

## Décisions de Design

| Aspect | Décision |
|--------|----------|
| Palette | Parchemin doré (beige/sable/ocre/brun) |
| Navigation | Double barre (Convertio-style) : top + onglets |
| Listes | Mode hybride liste+panneau 360px/1fr (ItemSearch, CraftBrowse) |
| Accueil | Hero+tuiles (non-connecté) / Dashboard (connecté) |
| Typographie | Nunito (Google Fonts, 400/600/700/800) |
| Décoration | Cadres ornementaux (`.card-ornate` + `OrnateCorners.vue`) |
| Thèmes | Light (parchemin clair) + Dark (brun profond/ocre) |

---

## Système de Couleurs

### Light Theme — "Parchemin"

```css
--color-bg-base:      #f5e6c8;   /* fond principal */
--color-bg-surface:   #ede0c0;   /* fond carte */
--color-bg-elevated:  #e8d5a3;   /* fond carte élevée */
--color-bg-nav:       #3d2b0f;   /* fond nav bas */
--color-bg-nav-top:   #2a1f0e;   /* fond nav haut */

--color-text-primary:   #2a1507;
--color-text-secondary: #6b4c0f;
--color-text-muted:     #8b6914;
--color-text-nav:       #8b7040;
--color-text-nav-active:#d4a85c;

--color-border:        #c9a85c;
--color-border-accent: #8b6914;
--color-border-corner: #d4a85c;

--color-accent:        #d4a85c;
--color-accent-hover:  #c9975a;

--color-success:       #3a6b20;
--color-error:         #8b1a1a;
```

### Dark Theme — "Monde des Douze"

```css
--color-bg-base:      #1f150a;
--color-bg-surface:   #2e1e0e;
--color-bg-elevated:  #3d2b0f;
--color-bg-nav:       #1a0f06;
--color-bg-nav-top:   #120a04;

--color-text-primary:   #f5e6c8;
--color-text-secondary: #c9a85c;
--color-text-muted:     #8b7040;

--color-accent:        #d4a85c;
--color-accent-hover:  #e8b86a;
--color-success:       #5a9b38;
--color-error:         #c04040;
```

---

## Typographie

**Police** : Nunito (chargée depuis `index.html` via Google Fonts)
**Poids** : 400, 600, 700, 800

---

## Architecture Composants

### Atoms (nouveaux)
- `OrnateCorners.vue` — 4 coins en L absolus (décoration des cartes)
- `ThemeToggle.vue` — bouton ☀/🌙 (toggle dark mode)
- `StarFavorite.vue` — étoile favoris (localStorage)

### Composables (nouveaux)
- `useTheme.ts` — gestion dark mode, persistence localStorage, classe `.dark` sur `<html>`
- `useFavorites.ts` — liste de favoris en localStorage
- `useQuicksearch.ts` — état et logique du quicksearch dans le header

### Molecules (nouveaux)
- `NavDropdown.vue` — sous-menu de navigation (hover/click)
- `QuickSearchDropdown.vue` — dropdown de recherche rapide dans le header

---

## Navigation Double Barre

**Barre top** (`bg-nav-top`) :
- Logo + titre "Dofus Retro DB"
- `QuickSearchDropdown` (recherche rapide avec résultats)
- `ThemeToggle`
- `SelectLang`
- Connexion/profil

**Barre onglets** (`bg-nav`) :
- Accueil
- Base de données ▾ → Objets / Recettes / Monstres (désactivé)
- Outils ▾ → Ma liste de craft (si connecté)
- Mon compte (si non-connecté : Connexion | Inscription)

---

## Layouts de Pages

### ItemSearchPage & CraftBrowsePage
```
grid-template-columns: 360px 1fr
```
- Gauche : panneau sticky avec liste scrollable
- Droite : détail de l'élément sélectionné (`.card-ornate`)

### CraftingListPage
```
grid-template-columns: 1fr 1fr
```
- Gauche : liste des crafts à réaliser
- Droite : inventaire des matériaux

### LoginPage & RegisterPage
- Carte centrée max-width 420px
- Fond : gradient hero brun foncé

---

## Composant `.card-ornate`

```css
.card-ornate {
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border-accent);
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px var(--color-bg-base), 0 2px 6px rgba(0,0,0,0.12);
  position: relative;
}
```

`OrnateCorners.vue` injecte 4 `<span aria-hidden="true">` aux coins du conteneur.

---

## Gestion du Thème

```typescript
// useTheme.ts
const isDark = ref(getInitialDark()) // localStorage → prefers-color-scheme fallback
applyTheme(isDark.value) // classe .dark sur document.documentElement
```

Toggle exposé via `useTheme().toggleTheme()`.

---

## Fichiers Modifiés

| Fichier | Nature |
|---------|--------|
| `src/style.css` | Tokens CSS complets light+dark, composants globaux |
| `index.html` | Import Nunito + suppression dark class initiale |
| `src/App.vue` | Routes + `navigateToItemSearch` |
| `src/components/molecules/Header.vue` | Double barre, dropdowns, quicksearch |
| `src/components/molecules/Footer.vue` | Restyling tokens |
| `src/components/pages/HomePage.vue` | Hero+tuiles / Dashboard |
| `src/components/pages/ItemSearchPage.vue` | Mode hybride 360px/1fr |
| `src/components/pages/CraftBrowsePage.vue` | Mode hybride 360px/1fr |
| `src/components/pages/CraftingListPage.vue` | Restyling ornamental |
| `src/components/pages/LoginPage.vue` | Carte centrée ornementale |
| `src/components/pages/RegisterPage.vue` | Carte centrée ornementale |
| Tous atoms/molecules | Migration vers `var(--color-*)` |
