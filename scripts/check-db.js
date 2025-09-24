// Script to check the database connection and items
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
      
      // Check users
      const users = await User.find();
      console.log(`Found ${users.length} users:`);
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}), role: ${user.role}`);
      });
      
      // Check items
      const items = await Item.find();
      console.log(`\nFound ${items.length} items:`);
      
      if (items.length > 0) {
        items.forEach(item => {
          console.log(`- ${item.type} item: "${item.description}" (${item.category}), status: ${item.status}`);
        });
      } else {
        console.log('No items found in the database.');
      }
      
    } catch (error) {
      console.error('Error checking database:', error);
    } finally {
      // Close MongoDB connection
      mongoose.connection.close();
      console.log('\nMongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
