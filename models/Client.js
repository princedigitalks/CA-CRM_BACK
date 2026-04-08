const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  uploadedAt: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, default: '' },
  itrYear: { type: String },
  filePath: { type: String },
}, { _id: true });

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
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