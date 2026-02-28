require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const parkingRoutes = require('./routes/parkingRoutes');

const app = express();

// Connexion MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', parkingRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: '🚗 SmartParkTN API - Backend opérationnel',
    version: '1.0.0',
    endpoints: {
      entry: 'POST /api/entry',
      exit: 'POST /api/exit',
      dashboard: 'GET /api/dashboard',
      history: 'GET /api/history'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
