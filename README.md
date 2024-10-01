# SIGL

## Repository
- Nom des commits en Français
- Branche principale: `prod`

## Codebase
- Commentaires en Français
- Code en Anglais
- Attention au Franglais !

## ⌨ Développement

### Prérequis
- Node.js 18 minimum (https://nodejs.org/)
- PNPM 9.0 minimum (https://pnpm.io/)
- Base de données PostgreSQL 14 minimum soit via :
  - Docker
  - pgAdmin

### Lancement
1. Installer les dépendances: `pnpm install`
1. Lancer la base de données PostgreSQL
   - Via Docker: `pnpm run db:up`
   - Via pgAdmin: Débrouille toi
   - Rends toi dans `/packages/database` et exécute `pnpm run db:migrate` pour mettre à jour la base
1. Copier le fichier `apps/server/.env.example` et le renommer en `apps/server/.env` et adapter les variables d'environnement à votre machine
1. Copier le fichier `apps/client/.env.example` et le renommer en `apps/client/.env` et adapter les variables d'environnement à votre machine
1. Lancer le projet: `pnpm run dev`
