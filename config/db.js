const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/ca-crm-backend';

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 20,        // important for Render
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    console.log('✅ MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

module.exports = connectDB