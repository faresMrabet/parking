require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const Tariff = require('./models/Tariff');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur connexion:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Nettoyer les données existantes
    await Vehicle.deleteMany({});
    await Tariff.deleteMany({});
    console.log('🗑️  Données existantes supprimées');

    // Créer le tarif par défaut
    const tariff = await Tariff.create({
      freeHours: 2,
      hourlyRate: 1,
      vipFree: true
    });
    console.log('✅ Tarif créé:', tariff);

    // Créer des véhicules de test
    const vehicles = await Vehicle.insertMany([
      { plateNumber: '123TUN4567', type: 'Visiteur', isBlacklisted: false },
      { plateNumber: '456TUN7890', type: 'Abonné', isBlacklisted: false },
      { plateNumber: '789TUN1234', type: 'VIP', isBlacklisted: false },
      { plateNumber: '999TUN9999', type: 'Visiteur', isBlacklisted: true }
    ]);
    console.log('✅ Véhicules créés:', vehicles.length);

    console.log('\n📋 Véhicules de test:');
    vehicles.forEach(v => {
      console.log(`  - ${v.plateNumber} (${v.type}) ${v.isBlacklisted ? '🚫 BLACKLISTÉ' : '✅'}`);
    });

    console.log('\n✅ Seed terminé avec succès!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur seed:', error);
    process.exit(1);
  }
};

seedData();
