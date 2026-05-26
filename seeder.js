const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Staff = require('./models/Staff');

dotenv.config();

const staffData = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'staff',
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'staff',
    },
];

const importData = async () => {
    try {
        await connectDB();

        // Clear existing staff
        await Staff.deleteMany();

        // Insert new staff
        await Staff.create(staffData);

        console.log('✅ Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with importing data: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Staff.deleteMany();

        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with destroying data: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
