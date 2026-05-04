const mongoose = require('mongoose');

const GeneralSettingSchema = new mongoose.Schema({
  logo: {
    type: String,
    default: '/logo.png' // Default fallback
  },
  marqueName: {
    type: String,
    default: '',
    trim: true,
  },
  marqueLink: {
    type: String,
    default: '',
    trim: true,
  }
});

module.exports = mongoose.model('GeneralSetting', GeneralSettingSchema);
