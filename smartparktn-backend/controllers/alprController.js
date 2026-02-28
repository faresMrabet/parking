const axios = require('axios');
const FormData = require('form-data');

// Reconnaissance de plaque via Plate Recognizer
exports.recognizePlate = async (req, res) => {
  try {
    // Vérifier qu'une image a été envoyée
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    // Vérifier que la clé API est configurée
    const apiKey = process.env.PLATE_RECOGNIZER_API_KEY;
    if (!apiKey || apiKey === 'your_new_api_key_here') {
      return res.status(500).json({
        success: false,
        message: 'Clé API Plate Recognizer non configurée'
      });
    }

    // Préparer les données pour Plate Recognizer
    const formData = new FormData();
    formData.append('upload', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    
    // Ajouter les régions pour améliorer la précision (Tunisie)
    formData.append('regions', 'tn'); // Code ISO pour Tunisie

    console.log('📸 Envoi de l\'image à Plate Recognizer...');

    // Appeler l'API Plate Recognizer
    const response = await axios.post(
      'https://api.platerecognizer.com/v1/plate-reader/',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Token ${apiKey}`
        },
        timeout: 10000 // Timeout de 10 secondes
      }
    );

    console.log('✅ Réponse reçue de Plate Recognizer');

    // Vérifier si des plaques ont été détectées
    if (!response.data.results || response.data.results.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'Aucune plaque détectée sur l\'image'
      });
    }

    // Extraire la première plaque détectée (la plus probable)
    const firstResult = response.data.results[0];
    const plateNumber = firstResult.plate.toUpperCase();
    const confidence = firstResult.score;

    console.log(`🚗 Plaque détectée: ${plateNumber} (confiance: ${(confidence * 100).toFixed(1)}%)`);

    // Valider le format tunisien (optionnel mais recommandé)
    const tunisianPlatePattern = /^\d{1,3}[A-Z]{2,3}\d{1,4}$/;
    if (!tunisianPlatePattern.test(plateNumber)) {
      console.log(`⚠️ Format de plaque non tunisien: ${plateNumber}`);
    }

    // Retourner le résultat
    return res.status(200).json({
      success: true,
      plateNumber: plateNumber,
      confidence: confidence,
      region: firstResult.region?.code || 'unknown',
      vehicle: {
        type: firstResult.vehicle?.type || 'unknown',
        box: firstResult.box
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la reconnaissance:', error.message);

    // Gestion des erreurs spécifiques
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Timeout: L\'API Plate Recognizer ne répond pas'
      });
    }

    if (error.response) {
      // Erreur de l'API Plate Recognizer
      const status = error.response.status;
      
      if (status === 401) {
        return res.status(500).json({
          success: false,
          message: 'Clé API Plate Recognizer invalide'
        });
      }
      
      if (status === 429) {
        return res.status(429).json({
          success: false,
          message: 'Limite de requêtes API atteinte. Veuillez réessayer plus tard.'
        });
      }

      return res.status(500).json({
        success: false,
        message: `Erreur API Plate Recognizer: ${error.response.data?.error || 'Erreur inconnue'}`
      });
    }

    // Erreur générique
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la reconnaissance de la plaque'
    });
  }
};

// Test de la connexion API (optionnel, pour debug)
exports.testConnection = async (req, res) => {
  try {
    const apiKey = process.env.PLATE_RECOGNIZER_API_KEY;
    
    if (!apiKey || apiKey === 'your_new_api_key_here') {
      return res.status(500).json({
        success: false,
        message: 'Clé API non configurée'
      });
    }

    // Tester avec une requête simple
    const response = await axios.get(
      'https://api.platerecognizer.com/v1/statistics/',
      {
        headers: {
          'Authorization': `Token ${apiKey}`
        },
        timeout: 5000
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Connexion API réussie',
      usage: response.data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur de connexion à l\'API',
      error: error.message
    });
  }
};
