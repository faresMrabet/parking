# 🚀 Guide de Démarrage Rapide - SmartParkTN Frontend

## 1️⃣ Prérequis

Assurez-vous que le backend est démarré :

```bash
cd smartparktn-backend
npm run dev
```

Le backend doit être accessible sur `http://localhost:5000`

## 2️⃣ Installation

```bash
cd smartparktn-frontend
npm install
```

## 3️⃣ Démarrage

```bash
ng serve
```

Ou avec npm :

```bash
npm start
```

L'application sera accessible sur : **http://localhost:4200**

## 4️⃣ Navigation

### Dashboard
- URL : `http://localhost:4200/dashboard`
- Affiche les statistiques en temps réel
- Rafraîchissement automatique toutes les 30 secondes

### Historique
- URL : `http://localhost:4200/history`
- Liste paginée de toutes les entrées/sorties
- Recherche par plaque
- Cliquez sur l'icône 👁️ pour voir les détails

### Détail Véhicule
- URL : `http://localhost:4200/vehicle/:plate`
- Exemple : `http://localhost:4200/vehicle/123TUN4567`
- Affiche l'historique complet d'un véhicule

## 5️⃣ Test Rapide

1. Ouvrez `http://localhost:4200`
2. Vous serez redirigé vers le Dashboard
3. Vérifiez que les statistiques s'affichent
4. Cliquez sur "Voir l'historique"
5. Recherchez une plaque (ex: `123TUN4567`)
6. Cliquez sur l'icône 👁️ pour voir les détails

## 🎨 Fonctionnalités Clés

### Dashboard
- 🚗 Véhicules présents
- 💰 Recettes du jour
- 📅 Entrées aujourd'hui
- 🚫 Refus aujourd'hui

### Historique
- 📋 Tableau paginé
- 🔍 Recherche par plaque
- 📄 Pagination (5, 10, 25, 50)
- 👁️ Détails par véhicule

### Détail Véhicule
- 📊 Statistiques (visites, montant total)
- 🚗 Statut actuel
- 📜 Historique complet
- 📝 Détails de chaque visite

## 🐛 Dépannage

### Le dashboard est vide

**Problème** : Aucune donnée ne s'affiche

**Solution** :
1. Vérifiez que le backend est démarré
2. Ouvrez la console du navigateur (F12)
3. Vérifiez les erreurs réseau
4. Testez l'API directement : `http://localhost:5000/api/dashboard`

### Erreur CORS

**Problème** : `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution** :
Le backend SmartParkTN a déjà CORS activé. Si le problème persiste :
1. Vérifiez que le backend utilise bien `cors()`
2. Redémarrez le backend
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

### Port 4200 déjà utilisé

**Problème** : `Port 4200 is already in use`

**Solution** :
```bash
# Utiliser un autre port
ng serve --port 4201
```

### Erreur de compilation

**Problème** : Erreurs TypeScript ou Angular

**Solution** :
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📱 Test sur Mobile

1. Trouvez votre IP locale :
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Démarrez avec l'option host :
   ```bash
   ng serve --host 0.0.0.0
   ```

3. Accédez depuis votre mobile :
   ```
   http://VOTRE_IP:4200
   ```

## 🔧 Commandes Utiles

```bash
# Démarrer le serveur de dev
ng serve

# Démarrer avec un port spécifique
ng serve --port 4201

# Démarrer et ouvrir le navigateur
ng serve --open

# Build de production
ng build --configuration production

# Lancer les tests
ng test

# Vérifier le code
ng lint
```

## ✅ Checklist de Validation

- [ ] Le backend est démarré sur port 5000
- [ ] Le frontend est démarré sur port 4200
- [ ] Le dashboard affiche les statistiques
- [ ] L'historique affiche les entrées
- [ ] La recherche par plaque fonctionne
- [ ] La pagination fonctionne
- [ ] Les détails véhicule s'affichent
- [ ] L'interface est responsive (testez en redimensionnant)

## 🎯 Scénario de Test Complet

1. **Dashboard**
   - Ouvrez `http://localhost:4200`
   - Vérifiez les 4 cartes de statistiques
   - Attendez 30 secondes pour voir le rafraîchissement auto

2. **Historique**
   - Cliquez sur "Voir l'historique"
   - Vérifiez que le tableau s'affiche
   - Testez la pagination
   - Recherchez "123TUN4567"
   - Cliquez sur l'icône 👁️

3. **Détail Véhicule**
   - Vérifiez les statistiques du véhicule
   - Vérifiez l'historique complet
   - Cliquez sur "Retour"

4. **Navigation**
   - Utilisez le menu en haut
   - Testez Dashboard ↔ Historique
   - Vérifiez que l'URL change

## 🚀 Prêt pour la Production

Une fois que tout fonctionne :

```bash
# Build optimisé
ng build --configuration production

# Les fichiers sont dans dist/smartparktn-frontend/
```

Bon développement ! 🎉
