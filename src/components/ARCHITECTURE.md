# src/components/ — Atomic design components
Maj : 2026-09-14

## Contenu
- `atoms/` — UI élémentaires réutilisables (14 composants) [ARCHITECTURE.md]
- `molecules/` — composants combinés (15 composants) [ARCHITECTURE.md]
- `pages/` — routes/pages (7 composants)

## Règles du dossier
- **Atoms** : props minimalistes, pas de logique, réutilisables partout
- **Molecules** : composent des atoms, contiennent logique simple (affichage, validation)
- **Pages** : routes complètes, orchestrent composables + molecules
- **Props typées** : jamais de `any`, interfaces/types explicites
- **Pas de style inline** : Tailwind + `<style>` scoped

## Points d'entrée
- Atoms : chaque UI brut (bouton, input, card)
- Molecules : composants métier (formulaires, listes, détails)
- Pages : `src/components/pages/*Page.vue` — routes de l'app
