require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function makeAdmin(email) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`User ${user.email} is now an admin`);
    } else {
      console.log('User not found');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  process.exit(1);
}

makeAdmin(email);