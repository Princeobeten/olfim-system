// Script to add a test item to the database
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/olfim';

console.log('MongoDB URI:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@'));

// Define Item schema
const ItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please specify if the item is lost or found']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the item'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide the location where the item was lost/found'],
    trim: true
  },
  image: {
    type: String,
    default: '' // URL to the image
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'claimed'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  contactInfo: {
    type: String,
    default: ''
  }
});

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

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Create models
      const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
      const User = mongoose.models.User || mongoose.model('User', UserSchema);
      
      // Find admin user
      const admin = await User.findOne({ email: 'admin@example.com' });
      
      if (!admin) {
        console.error('Admin user not found. Please run create-admin.js first.');
        return;
      }
      
      // Create test item
      const testItem = new Item({
        type: 'lost',
        description: 'Test Item - Keys with blue keychain',
        category: 'Keys',
        location: 'Main Building, Room 101',
        image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        status: 'pending',
        userId: admin._id,
        isAnonymous: false,
        contactInfo: 'admin@example.com',
        createdAt: new Date()
      });
      
      // Save test item
      await testItem.save();
      console.log('Test item added successfully:', testItem);
      
    } catch (error) {
      console.error('Error adding test item:', error);
    } finally {
      // Close MongoDB connection
      mongoose.connection.close();
      console.log('\nMongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
