// Script to add sample items to the database
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://user_db_user:r279PhhU0dKXoOsI@fuzzy-based-expert-syst.2cx2z6f.mongodb.net/olfim_system?retryWrites=true&w=majority";

// Define Item schema
const ItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
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
  contactInfo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Item model
const Item = mongoose.model('Item', ItemSchema);

// Sample items
const sampleItems = [
  {
    type: 'lost',
    description: 'Blue backpack with laptop inside',
    category: 'Accessories',
    location: 'University Library, 2nd floor',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    isAnonymous: true,
    contactInfo: 'john@example.com',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    type: 'found',
    description: 'iPhone 13 Pro with red case',
    category: 'Electronics',
    location: 'Student Center Cafeteria',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    isAnonymous: true,
    contactInfo: 'security@campus.edu',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    type: 'lost',
    description: 'Car keys with a rabbit keychain',
    category: 'Keys',
    location: 'Parking Lot B',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    isAnonymous: true,
    contactInfo: 'alice@example.com',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    type: 'found',
    description: 'Black wallet with student ID',
    category: 'Wallets',
    location: 'Gym locker room',
    image: 'https://images.unsplash.com/photo-1556089309-e37980e7f5b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    status: 'matched',
    isAnonymous: true,
    contactInfo: 'gym@campus.edu',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  },
  {
    type: 'lost',
    description: 'Prescription glasses with black frame',
    category: 'Accessories',
    location: 'Science Building, Room 302',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    isAnonymous: true,
    contactInfo: 'bob@example.com',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    type: 'found',
    description: 'Textbook: Introduction to Computer Science',
    category: 'Books',
    location: 'Computer Lab',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    isAnonymous: true,
    contactInfo: 'lab@campus.edu',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
  }
];

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Get default user ID (admin)
      const User = mongoose.model('User', new mongoose.Schema({}));
      const admin = await User.findOne({ email: 'admin@example.com' });
      
      if (!admin) {
        console.error('Admin user not found. Please run create-admin.js first.');
        return;
      }
      
      // Add userId to all sample items
      const itemsWithUserId = sampleItems.map(item => ({
        ...item,
        userId: admin._id
      }));
      
      // Check if items already exist
      const existingItemsCount = await Item.countDocuments();
      
      if (existingItemsCount > 0) {
        console.log(`${existingItemsCount} items already exist in the database.`);
        console.log('Do you want to add more sample items? (y/n)');
        
        // For simplicity, we'll just add them anyway in this script
        console.log('Adding sample items anyway...');
      }
      
      // Insert sample items
      await Item.insertMany(itemsWithUserId);
      console.log(`${itemsWithUserId.length} sample items added successfully`);
      
    } catch (error) {
      console.error('Error adding sample items:', error);
    } finally {
      // Close MongoDB connection
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
