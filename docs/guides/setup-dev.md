# Setup développement — dofus-retro-db

## Prérequis

- Node.js 20 LTS
- API backend dofus-db-retro-api runligne (voir `J:/Dev/Projects/orga/global/products/dofus/dofus-db-retro-api/docs/guides/setup-dev.md`)

## Installation

```bash
npm install
```

## Développement

```bash
# Serveur Vite avec hot-reload
npm run dev

# URL locale : http://localhost:5173
```

### Variables d'env (`.env.local`, non commité)
```
VITE_API_URL=http://localhost:3000
```

## Build & Tests

```bash
# Compiler TypeScript + build Vite
npm run build

# Linter Biome
npm run lint

# Tests unitaires
npm test

# Preview build prod
npm run preview
```

## Architecture

Voir `ARCHITECTURE.md` et `docs/components/INDEX.md` pour structure des composants (atoms/molecules/pages).

## Troubleshooting

### API CORS errors
Vérifier que dofus-db-retro-api tourne sur `localhost:3000` et CORS activé (voir CLAUDE.md API).

### Hot-reload stalled
Tuer `npm run dev`, relancer.

### Node version incompatibility
Vérifier `node --version` = 20.x LTS.
