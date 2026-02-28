const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  entryTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  exitTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number,
    default: null
  },
  amount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['authorized', 'refused'],
    required: true
  },
  ruleApplied: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Entry', entrySchema);
