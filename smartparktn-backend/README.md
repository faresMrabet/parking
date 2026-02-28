# 🚗 SmartParkTN Backend - Step 1

Backend Node.js + Express + MongoDB Atlas pour la gestion intelligente de parking.

## 📋 Prérequis

- Node.js v18+
- MongoDB Atlas (compte gratuit)
- Postman ou Insomnia pour les tests

## 🚀 Installation

```bash
cd smartparktn-backend
npm install
```

## ⚙️ Configuration

1. Modifier le fichier `.env` avec votre URI MongoDB Atlas :
```
MONGO_URI=mongodb+srv://votre_user:<MOT_DE_PASSE>@cluster0.xxxxx.mongodb.net/parkingConnect?retryWrites=true&w=majority
PORT=5000
```

2. Remplacer `<MOT_DE_PASSE>` par votre mot de passe MongoDB

## 🏃 Démarrage

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📡 Endpoints API

### POST /api/entry
Enregistrer l'entrée d'un véhicule

**Body:**
```json
{
  "plateNumber": "123TUN4567"
}
```

**Réponse (autorisé):**
```json
{
  "plateNumber": "123TUN4567",
  "status": "authorized",
  "entryTime": "2026-02-27T20:30:00.000Z",
  "vehicleType": "Visiteur"
}
```

**Réponse (refusé - blacklisté):**
```json
{
  "plateNumber": "123TUN4567",
  "status": "refused",
  "reason": "Véhicule blacklisté"
}
```

### POST /api/exit
Enregistrer la sortie d'un véhicule et calculer le tarif

**Body:**
```json
{
  "plateNumber": "123TUN4567"
}
```

**Réponse:**
```json
{
  "plateNumber": "123TUN4567",
  "entryTime": "2026-02-27T20:30:00.000Z",
  "exitTime": "2026-02-27T23:45:00.000Z",
  "duration": 3.25,
  "amount": 1.25,
  "ruleApplied": "2h gratuites puis 1 TND/heure",
  "status": "authorized"
}
```

### GET /api/dashboard
Statistiques du parking

**Réponse:**
```json
{
  "vehiclesInParking": 5,
  "todayRevenue": 45.50,
  "todayEntries": 23,
  "todayRefused": 2,
  "date": "2026-02-27T22:00:00.000Z"
}
```

### GET /api/history
Historique des entrées/sorties (paginé)

**Query params:** `?limit=50&page=1`

**Réponse:**
```json
{
  "entries": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

## 🧪 Tests avec Postman

1. Créer une nouvelle collection "SmartParkTN"
2. Tester POST /api/entry avec différentes plaques
3. Tester POST /api/exit pour calculer les tarifs
4. Vérifier GET /api/dashboard
5. Consulter GET /api/history

## 📊 Logique Tarifaire

- **2 premières heures:** Gratuites
- **Heures supplémentaires:** 1 TND/heure
- **VIP:** Gratuit (si configuré)
- **Blacklistés:** Refusés automatiquement

## 🗂️ Structure du Projet

```
smartparktn-backend/
├── config/
│   └── db.js              # Configuration MongoDB
├── models/
│   ├── Vehicle.js         # Modèle véhicule
│   ├── Entry.js           # Modèle entrée/sortie
│   └── Tariff.js          # Modèle tarification
├── controllers/
│   ├── parkingController.js    # Logique entry/exit
│   └── dashboardController.js  # Logique dashboard/history
├── routes/
│   └── parkingRoutes.js   # Routes API
├── utils/
│   └── helpers.js         # Fonctions utilitaires
├── .env                   # Variables d'environnement
├── .gitignore
├── server.js              # Point d'entrée
└── package.json

```

## ✅ Livrables Step 1

- ✅ Backend Node.js fonctionnel
- ✅ Connexion MongoDB Atlas
- ✅ Modèles et collections créés
- ✅ Routes /entry et /exit opérationnelles
- ✅ Logique métier (blacklist, tarifs)
- ✅ JSON prêt pour Angular et IA

## 🔜 Prochaines étapes

- Step 2: Frontend Angular
- Step 3: Intégration ALPR (reconnaissance de plaques)
- Step 4: IA pour prédictions et optimisations
