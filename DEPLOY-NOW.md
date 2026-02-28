# 🚀 Déployer SmartParkTN sur Vercel - Guide Rapide

## Option 1 : Via Vercel Dashboard (Recommandé)

### 1. Créer un compte Vercel
👉 https://vercel.com/signup

### 2. Importer le projet depuis GitHub

1. Aller sur https://vercel.com/new
2. Cliquer sur "Import Git Repository"
3. Connecter votre compte GitHub
4. Sélectionner le repository : `faresMrabet/parking`

### 3. Déployer le Backend

**Configuration :**
- **Project Name:** `smartparktn-backend`
- **Framework Preset:** Other
- **Root Directory:** `smartparktn-backend`
- **Build Command:** (laisser vide)
- **Output Directory:** (laisser vide)
- **Install Command:** `npm install`

**Environment Variables :**
```
PORT=5000
PLATE_RECOGNIZER_API_KEY=1bccb8bf6ee789d1d688fdb23ed89d903c1f55ad
MONGO_URI=mongodb+srv://faresmrabet09_db_user:fares@cluster0.zbtgwb5.mongodb.net/parkingConnect?retryWrites=true&w=majority
```

Cliquer sur **Deploy** ✅

**URL Backend :** Copier l'URL générée (ex: `https://smartparktn-backend-xxx.vercel.app`)

### 4. Mettre à jour le Frontend avec l'URL Backend

**Fichier:** `smartparktn-frontend/src/environments/environment.prod.ts`

Remplacer :
```typescript
apiUrl: 'https://your-backend-url.vercel.app/api'
```

Par :
```typescript
apiUrl: 'https://smartparktn-backend-xxx.vercel.app/api'  // ← Votre URL backend
```

**Commit et push :**
```bash
git add smartparktn-frontend/src/environments/environment.prod.ts
git commit -m "chore: update backend URL for production"
git push origin main
```

### 5. Déployer le Frontend

**Configuration :**
- **Project Name:** `smartparktn-frontend`
- **Framework Preset:** Angular
- **Root Directory:** `smartparktn-frontend`
- **Build Command:** `npm run build:prod`
- **Output Directory:** `dist/smartparktn-frontend`
- **Install Command:** `npm install`

Cliquer sur **Deploy** ✅

**URL Frontend :** Copier l'URL générée (ex: `https://smartparktn-frontend-xxx.vercel.app`)

### 6. Mettre à jour CORS Backend

**Fichier:** `smartparktn-backend/server-dev.js`

Ajouter l'URL du frontend dans CORS :
```javascript
const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://smartparktn-frontend-xxx.vercel.app'  // ← Votre URL frontend
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

**Commit et push :**
```bash
git add smartparktn-backend/server-dev.js
git commit -m "chore: update CORS for production"
git push origin main
```

Vercel redéploiera automatiquement le backend.

---

## Option 2 : Via Vercel CLI

### 1. Installer Vercel CLI
```bash
npm install -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Déployer Backend
```bash
cd smartparktn-backend
vercel --prod
```

Suivre les instructions et configurer les variables d'environnement.

### 4. Déployer Frontend
```bash
cd smartparktn-frontend
vercel --prod
```

---

## ✅ Vérification

### Backend
```bash
curl https://smartparktn-backend-xxx.vercel.app
curl https://smartparktn-backend-xxx.vercel.app/api/assistant/test
```

### Frontend
Ouvrir dans le navigateur :
```
https://smartparktn-frontend-xxx.vercel.app
```

Tester :
- Dashboard : `/dashboard`
- ALPR : `/alpr`
- Assistant IA : `/assistant`
- Historique : `/history`

---

## 🎯 URLs Finales

**Backend API :**
```
https://smartparktn-backend-xxx.vercel.app
```

**Frontend App :**
```
https://smartparktn-frontend-xxx.vercel.app
```

**GitHub Repository :**
```
https://github.com/faresMrabet/parking
```

---

## 📝 Notes Importantes

### HTTPS pour Caméra
Vercel fournit automatiquement HTTPS, nécessaire pour accéder à la caméra dans le navigateur.

### Déploiement Automatique
Chaque push sur `main` déclenche un redéploiement automatique.

### Variables d'Environnement
Les variables sensibles (clés API) sont stockées de manière sécurisée dans Vercel.

### Logs
Voir les logs en temps réel dans Vercel Dashboard → Deployments → Logs

---

## 🐛 Problèmes Courants

### Build Failed
- Vérifier les logs dans Vercel Dashboard
- Tester le build localement : `npm run build:prod`

### CORS Error
- Vérifier que l'URL frontend est dans la config CORS backend
- Redéployer le backend après modification

### API Not Found
- Vérifier que l'URL backend est correcte dans `environment.prod.ts`
- Vérifier que le backend est bien déployé

---

## 🎉 C'est Fait !

Votre application SmartParkTN est maintenant déployée et accessible en ligne ! 🚀

**Prochaines étapes :**
1. Tester toutes les fonctionnalités
2. Configurer un domaine personnalisé (optionnel)
3. Activer les analytics Vercel
4. Monitorer les performances

---

**Besoin d'aide ?**
- Documentation Vercel : https://vercel.com/docs
- Support : https://vercel.com/support
