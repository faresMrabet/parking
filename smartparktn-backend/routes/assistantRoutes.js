const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');

// Route pour poser une question à l'assistant IA
router.post('/ask', assistantController.askQuestion);

// Route de test de connexion OpenAI
router.get('/test', assistantController.testConnection);

module.exports = router;
