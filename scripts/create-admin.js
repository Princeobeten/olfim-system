// Script to create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://user_db_user:r279PhhU0dKXoOsI@fuzzy-based-expert-syst.2cx2z6f.mongodb.net/olfim_system?retryWrites=true&w=majority";

// Define User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create User model
const User = mongoose.model('User', UserSchema);

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminUser.email });
      
      if (existingAdmin) {
        console.log('Admin user already exists');
      } else {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminUser.password, salt);
        
        // Create admin user
        const newAdmin = new User({
          name: adminUser.name,
          email: adminUser.email,
          password: hashedPassword,
          role: adminUser.role
        });
        
        await newAdmin.save();
        console.log('Admin user created successfully');
        console.log('Email:', adminUser.email);
        console.log('Password:', adminUser.password);
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      // Close MongoDB connection
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
