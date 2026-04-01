const mongoose = require('mongoose');

const GeneralSettingSchema = new mongoose.Schema({
  logo: {
    type: String,
    default: '/logo.png' // Default fallback
  },
  marqueName: {
    type: String,
    default: ''
  },
  marqueLink: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('GeneralSetting', GeneralSettingSchema);
