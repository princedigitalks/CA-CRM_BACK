const mongoose = require('mongoose');

const ItrYearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('ItrYear', ItrYearSchema);
