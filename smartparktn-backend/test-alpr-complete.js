const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

// Couleurs pour console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testALPRComplete() {
  log('\n╔══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     🧪 SmartParkTN - Tests ALPR Complets                    ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════╝\n', 'cyan');

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Connexion API
  log('Test 1: GET /api/alpr/test - Connexion API', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/alpr/test`);
    if (response.data.success) {
      log('✅ Succès: Connexion API établie', 'green');
      log(`   Appels disponibles: ${response.data.usage.total_calls}`, 'cyan');
      log(`   Appels utilisés ce mois: ${response.data.usage.usage.calls}`, 'cyan');
      passedTests++;
    } else {
      log('❌ Échec: Connexion API non établie', 'red');
      failedTests++;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.response?.data?.message || error.message}`, 'red');
    failedTests++;
  }
  log('');

  // Test 2: Endpoint racine
  log('Test 2: GET / - Endpoint racine', 'blue');
  try {
    const response = await axios.get(BASE_URL);
    if (response.data.message) {
      log('✅ Succès: Backend opérationnel', 'green');
      log(`   Version: ${response.data.version}`, 'cyan');
      log(`   Mode: ${response.data.mode}`, 'cyan');
      passedTests++;
    } else {
      log('❌ Échec: Réponse invalide', 'red');
      failedTests++;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    failedTests++;
  }
  log('');

  // Test 3: Dashboard
  log('Test 3: GET /api/dashboard - Dashboard', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/dashboard`);
    if (response.data.vehiclesInParking !== undefined) {
      log('✅ Succès: Dashboard accessible', 'green');
      log(`   Véhicules dans le parking: ${response.data.vehiclesInParking}`, 'cyan');
      log(`   Revenus du jour: ${response.data.todayRevenue} TND`, 'cyan');
      log(`   Entrées du jour: ${response.data.todayEntries}`, 'cyan');
      log(`   Refus du jour: ${response.data.todayRefused}`, 'cyan');
      passedTests++;
    } else {
      log('❌ Échec: Données dashboard invalides', 'red');
      failedTests++;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    failedTests++;
  }
  log('');

  // Test 4: Entrée simulation
  log('Test 4: POST /api/entry - Entrée simulation', 'blue');
  try {
    const testPlate = '123TUN4567';
    const response = await axios.post(`${BASE_URL}/api/entry`, {
      plateNumber: testPlate
    });
    if (response.data.status === 'authorized') {
      log('✅ Succès: Entrée enregistrée', 'green');
      log(`   Plaque: ${response.data.plateNumber}`, 'cyan');
      log(`   Type: ${response.data.vehicleType}`, 'cyan');
      log(`   Heure: ${new Date(response.data.entryTime).toLocaleString('fr-FR')}`, 'cyan');
      passedTests++;
    } else {
      log('❌ Échec: Entrée refusée', 'red');
      failedTests++;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.response?.data?.error || error.message}`, 'red');
    failedTests++;
  }
  log('');

  // Test 5: Sortie simulation
  log('Test 5: POST /api/exit - Sortie simulation', 'blue');
  try {
    const testPlate = '123TUN4567';
    const response = await axios.post(`${BASE_URL}/api/exit`, {
      plateNumber: testPlate
    });
    if (response.data.status === 'authorized') {
      log('✅ Succès: Sortie enregistrée', 'green');
      log(`   Plaque: ${response.data.plateNumber}`, 'cyan');
      log(`   Durée: ${response.data.duration.toFixed(2)}h`, 'cyan');
      log(`   Montant: ${response.data.amount} TND`, 'cyan');
      log(`   Règle: ${response.data.ruleApplied}`, 'cyan');
      passedTests++;
    } else {
      log('❌ Échec: Sortie refusée', 'red');
      failedTests++;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.response?.data?.error || error.message}`, 'red');
    failedTests++;
  }
  log('');

  // Test 6: Blacklist
  log('Test 6: POST /api/entry - Test Blacklist', 'blue');
  try {
    const blacklistPlate = '999TUN9999';
    const response = await axios.post(`${BASE_URL}/api/entry`, {
      plateNumber: blacklistPlate
    });
    log('❌ Échec: Véhicule blacklisté devrait être refusé', 'red');
    failedTests++;
  } catch (error) {
    if (error.response?.status === 403) {
      log('✅ Succès: Véhicule blacklisté correctement refusé', 'green');
      log(`   Raison: ${error.response.data.reason}`, 'cyan');
      passedTests++;
    } else {
      log(`❌ Erreur: ${error.message}`, 'red');
      failedTests++;
    }
  }
  log('');

  // Test 7: History
  log('Test 7: GET /api/history - Historique', 'blue');
  try {
    const response = await axios.get(`${BASE_URL}/api/history?limit=5`);
    if (response.data.entries && Array.isArray(response.data.entries)) {
      log('✅ Succès: Historique accessible', 'green');
      log(`   Nombre d'entrées: ${response.data.entries.length}`, 'cyan');
      log(`   Total: ${response.data.pagination.total}`, 'cyan');
      passedTests++;
    } else {
      log('❌ Échec: Données historique invalides', 'red');
      failedTests++;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    failedTests++;
  }
  log('');

  // Résumé
  log('╔══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    📊 RÉSUMÉ DES TESTS                       ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════╝\n', 'cyan');
  
  const totalTests = passedTests + failedTests;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  log(`Tests réussis: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`Tests échoués: ${failedTests}/${totalTests}`, failedTests === 0 ? 'green' : 'red');
  log(`Taux de réussite: ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow');
  log('');

  if (passedTests === totalTests) {
    log('🎉 Tous les tests sont passés avec succès !', 'green');
    log('✅ SmartParkTN est prêt pour la production', 'green');
  } else {
    log('⚠️  Certains tests ont échoué', 'yellow');
    log('🔧 Vérifiez les erreurs ci-dessus', 'yellow');
  }
  log('');
}

// Exécuter les tests
testALPRComplete().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});
