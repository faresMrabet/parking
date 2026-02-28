const axios = require('axios');

async function testAssistant() {
  console.log('🧪 Test de l\'Assistant IA...\n');

  try {
    // Test 1: Connexion OpenAI
    console.log('Test 1: GET /api/assistant/test - Connexion OpenAI');
    const testResponse = await axios.get('http://localhost:5000/api/assistant/test');
    console.log('✅ Succès:', testResponse.data);
    console.log('');

    // Test 2: Question métier
    console.log('Test 2: POST /api/assistant/ask - Question métier');
    const askResponse = await axios.post('http://localhost:5000/api/assistant/ask', {
      question: 'Pourquoi un véhicule blacklisté est refusé ?'
    });
    console.log('✅ Succès:');
    console.log('Question:', askResponse.data.question);
    console.log('Réponse:', askResponse.data.answer);
    console.log('');

    // Test 3: Question statistiques
    console.log('Test 3: POST /api/assistant/ask - Question statistiques');
    const statsResponse = await axios.post('http://localhost:5000/api/assistant/ask', {
      question: 'Comment sont calculés les tarifs pour les visiteurs ?'
    });
    console.log('✅ Succès:');
    console.log('Question:', statsResponse.data.question);
    console.log('Réponse:', statsResponse.data.answer);
    console.log('');

    console.log('🎉 Tous les tests Assistant IA sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testAssistant();
