const mongoose = require('mongoose');

const tariffSchema = new mongoose.Schema({
  freeHours: {
    type: Number,
    default: 2
  },
  hourlyRate: {
    type: Number,
    default: 1
  },
  vipFree: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tariff', tariffSchema);
