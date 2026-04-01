const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const exists = await Admin.findOne({ email: 'demo@gmail.com' });
    if (!exists) {
      const admin = new Admin({
        email: 'demo@gmail.com',
        password: 'admin',
      });
      await admin.save();
      console.log('Admin created: demo@gmail.com / admin');
    } else {
      console.log('Admin already exists');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
