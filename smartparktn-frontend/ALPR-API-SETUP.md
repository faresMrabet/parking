# 🔧 Configuration API ALPR - Guide Complet

## 🎯 Objectif
Configurer une API de reconnaissance de plaques pour détecter automatiquement les plaques tunisiennes via webcam.

---

## 📋 Options Disponibles

### Option 1: Plate Recognizer (Recommandé) ⭐

**Avantages**:
- ✅ 2500 appels gratuits/mois
- ✅ Excellente précision
- ✅ Support des plaques tunisiennes
- ✅ API simple et bien documentée
- ✅ Pas de limite de temps

**Inscription**:
1. Aller sur https://platerecognizer.com/
2. Créer un compte gratuit
3. Vérifier l'email
4. Aller dans "API" → "My API Key"
5. Copier la clé API

**Configuration**:
```typescript
// smartparktn-frontend/src/environments/environment.ts
plateRecognizerApiKey: 'sk_VOTRE_CLE_API_ICI'
```

---

### Option 2: OpenALPR Cloud

**Avantages**:
- ✅ API robuste
- ✅ Support multi-pays
- ✅ Bonne documentation

**Inconvénients**:
- ⚠️ Essai gratuit limité (1000 appels)
- ⚠️ Payant après

**Inscription**:
1. Aller sur https://www.openalpr.com/cloud-api.html
2. Créer un compte
3. Obtenir la clé API
4. Configurer dans environment.ts

---

### Option 3: Mode Simulation (Par défaut)

**Utilisation**:
- Aucune clé API requise
- Simule la détection de plaques
- Parfait pour le développement et les tests
- Scénarios variés (succès, échec, confiance faible)

---

## 🚀 Installation - Plate Recognizer (Recommandé)

### Étape 1: Créer un Compte

1. **Aller sur le site**:
   ```
   https://platerecognizer.com/
   ```

2. **Cliquer sur "Sign Up"**

3. **Remplir le formulaire**:
   - Email
   - Mot de passe
   - Nom de l'entreprise (optionnel)

4. **Vérifier l'email** et activer le compte

### Étape 2: Obtenir la Clé API

1. **Se connecter** à votre compte

2. **Aller dans "API"** dans le menu

3. **Copier votre API Key**:
   ```
   Format: sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Étape 3: Configurer l'Application

1. **Ouvrir le fichier de configuration**:
   ```
   smartparktn-frontend/src/environments/environment.ts
   ```

2. **Remplacer la clé API**:
   ```typescript
   plateRecognizerApiKey: 'sk_VOTRE_CLE_API_ICI'
   ```

3. **Sauvegarder le fichier**

### Étape 4: Tester

1. **Redémarrer le serveur Angular**:
   ```bash
   cd smartparktn-frontend
   ng serve
   ```

2. **Ouvrir l'application**:
   ```
   http://localhost:4200/alpr
   ```

3. **Activer la caméra** et **capturer une image**

4. **Vérifier la console** pour voir les logs:
   ```
   ✅ Plate Recognizer API configurée
   🔍 Reconnaissance avec platerecognizer...
   ```

---

## 🧪 Tests de Reconnaissance

### Scénarios de Test

#### 1. Plaque Claire et Nette
- **Conditions**: Bonne luminosité, plaque propre, angle droit
- **Résultat attendu**: Confiance > 90%

#### 2. Plaque avec Angle
- **Conditions**: Plaque vue de côté (30-45°)
- **Résultat attendu**: Confiance 70-85%

#### 3. Faible Luminosité
- **Conditions**: Nuit, éclairage faible
- **Résultat attendu**: Confiance 60-75% ou échec

#### 4. Plaque Sale/Floue
- **Conditions**: Plaque sale, image floue
- **Résultat attendu**: Confiance < 70% ou échec

#### 5. Plaque Partiellement Cachée
- **Conditions**: Plaque partiellement visible
- **Résultat attendu**: Échec ou confiance très faible

### Plaques de Test Tunisiennes

Format tunisien: `123TUN4567`

**Exemples valides**:
- `123TUN4567`
- `1TUN123`
- `99TN9999`
- `456TUN7890`
- `789TUN1234`

**Exemples invalides**:
- `TUN123` (pas de chiffres au début)
- `123456` (pas de lettres)
- `123ABC4567` (lettres non tunisiennes)

---

## 📊 Monitoring et Limites

### Plate Recognizer - Plan Gratuit

**Limites**:
- 2500 appels/mois
- Pas de limite de temps
- Toutes les fonctionnalités

**Vérifier l'utilisation**:
1. Se connecter sur https://platerecognizer.com/
2. Aller dans "Dashboard"
3. Voir "API Calls This Month"

**Alertes**:
- À 80% (2000 appels): Ralentir les tests
- À 90% (2250 appels): Mode simulation recommandé
- À 100% (2500 appels): Passer en mode simulation automatiquement

### Optimisation de l'Utilisation

**Bonnes pratiques**:
1. ✅ Capturer uniquement quand nécessaire
2. ✅ Utiliser le mode simulation pour les tests de développement
3. ✅ Optimiser la qualité d'image avant envoi
4. ✅ Implémenter un cache local pour les plaques récentes
5. ✅ Limiter les tentatives répétées

**Mauvaises pratiques**:
1. ❌ Capture automatique en continu
2. ❌ Tests répétés avec la même image
3. ❌ Envoi d'images de mauvaise qualité
4. ❌ Pas de gestion d'erreur

---

## 🔧 Configuration Avancée

### Ajuster la Confiance Minimale

```typescript
// environment.ts
alprConfig: {
  minConfidence: 0.7, // 70% - Ajuster selon vos besoins
  // 0.9 = Très strict (peu de faux positifs)
  // 0.7 = Équilibré (recommandé)
  // 0.5 = Permissif (plus de détections, plus de faux positifs)
}
```

### Ajuster la Qualité d'Image

```typescript
// environment.ts
alprConfig: {
  captureQuality: 0.9, // 0-1
  // 1.0 = Qualité maximale (fichier plus lourd)
  // 0.9 = Excellent compromis (recommandé)
  // 0.7 = Qualité moyenne (fichier léger)
}
```

### Ajuster les Tentatives

```typescript
// environment.ts
alprConfig: {
  maxRetries: 3, // Nombre de tentatives en cas d'échec réseau
}
```

---

## 🐛 Dépannage

### Erreur: "API_ERROR"

**Causes possibles**:
- Clé API invalide
- Quota dépassé
- Problème réseau

**Solutions**:
1. Vérifier la clé API dans environment.ts
2. Vérifier le quota sur platerecognizer.com
3. Vérifier la connexion internet
4. Regarder les logs de la console

### Erreur: "NO_PLATE_DETECTED"

**Causes possibles**:
- Pas de plaque dans l'image
- Plaque trop petite
- Mauvaise qualité d'image
- Angle trop prononcé

**Solutions**:
1. Rapprocher la caméra de la plaque
2. Améliorer l'éclairage
3. Nettoyer la plaque
4. Ajuster l'angle de la caméra
5. Augmenter la résolution de capture

### Erreur: "LOW_CONFIDENCE"

**Causes possibles**:
- Image floue
- Plaque sale
- Mauvais éclairage
- Angle incorrect

**Solutions**:
1. Améliorer les conditions de capture
2. Réduire minConfidence dans la config
3. Réessayer avec une meilleure image

### Mode Simulation Activé par Défaut

**Cause**:
- Aucune clé API configurée

**Solution**:
1. Configurer une clé API valide
2. Redémarrer le serveur Angular
3. Vérifier les logs de la console

---

## 📈 Amélioration de la Précision

### Conseils pour de Meilleurs Résultats

1. **Éclairage**:
   - Lumière naturelle ou LED blanc froid
   - Éviter les contre-jours
   - Éclairage uniforme sur la plaque

2. **Distance**:
   - Plaque doit occuper 20-40% de l'image
   - Ni trop proche (flou), ni trop loin (petite)

3. **Angle**:
   - Angle frontal idéal (0-15°)
   - Maximum 45° pour une détection fiable

4. **Qualité**:
   - Plaque propre et lisible
   - Image nette (pas de flou de mouvement)
   - Résolution minimale: 720p

5. **Environnement**:
   - Fond contrasté
   - Pas d'obstacles devant la plaque
   - Plaque complètement visible

---

## 🔐 Sécurité

### Protection de la Clé API

**Ne jamais**:
- ❌ Commiter la clé API dans Git
- ❌ Partager la clé publiquement
- ❌ Utiliser la même clé en production et développement

**Toujours**:
- ✅ Utiliser des variables d'environnement
- ✅ Ajouter environment.ts au .gitignore
- ✅ Utiliser des clés différentes par environnement
- ✅ Régénérer la clé si compromise

### .gitignore

Vérifier que ces fichiers sont ignorés:
```
# Environment files
/src/environments/environment.ts
/src/environments/environment.prod.ts

# Ou garder des templates
/src/environments/environment.local.ts
```

---

## 📚 Ressources

### Documentation Officielle

**Plate Recognizer**:
- API Docs: https://docs.platerecognizer.com/
- Dashboard: https://platerecognizer.com/dashboard/
- Support: support@platerecognizer.com

**OpenALPR**:
- API Docs: https://docs.openalpr.com/
- Dashboard: https://cloud.openalpr.com/

### Tutoriels

- Guide d'intégration: Voir ALPR-GUIDE.md
- Tests: Voir TESTING-GUIDE.md
- Architecture: Voir ALPR-STRUCTURE.txt

---

## ✅ Checklist de Configuration

### Avant de Commencer
- [ ] Compte créé sur Plate Recognizer
- [ ] Email vérifié
- [ ] Clé API obtenue
- [ ] Webcam fonctionnelle

### Configuration
- [ ] Clé API ajoutée dans environment.ts
- [ ] Fichier sauvegardé
- [ ] Serveur Angular redémarré
- [ ] Console vérifiée (✅ API configurée)

### Tests
- [ ] Page /alpr accessible
- [ ] Caméra s'active correctement
- [ ] Capture d'image fonctionne
- [ ] Reconnaissance retourne un résultat
- [ ] Résultat affiché dans l'interface
- [ ] Erreurs gérées correctement

---

## 🎯 Prochaines Étapes

Une fois l'API configurée et testée:

1. ✅ Tester avec différentes plaques
2. ✅ Tester dans différentes conditions
3. ✅ Valider la précision
4. ✅ Optimiser les paramètres
5. ✅ Passer à la Partie 2 (Validation des catégories)

---

**Date**: 28 février 2026  
**Version**: 1.0.0  
**Statut**: Configuration API ALPR
