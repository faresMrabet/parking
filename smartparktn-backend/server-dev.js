require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Données simulées en mémoire
let entries = [];
let vehicles = [
  { plateNumber: '123TUN4567', type: 'Visiteur', isBlacklisted: false },
  { plateNumber: '456TUN7890', type: 'Abonné', isBlacklisted: false },
  { plateNumber: '789TUN1234', type: 'VIP', isBlacklisted: false },
  { plateNumber: '999TUN9999', type: 'Visiteur', isBlacklisted: true }
];

// Helper functions
const calculateDuration = (entryTime, exitTime) => {
  const durationMs = new Date(exitTime) - new Date(entryTime);
  const durationHours = durationMs / (1000 * 60 * 60);
  return Math.round(durationHours * 100) / 100;
};

const calculateAmount = (duration, freeHours = 2, hourlyRate = 1) => {
  if (duration <= freeHours) return 0;
  const chargeableHours = duration - freeHours;
  return Math.round(chargeableHours * hourlyRate * 100) / 100;
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚗 SmartParkTN API - Mode Développement',
    version: '1.0.0',
    mode: 'DEV (Sans MongoDB)',
    endpoints: {
      entry: 'POST /api/entry',
      exit: 'POST /api/exit',
      dashboard: 'GET /api/dashboard',
      history: 'GET /api/history',
      alprRecognize: 'POST /api/alpr/recognize',
      alprTest: 'GET /api/alpr/test'
    }
  });
});

// POST /api/entry
app.post('/api/entry', (req, res) => {
  try {
    const { plateNumber } = req.body;
    
    if (!plateNumber) {
      return res.status(400).json({ error: 'Numéro de plaque requis' });
    }

    const upperPlate = plateNumber.toUpperCase();
    
    // Vérifier ou créer le véhicule
    let vehicle = vehicles.find(v => v.plateNumber === upperPlate);
    if (!vehicle) {
      vehicle = { plateNumber: upperPlate, type: 'Visiteur', isBlacklisted: false };
      vehicles.push(vehicle);
    }

    // Vérifier blacklist
    if (vehicle.isBlacklisted) {
      entries.push({
        plateNumber: upperPlate,
        entryTime: new Date(),
        exitTime: null,
        status: 'refused',
        ruleApplied: 'Véhicule blacklisté'
      });
      
      return res.status(403).json({
        plateNumber: upperPlate,
        status: 'refused',
        reason: 'Véhicule blacklisté'
      });
    }

    // Vérifier si déjà dans le parking
    const existingEntry = entries.find(e => e.plateNumber === upperPlate && !e.exitTime);
    if (existingEntry) {
      return res.status(400).json({
        error: 'Véhicule déjà dans le parking',
        entryTime: existingEntry.entryTime
      });
    }

    // Créer l'entrée
    const entry = {
      plateNumber: upperPlate,
      entryTime: new Date(),
      exitTime: null,
      status: 'authorized',
      duration: null,
      amount: 0,
      ruleApplied: null
    };
    entries.push(entry);

    res.status(201).json({
      plateNumber: upperPlate,
      status: 'authorized',
      entryTime: entry.entryTime,
      vehicleType: vehicle.type
    });

  } catch (error) {
    console.error('Erreur entry:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/exit
app.post('/api/exit', (req, res) => {
  try {
    const { plateNumber } = req.body;
    
    if (!plateNumber) {
      return res.status(400).json({ error: 'Numéro de plaque requis' });
    }

    const upperPlate = plateNumber.toUpperCase();
    
    // Trouver l'entrée
    const entry = entries.find(e => e.plateNumber === upperPlate && !e.exitTime);
    
    if (!entry) {
      return res.status(404).json({
        error: 'Aucune entrée trouvée pour ce véhicule'
      });
    }

    const vehicle = vehicles.find(v => v.plateNumber === upperPlate);
    const exitTime = new Date();
    const duration = calculateDuration(entry.entryTime, exitTime);
    
    let amount = 0;
    let ruleApplied = '';

    if (vehicle && vehicle.type === 'VIP') {
      amount = 0;
      ruleApplied = 'VIP - Gratuit';
    } else {
      amount = calculateAmount(duration);
      ruleApplied = '2h gratuites puis 1 TND/heure';
    }

    // Mettre à jour l'entrée
    entry.exitTime = exitTime;
    entry.duration = duration;
    entry.amount = amount;
    entry.ruleApplied = ruleApplied;

    res.status(200).json({
      plateNumber: upperPlate,
      entryTime: entry.entryTime,
      exitTime: exitTime,
      duration: duration,
      amount: amount,
      ruleApplied: ruleApplied,
      status: 'authorized'
    });

  } catch (error) {
    console.error('Erreur exit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/dashboard
app.get('/api/dashboard', (req, res) => {
  try {
    const vehiclesInParking = entries.filter(e => !e.exitTime && e.status === 'authorized').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntries = entries.filter(e => new Date(e.entryTime) >= today);
    const todayRevenue = todayEntries
      .filter(e => e.exitTime)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const todayRefused = todayEntries.filter(e => e.status === 'refused').length;

    res.status(200).json({
      vehiclesInParking,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      todayEntries: todayEntries.length,
      todayRefused,
      date: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/history
app.get('/api/history', (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.entryTime) - new Date(a.entryTime)
    );
    
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedEntries = sortedEntries.slice(startIndex, endIndex);

    res.status(200).json({
      entries: paginatedEntries,
      pagination: {
        total: entries.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(entries.length / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Erreur history:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes ALPR - Intégration complète
const multer = require('multer');
const alprController = require('./controllers/alprController');

// Configuration multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image'), false);
    }
  }
});

// Route de test ALPR
app.get('/api/alpr/test', alprController.testConnection);

// Route de reconnaissance ALPR
app.post('/api/alpr/recognize', upload.single('image'), alprController.recognizePlate);

console.log('✅ Routes ALPR enregistrées');

// Routes Assistant IA
const assistantRoutes = require('./routes/assistantRoutes');
app.use('/api/assistant', assistantRoutes);

console.log('✅ Routes Assistant IA enregistrées');

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     🚗 SmartParkTN Backend - Mode Développement             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('');
  console.log('⚠️  Mode DEV : Données en mémoire (pas de MongoDB)');
  console.log('');
  console.log('✅ Endpoints disponibles:');
  console.log('   POST /api/entry');
  console.log('   POST /api/exit');
  console.log('   GET  /api/dashboard');
  console.log('   GET  /api/history');
  console.log('   POST /api/alpr/recognize');
  console.log('   GET  /api/alpr/test');
  console.log('');
  console.log('🧪 Véhicules de test:');
  console.log('   123TUN4567 - Visiteur ✅');
  console.log('   456TUN7890 - Abonné ✅');
  console.log('   789TUN1234 - VIP ✅');
  console.log('   999TUN9999 - Blacklisté 🚫');
  console.log('');
});

module.exports = app;
