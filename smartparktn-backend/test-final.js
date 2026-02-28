const axios = require('axios');

async function testFinal() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     🧪 TEST FINAL - SmartParkTN Backend                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  let passed = 0;
  let failed = 0;

  try {
    // Test 1: Backend Health
    console.log('Test 1: Backend Health Check');
    const health = await axios.get('http://localhost:5000');
    if (health.data.message.includes('SmartParkTN')) {
      console.log('✅ Backend opérationnel');
      passed++;
    } else {
      console.log('❌ Backend ne répond pas correctement');
      failed++;
    }
    console.log('');

    // Test 2: Dashboard
    console.log('Test 2: Dashboard API');
    const dashboard = await axios.get('http://localhost:5000/api/dashboard');
    if (dashboard.data.vehiclesInParking !== undefined) {
      console.log('✅ Dashboard API fonctionne');
      console.log(`   Véhicules: ${dashboard.data.vehiclesInParking}`);
      console.log(`   Revenus: ${dashboard.data.todayRevenue} TND`);
      passed++;
    } else {
      console.log('❌ Dashboard API erreur');
      failed++;
    }
    console.log('');

    // Test 3: History
    console.log('Test 3: History API');
    const history = await axios.get('http://localhost:5000/api/history');
    if (history.data.entries) {
      console.log('✅ History API fonctionne');
      console.log(`   Entrées: ${history.data.entries.length}`);
      passed++;
    } else {
      console.log('❌ History API erreur');
      failed++;
    }
    console.log('');

    // Test 4: ALPR Test
    console.log('Test 4: ALPR API');
    const alpr = await axios.get('http://localhost:5000/api/alpr/test');
    if (alpr.data.success) {
      console.log('✅ ALPR API fonctionne');
      console.log(`   Mode: ${alpr.data.mode}`);
      passed++;
    } else {
      console.log('❌ ALPR API erreur');
      failed++;
    }
    console.log('');

    // Test 5: Assistant IA Test
    console.log('Test 5: Assistant IA - Connexion');
    const assistantTest = await axios.get('http://localhost:5000/api/assistant/test');
    if (assistantTest.data.success && assistantTest.data.mode === 'local') {
      console.log('✅ Assistant IA connexion OK');
      console.log(`   Mode: ${assistantTest.data.mode}`);
      passed++;
    } else {
      console.log('❌ Assistant IA connexion erreur');
      failed++;
    }
    console.log('');

    // Test 6: Assistant IA Question
    console.log('Test 6: Assistant IA - Question');
    const assistantAsk = await axios.post('http://localhost:5000/api/assistant/ask', {
      question: 'Quelles sont les règles ?'
    });
    if (assistantAsk.data.success && assistantAsk.data.mode === 'local') {
      console.log('✅ Assistant IA répond correctement');
      console.log(`   Longueur réponse: ${assistantAsk.data.answer.length} caractères`);
      console.log(`   Mode: ${assistantAsk.data.mode}`);
      passed++;
    } else {
      console.log('❌ Assistant IA ne répond pas');
      failed++;
    }
    console.log('');

    // Test 7: Entry API
    console.log('Test 7: Entry API');
    const entry = await axios.post('http://localhost:5000/api/entry', {
      plateNumber: 'TEST123'
    });
    if (entry.data.status === 'authorized') {
      console.log('✅ Entry API fonctionne');
      console.log(`   Plaque: ${entry.data.plateNumber}`);
      passed++;
    } else {
      console.log('❌ Entry API erreur');
      failed++;
    }
    console.log('');

    // Résumé
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    RÉSUMÉ DES TESTS                          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Tests réussis: ${passed}/7`);
    console.log(`❌ Tests échoués: ${failed}/7`);
    console.log('');

    if (failed === 0) {
      console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
      console.log('✅ Backend 100% opérationnel');
      console.log('✅ Assistant IA en mode local');
      console.log('✅ ALPR intégré');
      console.log('✅ Toutes les API fonctionnelles');
      console.log('');
      console.log('🚀 Prêt pour démarrer le frontend :');
      console.log('   cd smartparktn-frontend');
      console.log('   ng serve');
      console.log('');
      console.log('📍 Puis accéder à : http://localhost:4200/assistant');
    } else {
      console.log('⚠️ Certains tests ont échoué');
      console.log('Vérifier les logs ci-dessus pour plus de détails');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

testFinal();
