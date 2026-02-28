# 🚗 SmartParkTN Frontend - Angular

Application web moderne pour la gestion intelligente de parking, connectée au backend Node.js.

## 📋 Prérequis

- Node.js v18+
- Angular CLI v16+
- Backend SmartParkTN en cours d'exécution sur `http://localhost:5000`

## 🚀 Installation

```bash
cd smartparktn-frontend
npm install
```

## 🏃 Démarrage

```bash
# Mode développement
ng serve

# Ou avec npm
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 📁 Structure du Projet

```
src/app/
├── core/
│   └── services/
│       └── parking.service.ts      # Service API centralisé
│
├── features/
│   ├── dashboard/                  # Dashboard avec stats temps réel
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.scss
│   │
│   ├── history/                    # Historique paginé avec filtres
│   │   ├── history.component.ts
│   │   ├── history.component.html
│   │   └── history.component.scss
│   │
│   └── vehicle-detail/             # Détails d'un véhicule
│       ├── vehicle-detail.component.ts
│       ├── vehicle-detail.component.html
│       └── vehicle-detail.component.scss
│
├── shared/                         # Composants partagés (à venir)
├── app-routing.module.ts           # Configuration des routes
└── app.module.ts                   # Module principal
```

## 🎯 Fonctionnalités

### 1. Dashboard (`/dashboard`)
- ✅ Véhicules actuellement dans le parking
- ✅ Recettes du jour en temps réel
- ✅ Nombre d'entrées aujourd'hui
- ✅ Nombre de refus aujourd'hui
- ✅ Rafraîchissement automatique toutes les 30 secondes
- ✅ Design responsive avec Angular Material Cards

### 2. Historique (`/history`)
- ✅ Tableau paginé avec MatTable
- ✅ Recherche par numéro de plaque
- ✅ Pagination avec MatPaginator (5, 10, 25, 50 entrées)
- ✅ Affichage du statut (Autorisé/Refusé)
- ✅ Durée et montant calculés
- ✅ Navigation vers les détails du véhicule

### 3. Détail Véhicule (`/vehicle/:plate`)
- ✅ Statistiques du véhicule (total visites, total payé)
- ✅ Statut actuel (dans le parking ou non)
- ✅ Historique complet des entrées/sorties
- ✅ Détails de chaque visite (entrée, sortie, durée, montant, règle)
- ✅ Interface accordion pour navigation facile

## 🔌 API Backend

Le service `ParkingService` communique avec le backend via :

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/dashboard` | GET | Statistiques en temps réel |
| `/api/history` | GET | Historique paginé |
| `/api/entry` | POST | Enregistrer une entrée |
| `/api/exit` | POST | Enregistrer une sortie |

## 🎨 Technologies Utilisées

- **Angular 16** - Framework frontend
- **Angular Material** - Composants UI
- **RxJS** - Programmation réactive
- **TypeScript** - Langage typé
- **SCSS** - Styles avancés

## 🎨 Thème Angular Material

- Thème : Indigo-Pink
- Typographie : Activée
- Animations : Activées

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à :
- 📱 Mobile (< 768px)
- 💻 Tablette (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔧 Configuration

### Changer l'URL du Backend

Modifier dans `src/app/core/services/parking.service.ts` :

```typescript
private baseUrl = 'http://localhost:5000/api';
```

### Changer le port de développement

Dans `angular.json`, section `serve` :

```json
"options": {
  "port": 4200
}
```

## 🧪 Tests

```bash
# Tests unitaires
ng test

# Tests e2e
ng e2e

# Build de production
ng build --configuration production
```

## 📦 Build de Production

```bash
ng build --configuration production
```

Les fichiers seront générés dans `dist/smartparktn-frontend/`

## 🚀 Déploiement

### Avec un serveur web statique

```bash
ng build --configuration production
# Copier le contenu de dist/ vers votre serveur
```

### Avec Docker

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/smartparktn-frontend /usr/share/nginx/html
EXPOSE 80
```

## 🎯 Prochaines Étapes (Step 3+)

- [ ] Module Chat IA
- [ ] Intégration ALPR (reconnaissance de plaques)
- [ ] Notifications en temps réel (WebSocket)
- [ ] Gestion des utilisateurs et authentification
- [ ] Rapports et statistiques avancées
- [ ] Mode sombre

## 🐛 Dépannage

### Erreur CORS

Si vous rencontrez des erreurs CORS, vérifiez que le backend autorise `http://localhost:4200` dans la configuration CORS.

### Backend non accessible

Vérifiez que le backend est bien démarré sur `http://localhost:5000` :

```bash
cd ../smartparktn-backend
npm run dev
```

### Erreur de compilation Angular Material

Réinstallez Angular Material :

```bash
ng add @angular/material
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez que le backend est démarré
2. Vérifiez la console du navigateur (F12)
3. Vérifiez les logs du serveur Angular

## 🎉 Félicitations !

Le frontend SmartParkTN Step 2 est complet et fonctionnel ! 🚀

Vous avez maintenant :
- ✅ Une interface moderne et responsive
- ✅ Un dashboard en temps réel
- ✅ Un historique interactif
- ✅ Des détails véhicule complets
- ✅ Une architecture propre et scalable

**Frontend prêt pour l'intégration avec l'IA ! ✨**
