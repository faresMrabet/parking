const express = require('express');
const router = express.Router();
const multer = require('multer');
const alprController = require('../controllers/alprController');

// Configuration de multer pour gérer l'upload d'images en mémoire
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accepter uniquement les images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image'), false);
    }
  }
});

// Route pour reconnaître une plaque
router.post('/recognize', upload.single('image'), alprController.recognizePlate);

// Route de test de connexion API (optionnel)
router.get('/test', alprController.testConnection);

module.exports = router;
