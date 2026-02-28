export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  
  // Plate Recognizer API Configuration
  plateRecognizerApiUrl: 'https://api.platerecognizer.com/v1/plate-reader/',
  plateRecognizerApiKey: 'YOUR_API_KEY_HERE', // À remplacer par votre clé API
  
  // Alternative: OpenALPR Cloud API
  openAlprApiUrl: 'https://api.openalpr.com/v3/recognize',
  openAlprApiKey: 'YOUR_OPENALPR_KEY_HERE', // À remplacer par votre clé API
  
  // Configuration ALPR
  alprConfig: {
    minConfidence: 0.7, // Confiance minimale pour accepter une détection
    regions: ['tn'], // Région Tunisie
    maxRetries: 3, // Nombre de tentatives en cas d'échec
    captureQuality: 0.9, // Qualité JPEG (0-1)
    captureWidth: 1280,
    captureHeight: 720
  }
};
