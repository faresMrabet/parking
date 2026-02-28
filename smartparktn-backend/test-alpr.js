const axios = require('axios');

async function testALPR() {
  try {
    console.log('🧪 Test de l\'endpoint ALPR...\n');
    
    // Test 1: Connexion API
    console.log('Test 1: GET /api/alpr/test');
    const response = await axios.get('http://localhost:5000/api/alpr/test');
    console.log('✅ Succès:', response.data);
    console.log('');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    console.log('');
  }
}

testALPR();
