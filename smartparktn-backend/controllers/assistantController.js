/**
 * Assistant IA Local - SmartParkTN
 * Réponses intelligentes basées sur les règles métier
 * Pas de dépendance externe (OpenAI, etc.)
 */

/**
 * Traite une question de l'utilisateur (mode local)
 */
exports.askQuestion = (req, res) => {
  try {
    const { question } = req.body;

    // Validation
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question requise'
      });
    }

    console.log(`🤖 Question reçue: ${question}`);

    // Générer une réponse intelligente locale
    const answer = generateLocalAnswer(question);

    console.log(`✅ Réponse générée (local): ${answer.substring(0, 80)}...`);

    // Retourner la réponse
    return res.status(200).json({
      success: true,
      question: question,
      answer: answer,
      timestamp: new Date().toISOString(),
      mode: 'local'
    });

  } catch (error) {
    console.error('❌ Erreur Assistant IA:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement de la question',
      error: error.message
    });
  }
};

/**
 * Génère une réponse locale intelligente basée sur la question
 */
function generateLocalAnswer(question) {
  const q = question.toLowerCase();

  // Questions sur les règles et tarifs
  if (q.includes('règle') || q.includes('tarif') || q.includes('prix') || q.includes('coût') || q.includes('combien')) {
    return `📋 **Règles de Tarification SmartParkTN**

🌟 **VIP** : Stationnement gratuit, accès prioritaire
🎫 **Abonné** : 2h gratuites puis 0.5 TND/heure
👤 **Visiteur** : 2h gratuites puis 1 TND/heure
🚫 **Blacklist** : Accès refusé automatiquement

Les tarifs sont calculés automatiquement à la sortie selon la durée de stationnement et la catégorie du véhicule.`;
  }

  // Questions sur les refus
  if (q.includes('refus') || q.includes('blacklist') || q.includes('interdit') || q.includes('pourquoi')) {
    return `🚫 **Raisons de Refus d'Accès**

Un véhicule peut être refusé pour les raisons suivantes :

1. **Blacklist** : Le véhicule est dans la liste noire (impayés, infractions, etc.)
2. **Plaque invalide** : Format de plaque non reconnu ou illisible
3. **Confiance faible** : La reconnaissance ALPR n'est pas assez sûre (< 70%)

Les véhicules blacklistés sont automatiquement refusés par le système pour protéger le parking.`;
  }

  // Questions sur les statistiques
  if (q.includes('statistique') || q.includes('nombre') || q.includes('revenu') || q.includes('aujourd')) {
    return `📊 **Statistiques SmartParkTN**

Le dashboard affiche en temps réel :

🚗 **Véhicules dans le parking** : Nombre actuel de véhicules stationnés
💰 **Revenus du jour** : Total des paiements reçus aujourd'hui
📥 **Entrées du jour** : Nombre de véhicules entrés
🚫 **Refus du jour** : Nombre d'accès refusés

Toutes les statistiques sont calculées automatiquement et mises à jour en temps réel.`;
  }

  // Questions sur ALPR
  if (q.includes('alpr') || q.includes('reconnaissance') || q.includes('caméra') || q.includes('plaque')) {
    return `📸 **Système ALPR (Reconnaissance Automatique)**

Le système utilise Plate Recognizer pour :

✅ **Capturer** l'image de la plaque via caméra
🔍 **Reconnaître** le numéro automatiquement
📊 **Afficher** la confiance de reconnaissance (%)
🏷️ **Catégoriser** le véhicule (VIP, Abonné, Visiteur, Blacklist)
✅ **Autoriser** ou 🚫 **Refuser** l'accès automatiquement

Format tunisien supporté : 123TUN4567
Confiance minimum requise : 70%`;
  }

  // Questions sur les véhicules
  if (q.includes('véhicule') || q.includes('voiture') || q.includes('catégorie') || q.includes('type')) {
    return `🚗 **Catégories de Véhicules**

Le système gère 4 catégories :

🌟 **VIP** : Clients privilégiés, stationnement gratuit
🎫 **Abonné** : Clients réguliers, tarif préférentiel
👤 **Visiteur** : Clients occasionnels, tarif standard
🚫 **Blacklist** : Véhicules interdits d'accès

La catégorie est détectée automatiquement lors de la reconnaissance de plaque et détermine le tarif appliqué.`;
  }

  // Questions sur les recommandations
  if (q.includes('recommandation') || q.includes('conseil') || q.includes('améliorer') || q.includes('optimiser')) {
    return `💡 **Recommandations SmartParkTN**

Pour optimiser la gestion du parking :

📊 **Analyser** les heures de pointe pour ajuster les tarifs
🎫 **Promouvoir** les abonnements pour fidéliser les clients
📸 **Améliorer** l'éclairage pour une meilleure reconnaissance ALPR
🚫 **Réviser** régulièrement la blacklist
💰 **Ajuster** les tarifs selon l'occupation

Le système fournit toutes les données nécessaires pour prendre des décisions éclairées.`;
  }

  // Questions sur la durée
  if (q.includes('durée') || q.includes('temps') || q.includes('heure')) {
    return `⏱️ **Calcul de Durée et Tarification**

Le système calcule automatiquement :

📥 **Heure d'entrée** : Enregistrée lors de la reconnaissance de plaque
📤 **Heure de sortie** : Enregistrée à la sortie
⏱️ **Durée totale** : Calculée en heures et minutes
💰 **Montant** : Appliqué selon la catégorie et la durée

Exemple : Un visiteur qui reste 3h30 paie pour 1h30 (2h gratuites).`;
  }

  // Questions sur VIP
  if (q.includes('vip')) {
    return `🌟 **Avantages VIP**

Les clients VIP bénéficient de :

✅ **Stationnement gratuit** : Aucun frais, quelle que soit la durée
🚀 **Accès prioritaire** : Entrée et sortie rapides
📊 **Suivi personnalisé** : Historique détaillé
🎯 **Service premium** : Assistance dédiée

Le statut VIP est automatiquement reconnu par le système ALPR.`;
  }

  // Questions sur les abonnés
  if (q.includes('abonné') || q.includes('abonnement')) {
    return `🎫 **Avantages Abonnés**

Les abonnés profitent de :

💰 **Tarif préférentiel** : 0.5 TND/heure au lieu de 1 TND
🎁 **2h gratuites** : Comme les visiteurs
📊 **Statistiques** : Suivi de l'utilisation
💳 **Facturation mensuelle** : Paiement simplifié

L'abonnement est idéal pour les clients réguliers.`;
  }

  // Réponse générique
  return `🤖 **Assistant SmartParkTN**

Je peux vous aider avec :

📋 **Règles et tarifs** : VIP, Abonné, Visiteur, Blacklist
🚫 **Raisons de refus** : Blacklist, plaque invalide, confiance faible
📊 **Statistiques** : Véhicules, revenus, entrées, refus
📸 **ALPR** : Reconnaissance automatique de plaques
🚗 **Véhicules** : Catégories et gestion
💡 **Recommandations** : Optimisation du parking
⏱️ **Durée et tarification** : Calculs automatiques

Posez-moi une question spécifique pour obtenir une réponse détaillée !`;
}

/**
 * Test de connexion Assistant IA
 */
exports.testConnection = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Assistant IA opérationnel (mode local)',
      mode: 'local',
      features: [
        'Règles et tarifs',
        'Raisons de refus',
        'Statistiques',
        'ALPR',
        'Véhicules',
        'Recommandations'
      ]
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur Assistant IA',
      error: error.message
    });
  }
};
