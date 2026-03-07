require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set. Create a .env file in the backend directory.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ username: 'Agentlab9@gmail.com' });
    if (existing) {
      console.log('Admin account already exists.');
      await mongoose.disconnect();
      return;
    }

    await User.create({
      username: 'Agentlab9@gmail.com',
      password: 'AliAhmed87879596',
      name: 'Admin',
      role: 'admin',
      isActive: true,
    });

    console.log('Admin account created successfully!');
    console.log('Username: Agentlab9@gmail.com');
    console.log('Role: admin');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
