const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  size: { type: String, required: true, trim: true },
  uploadedAt: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  subCategory: { type: String, default: '', trim: true },
  itrYear: { type: String, trim: true },
  filePath: { type: String, trim: true },
}, { _id: true });

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  documents: [documentSchema],
}, { _id: true });

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  paymentStatus: { type: String, enum: ['CLEAR', 'PENDING'], default: 'PENDING' },
  serviceEnabled: { type: Boolean, default: true },
  createdAt: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  documents: [documentSchema],
  familyMembers: [familyMemberSchema],
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);