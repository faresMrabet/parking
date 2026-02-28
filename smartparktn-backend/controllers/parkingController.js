const Entry = require('../models/Entry');
const Vehicle = require('../models/Vehicle');
const Tariff = require('../models/Tariff');
const { calculateDuration, calculateAmount, validatePlate } = require('../utils/helpers');

// POST /api/entry - Enregistrer une entrée
const registerEntry = async (req, res) => {
  try {
    const { plateNumber } = req.body;

    if (!plateNumber) {
      return res.status(400).json({ error: 'Numéro de plaque requis' });
    }

    // Valider le format de la plaque
    if (!validatePlate(plateNumber)) {
      return res.status(400).json({ error: 'Format de plaque invalide' });
    }

    const upperPlate = plateNumber.toUpperCase();

    // Vérifier si le véhicule existe, sinon le créer
    let vehicle = await Vehicle.findOne({ plateNumber: upperPlate });
    if (!vehicle) {
      vehicle = await Vehicle.create({ plateNumber: upperPlate, type: 'Visiteur' });
    }

    // Vérifier la blacklist
    if (vehicle.isBlacklisted) {
      const entry = await Entry.create({
        plateNumber: upperPlate,
        status: 'refused',
        ruleApplied: 'Véhicule blacklisté'
      });
      return res.status(403).json({
        plateNumber: upperPlate,
        status: 'refused',
        reason: 'Véhicule blacklisté'
      });
    }

    // Vérifier si le véhicule est déjà dans le parking
    const existingEntry = await Entry.findOne({
      plateNumber: upperPlate,
      exitTime: null
    });

    if (existingEntry) {
      return res.status(400).json({
        error: 'Véhicule déjà dans le parking',
        entryTime: existingEntry.entryTime
      });
    }

    // Créer l'entrée
    const entry = await Entry.create({
      plateNumber: upperPlate,
      status: 'authorized',
      entryTime: new Date()
    });

    res.status(201).json({
      plateNumber: upperPlate,
      status: 'authorized',
      entryTime: entry.entryTime,
      vehicleType: vehicle.type
    });

  } catch (error) {
    console.error('Erreur registerEntry:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// POST /api/exit - Enregistrer une sortie
const registerExit = async (req, res) => {
  try {
    const { plateNumber } = req.body;

    if (!plateNumber) {
      return res.status(400).json({ error: 'Numéro de plaque requis' });
    }

    const upperPlate = plateNumber.toUpperCase();

    // Trouver l'entrée sans sortie
    const entry = await Entry.findOne({
      plateNumber: upperPlate,
      exitTime: null
    });

    if (!entry) {
      return res.status(404).json({
        error: 'Aucune entrée trouvée pour ce véhicule'
      });
    }

    // Récupérer le véhicule et le tarif
    const vehicle = await Vehicle.findOne({ plateNumber: upperPlate });
    let tariff = await Tariff.findOne();
    
    // Créer un tarif par défaut si inexistant
    if (!tariff) {
      tariff = await Tariff.create({
        freeHours: 2,
        hourlyRate: 1,
        vipFree: true
      });
    }

    const exitTime = new Date();
    const duration = calculateDuration(entry.entryTime, exitTime);
    
    // Calculer le montant selon le type de véhicule
    let amount = 0;
    let ruleApplied = '';

    if (vehicle.type === 'VIP' && tariff.vipFree) {
      amount = 0;
      ruleApplied = 'VIP - Gratuit';
    } else {
      amount = calculateAmount(duration, tariff);
      ruleApplied = `${tariff.freeHours}h gratuites puis ${tariff.hourlyRate} TND/heure`;
    }

    // Mettre à jour l'entrée
    entry.exitTime = exitTime;
    entry.duration = duration;
    entry.amount = amount;
    entry.ruleApplied = ruleApplied;
    await entry.save();

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
    console.error('Erreur registerExit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  registerEntry,
  registerExit
};
