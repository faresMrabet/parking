// Calcule la durée en heures entre deux dates
const calculateDuration = (entryTime, exitTime) => {
  const durationMs = new Date(exitTime) - new Date(entryTime);
  const durationHours = durationMs / (1000 * 60 * 60);
  return Math.round(durationHours * 100) / 100; // Arrondi à 2 décimales
};

// Calcule le montant à payer selon le tarif
const calculateAmount = (duration, tariff) => {
  if (duration <= tariff.freeHours) {
    return 0;
  }
  const chargeableHours = duration - tariff.freeHours;
  return Math.round(chargeableHours * tariff.hourlyRate * 100) / 100;
};

// Valide le format de plaque tunisienne (ex: 123TUN4567)
const validatePlate = (plateNumber) => {
  const tunisianPlateRegex = /^\d{1,3}[A-Z]{2,3}\d{1,4}$/;
  return tunisianPlateRegex.test(plateNumber.toUpperCase());
};

module.exports = {
  calculateDuration,
  calculateAmount,
  validatePlate
};
