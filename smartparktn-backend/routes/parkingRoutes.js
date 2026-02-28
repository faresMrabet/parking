const express = require('express');
const router = express.Router();
const { registerEntry, registerExit } = require('../controllers/parkingController');
const { getDashboard, getHistory } = require('../controllers/dashboardController');

// Routes principales
router.post('/entry', registerEntry);
router.post('/exit', registerExit);
router.get('/dashboard', getDashboard);
router.get('/history', getHistory);

module.exports = router;
