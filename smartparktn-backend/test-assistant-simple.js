const axios = require('axios');

async function testAssistantSimple() {
  console.log('🧪 Test Assistant IA Local...\n');

  try {
    // Test 1: Connexion
    console.log('Test 1: GET /api/assistant/test');
    const testResponse = await axios.get('http://localhost:5000/api/assistant/test');
    console.log('✅ Succès:', JSON.stringify(testResponse.data, null, 2));
    console.log('');

    // Test 2: Question sur refus
    console.log('Test 2: Question sur refus');
    const refusResponse = await axios.post('http://localhost:5000/api/assistant/ask', {
      question: 'Pourquoi un véhicule est refusé ?'
    });
    console.log('✅ Succès:');
    console.log('Question:', refusResponse.data.question);
    console.log('Réponse:', refusResponse.data.answer);
    console.log('Mode:', refusResponse.data.mode);
    console.log('');

    // Test 3: Question sur tarifs
    console.log('Test 3: Question sur tarifs');
    const tarifResponse = await axios.post('http://localhost:5000/api/assistant/ask', {
      question: 'Quels sont les tarifs ?'
    });
    console.log('✅ Succès:');
    console.log('Réponse:', tarifResponse.data.answer.substring(0, 100) + '...');
    console.log('');

    console.log('🎉 Tous les tests sont passés !');
    console.log('✅ Assistant IA local opérationnel');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAssistantSimple();
