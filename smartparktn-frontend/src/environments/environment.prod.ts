export const environment = {
  production: true,
  apiUrl: '/api',
  
  // Plate Recognizer API Configuration
  plateRecognizerApiUrl: 'https://api.platerecognizer.com/v1/plate-reader/',
  plateRecognizerApiKey: 'YOUR_API_KEY_HERE',
  
  // Alternative: OpenALPR Cloud API
  openAlprApiUrl: 'https://api.openalpr.com/v3/recognize',
  openAlprApiKey: 'YOUR_OPENALPR_KEY_HERE',
  
  // Configuration ALPR
  alprConfig: {
    minConfidence: 0.7,
    regions: ['tn'],
    maxRetries: 3,
    captureQuality: 0.9,
    captureWidth: 1280,
    captureHeight: 720
  }
};
