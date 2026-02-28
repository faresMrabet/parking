# 🚀 Guide de Déploiement Vercel - SmartParkTN

## 📋 Prérequis

- Compte Vercel (gratuit) : https://vercel.com/signup
- Vercel CLI installé : `npm install -g vercel`
- Repository GitHub : https://github.com/faresMrabet/parking.git

---

## 🔧 Étape 1 : Déployer le Backend

### Via Vercel CLI

```bash
cd smartparktn-backend
vercel
```

Suivre les instructions :
1. Set up and deploy? **Y**
2. Which scope? **Votre compte**
3. Link to existing project? **N**
4. Project name? **smartparktn-backend**
5. Directory? **./smartparktn-backend** (ou `.` si déjà dans le dossier)
6. Override settings? **N**

### Via Vercel Dashboard

1. Aller sur https://vercel.com/new
2. Importer le repository GitHub : `faresMrabet/parking`
3. Configurer le projet :
   - **Framework Preset:** Other
   - **Root Directory:** `smartparktn-backend`
   - **Build Command:** `npm install`
   - **Output Directory:** `.`
   - **Install Command:** `npm install`

4. **Variables d'environnement** (Settings → Environment Variables) :
   ```
   PORT=5000
   PLATE_RECOGNIZER_API_KEY=votre_cle_api_ici
   MONGO_URI=votre_mongodb_uri_ici (optionnel)
   ```

5. Cliquer sur **Deploy**

### Récupérer l'URL du Backend

Après déploiement, noter l'URL :
```
https://smartparktn-backend-xxx.vercel.app
```

---

## 🎨 Étape 2 : Déployer le Frontend

### Mettre à jour l'URL de l'API

Avant de déployer le frontend, mettre à jour l'URL du backend :

**Fichier:** `smartparktn-frontend/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://smartparktn-backend-xxx.vercel.app/api',  // ← URL du backend déployé
  // ... reste de la config
};
```

**Commit et push :**
```bash
git add .
git commit -m "chore: update backend URL for production"
git push origin main
```

### Via Vercel CLI

```bash
cd smartparktn-frontend
vercel
```

Suivre les instructions :
1. Set up and deploy? **Y**
2. Which scope? **Votre compte**
3. Link to existing project? **N**
4. Project name? **smartparktn-frontend**
5. Directory? **./smartparktn-frontend** (ou `.` si déjà dans le dossier)
6. Override settings? **N**

### Via Vercel Dashboard

1. Aller sur https://vercel.com/new
2. Importer le repository GitHub : `faresMrabet/parking`
3. Configurer le projet :
   - **Framework Preset:** Angular
   - **Root Directory:** `smartparktn-frontend`
   - **Build Command:** `npm run build:prod`
   - **Output Directory:** `dist/smartparktn-frontend`
   - **Install Command:** `npm install`

4. **Variables d'environnement** (optionnel) :
   ```
   NODE_ENV=production
   ```

5. Cliquer sur **Deploy**

### Récupérer l'URL du Frontend

Après déploiement, noter l'URL :
```
https://smartparktn-frontend-xxx.vercel.app
```

---

## ⚙️ Étape 3 : Configuration CORS

Le backend doit autoriser les requêtes depuis le frontend déployé.

**Fichier:** `smartparktn-backend/server-dev.js`

Mettre à jour la configuration CORS :

```javascript
const cors = require('cors');

// Configuration CORS
const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://smartparktn-frontend-xxx.vercel.app'  // ← URL du frontend déployé
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

**Commit et push :**
```bash
git add .
git commit -m "chore: update CORS for production"
git push origin main
```

Vercel redéploiera automatiquement le backend.

---

## 🧪 Étape 4 : Tester le Déploiement

### Backend

```bash
# Test santé
curl https://smartparktn-backend-xxx.vercel.app

# Test Assistant IA
curl https://smartparktn-backend-xxx.vercel.app/api/assistant/test

# Test Dashboard
curl https://smartparktn-backend-xxx.vercel.app/api/dashboard
```

### Frontend

1. Ouvrir : https://smartparktn-frontend-xxx.vercel.app
2. Tester les pages :
   - Dashboard : `/dashboard`
   - ALPR : `/alpr`
   - Assistant IA : `/assistant`
   - Historique : `/history`

---

## 🔒 Étape 5 : Sécurité

### Variables d'Environnement Vercel

**Backend :**
- `PORT` : 5000
- `PLATE_RECOGNIZER_API_KEY` : Votre clé API
- `MONGO_URI` : MongoDB connection string (optionnel)

**Frontend :**
- Aucune variable sensible côté frontend
- Les clés API doivent rester côté backend

### HTTPS

Vercel fournit automatiquement HTTPS pour tous les déploiements.

---

## 📊 Étape 6 : Monitoring

### Vercel Dashboard

- **Analytics** : Trafic, performance
- **Logs** : Logs en temps réel
- **Deployments** : Historique des déploiements

### Commandes Utiles

```bash
# Voir les logs en temps réel
vercel logs smartparktn-backend --follow

# Lister les déploiements
vercel ls

# Promouvoir un déploiement en production
vercel promote <deployment-url>

# Rollback
vercel rollback
```

---

## 🔄 Déploiement Continu

Vercel déploie automatiquement à chaque push sur `main`.

### Branches de Preview

Chaque branche crée un déploiement de preview :
```bash
git checkout -b feature/nouvelle-fonctionnalite
git push origin feature/nouvelle-fonctionnalite
```

Vercel créera automatiquement une URL de preview.

---

## 🐛 Dépannage

### Erreur de Build Frontend

```bash
# Tester le build localement
cd smartparktn-frontend
npm run build:prod
```

### Erreur de Build Backend

```bash
# Tester localement
cd smartparktn-backend
npm install
node server-dev.js
```

### CORS Errors

Vérifier que l'URL du frontend est dans la liste CORS du backend.

### Variables d'Environnement

Vérifier dans Vercel Dashboard → Settings → Environment Variables

---

## 📝 Checklist Finale

- [ ] Backend déployé sur Vercel
- [ ] Variables d'environnement backend configurées
- [ ] URL backend récupérée
- [ ] Frontend mis à jour avec URL backend
- [ ] Frontend déployé sur Vercel
- [ ] CORS configuré correctement
- [ ] Tests backend passés
- [ ] Tests frontend passés
- [ ] HTTPS actif
- [ ] Monitoring configuré

---

## 🎉 URLs Finales

**Backend API :**
```
https://smartparktn-backend-xxx.vercel.app
```

**Frontend App :**
```
https://smartparktn-frontend-xxx.vercel.app
```

**Repository GitHub :**
```
https://github.com/faresMrabet/parking
```

---

## 📞 Support

- Vercel Docs : https://vercel.com/docs
- Vercel Support : https://vercel.com/support
- GitHub Issues : https://github.com/faresMrabet/parking/issues

---

**Déploiement réussi ! 🚀**
