const Entry = require('../models/Entry');

// GET /api/dashboard - Statistiques du parking
const getDashboard = async (req, res) => {
  try {
    // Véhicules actuellement dans le parking
    const vehiclesInParking = await Entry.countDocuments({
      exitTime: null,
      status: 'authorized'
    });

    // Recettes du jour
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRevenue = await Entry.aggregate([
      {
        $match: {
          exitTime: { $gte: today },
          status: 'authorized'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const revenue = todayRevenue.length > 0 ? todayRevenue[0].total : 0;

    // Nombre total d'entrées aujourd'hui
    const todayEntries = await Entry.countDocuments({
      entryTime: { $gte: today }
    });

    // Nombre de refus aujourd'hui
    const todayRefused = await Entry.countDocuments({
      entryTime: { $gte: today },
      status: 'refused'
    });

    res.status(200).json({
      vehiclesInParking,
      todayRevenue: Math.round(revenue * 100) / 100,
      todayEntries,
      todayRefused,
      date: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur getDashboard:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET /api/history - Historique des entrées/sorties
const getHistory = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const entries = await Entry.find()
      .sort({ entryTime: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Entry.countDocuments();

    res.status(200).json({
      entries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Erreur getHistory:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getDashboard,
  getHistory
};
