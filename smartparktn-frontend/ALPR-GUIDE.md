# 📷 Guide ALPR - SmartParkTN

## 🚀 Démarrage Rapide

### Accès
URL : `http://localhost:4200/alpr`

Ou cliquez sur le bouton "ALPR" dans la barre de navigation.

## 🎯 Modes Disponibles

### 1. Mode Simulation (Par défaut)

Le mode le plus simple pour tester sans caméra.

**Utilisation:**
1. Saisir un numéro de plaque (ex: `123TUN4567`)
2. Cliquer sur "Simuler Entrée" ou "Simuler Sortie"
3. Voir le résultat affiché instantanément

**Format de plaque valide:**
- Format tunisien : `123TUN4567`
- 1-3 chiffres + 2-3 lettres + 1-4 chiffres
- Exemples valides :
  - `123TUN4567`
  - `45TN890`
  - `1ABC1234`

### 2. Mode Caméra

Utilise la webcam pour capturer des images de plaques.

**Prérequis:**
- Webcam fonctionnelle
- Navigateur moderne (Chrome, Firefox, Edge)
- Permission d'accès à la caméra

**Utilisation:**
1. Cliquer sur "Mode Caméra"
2. Cliquer sur "Activer la Caméra"
3. Autoriser l'accès à la caméra dans le navigateur
4. Positionner une plaque devant la caméra
5. Cliquer sur "Capturer et Reconnaître"
6. La plaque détectée s'affiche automatiquement
7. Cliquer sur "Enregistrer Entrée" ou "Enregistrer Sortie"

## 📊 Résultats Affichés

### Entrée Réussie ✅
- Message : "Entrée enregistrée avec succès"
- Heure d'entrée
- Type de véhicule
- Carte verte

### Sortie Réussie ✅
- Message : "Sortie enregistrée avec succès"
- Durée de stationnement
- Montant à payer
- Règle tarifaire appliquée
- Heure de sortie
- Carte verte

### Véhicule Blacklisté 🚫
- Message : "Véhicule blacklisté"
- Raison du refus
- Carte rouge

### Erreur ❌
- Message d'erreur spécifique
- Snackbar de notification
- Carte rouge

## 🧪 Scénarios de Test

### Test 1 : Entrée Normale
```
Plaque : 123TUN4567
Action : Simuler Entrée
Résultat attendu : Entrée enregistrée ✅
```

### Test 2 : Sortie avec Calcul
```
Plaque : 123TUN4567 (déjà entrée)
Action : Simuler Sortie
Résultat attendu : Sortie + Durée + Montant ✅
```

### Test 3 : Véhicule Blacklisté
```
Plaque : 999TUN9999
Action : Simuler Entrée
Résultat attendu : Accès refusé 🚫
```

### Test 4 : Format Invalide
```
Plaque : ABC123
Action : Simuler Entrée
Résultat attendu : Erreur format ❌
```

### Test 5 : Véhicule Non Trouvé
```
Plaque : 000TUN0000 (jamais entré)
Action : Simuler Sortie
Résultat attendu : Erreur "Aucune entrée trouvée" ❌
```

## 🎥 Intégration API Reconnaissance

### Option 1 : Plate Recognizer (Recommandé)

**Avantages:**
- Facile à intégrer
- Précision élevée
- Support multi-pays
- Plan gratuit disponible

**Inscription:**
1. Aller sur https://platerecognizer.com
2. Créer un compte
3. Obtenir l'API key
4. 2500 requêtes/mois gratuites

**Configuration:**

Dans `alpr.service.ts`, remplacer la méthode `sendToRecognitionAPI` :

```typescript
async sendToRecognitionAPI(imageData: string): Promise<RecognitionResult> {
  const apiKey = 'VOTRE_API_KEY';
  
  const response = await fetch('https://api.platerecognizer.com/v1/plate-reader/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      upload: imageData,
      regions: ['tn'] // Tunisie
    })
  });

  const data = await response.json();
  
  if (data.results && data.results.length > 0) {
    return {
      plateNumber: data.results[0].plate.toUpperCase(),
      confidence: data.results[0].score,
      timestamp: new Date()
    };
  }
  
  throw new Error('Aucune plaque détectée');
}
```

### Option 2 : OpenALPR Cloud

**Avantages:**
- Open source
- Bonne précision
- Support multi-pays

**Inscription:**
1. Aller sur https://cloud.openalpr.com
2. Créer un compte
3. Obtenir le secret key

**Configuration:**

```typescript
async sendToRecognitionAPI(imageData: string): Promise<RecognitionResult> {
  const secretKey = 'VOTRE_SECRET_KEY';
  const imageBase64 = imageData.split(',')[1];
  
  const response = await fetch('https://api.openalpr.com/v2/recognize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_bytes: imageBase64,
      secret_key: secretKey,
      country: 'tn',
      recognize_vehicle: 0
    })
  });

  const data = await response.json();
  
  if (data.results && data.results.length > 0) {
    return {
      plateNumber: data.results[0].plate.toUpperCase(),
      confidence: data.results[0].confidence / 100,
      timestamp: new Date()
    };
  }
  
  throw new Error('Aucune plaque détectée');
}
```

### Option 3 : Backend Python Local

**Avantages:**
- Gratuit
- Pas de limite
- Contrôle total
- Pas de dépendance externe

**Prérequis:**
- Python 3.8+
- OpenCV
- EasyOCR

**Installation:**

```bash
# Créer un dossier backend-alpr
mkdir backend-alpr
cd backend-alpr

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install flask flask-cors opencv-python easyocr numpy
```

**Code Python (app.py):**

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import easyocr
import numpy as np
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialiser le lecteur OCR
reader = easyocr.Reader(['en'], gpu=False)

@app.route('/recognize', methods=['POST'])
def recognize_plate():
    try:
        data = request.json
        image_data = data['image']
        
        # Décoder l'image base64
        image_bytes = base64.b64decode(image_data.split(',')[1])
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Prétraitement
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Reconnaissance OCR
        results = reader.readtext(gray)
        
        if results:
            # Prendre le résultat avec la meilleure confiance
            best_result = max(results, key=lambda x: x[2])
            plate_number = best_result[1].upper()
            confidence = best_result[2]
            
            return jsonify({
                'plateNumber': plate_number,
                'confidence': confidence,
                'timestamp': datetime.now().isoformat()
            })
        
        return jsonify({'error': 'Aucune plaque détectée'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
```

**Démarrer le serveur:**
```bash
python app.py
```

**Configuration Angular:**

```typescript
async sendToRecognitionAPI(imageData: string): Promise<RecognitionResult> {
  const response = await fetch('http://localhost:5001/recognize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: imageData
    })
  });

  const data = await response.json();
  
  if (data.plateNumber) {
    return {
      plateNumber: data.plateNumber,
      confidence: data.confidence,
      timestamp: new Date(data.timestamp)
    };
  }
  
  throw new Error(data.error || 'Erreur de reconnaissance');
}
```

## 🐛 Dépannage

### Caméra non disponible

**Problème:** Le bouton "Mode Caméra" est désactivé

**Solutions:**
1. Vérifier qu'une webcam est connectée
2. Vérifier les permissions du navigateur
3. Essayer un autre navigateur
4. Redémarrer le navigateur

### Permission caméra refusée

**Problème:** Erreur lors de l'activation de la caméra

**Solutions:**
1. Autoriser l'accès dans les paramètres du navigateur
2. Chrome : chrome://settings/content/camera
3. Firefox : about:preferences#privacy
4. Recharger la page après avoir autorisé

### Plaque non détectée

**Problème:** La reconnaissance ne trouve pas de plaque

**Solutions:**
1. Améliorer l'éclairage
2. Rapprocher la plaque de la caméra
3. Nettoyer la plaque
4. Essayer un angle différent
5. Vérifier que la plaque est nette (pas de flou)

### Format invalide

**Problème:** "Format de plaque invalide"

**Solution:**
Utiliser le format tunisien : `123TUN4567`
- 1-3 chiffres
- 2-3 lettres majuscules
- 1-4 chiffres

## 📱 Utilisation Mobile

L'interface ALPR est responsive et fonctionne sur mobile.

**Conseils:**
- Utiliser la caméra arrière pour de meilleurs résultats
- Tenir le téléphone stable
- Assurer un bon éclairage
- Capturer en mode paysage si possible

## 🎯 Bonnes Pratiques

1. **Éclairage**
   - Éviter les contre-jours
   - Utiliser un éclairage uniforme
   - Éviter les reflets

2. **Distance**
   - Plaque à 30-50cm de la caméra
   - Plaque bien visible et centrée

3. **Angle**
   - Caméra perpendiculaire à la plaque
   - Éviter les angles trop prononcés

4. **Qualité**
   - Plaque propre
   - Image nette (pas de flou)
   - Résolution suffisante

## 📊 Statistiques

L'historique des opérations récentes affiche :
- Les 5 dernières opérations
- Statut (succès/échec)
- Type (entrée/sortie)
- Horodatage
- Numéro de plaque

Bon usage ! 🚀
