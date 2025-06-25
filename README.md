# Projet Nest Chat Websocket

## Description
Application de chat en temps réel :
- Back-end en **NestJS + Prisma**  
- Front-end en **NextJS + Shadcn + TailwindCSS 4.0**

---

## Prérequis
- Node.js
- Docker & Docker Compose
- Accès aux fichiers `.env` pour `/back` et `/front`

---

## Installation

### 1. Vérification des fichiers `.env`
Assurez-vous que les fichiers `.env` sont présents :
- `/back/.env`
- `/front/.env`

---

## Commandes utiles
### 1. Installation & Lancement du **Back-end**

Installation des dépendences : 
```bash
npm install
```

Générer une migration Prisma :
```bash 
npx prisma migrate dev --name nom_de_ma_nouvelle_migration
```

Utiliser la dernière migration :
```bash 
npx prisma db push
```

Lancer l'infrastructure Docker :
```bash
docker compose up -d --build
```

Ouvrir Prisma Studio pour visualiser la DB :
```bash
npx prisma studio
```

Démarrer le serveur NestJS en mode développement :
```bash
npm run start:dev
```

### 2. Installation & Lancement du **Front-end**
Installation des dépendences :
```bash
npm install
```

Démarrer next.js :
```bash
npm run dev
```
