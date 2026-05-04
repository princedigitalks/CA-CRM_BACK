const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, default: '', trim: true },
  email: { type: String, default: '', trim: true },
  fcmToken: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
