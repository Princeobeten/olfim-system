/**
 * Test script to verify the application functionality
 * 
 * This script:
 * 1. Connects to the database
 * 2. Verifies that users exist
 * 3. Verifies that items exist
 * 4. Logs the results
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// Get MongoDB URI from environment variable or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/olfim';

async function testApp() {
  console.log('Starting application test...');
  console.log('MongoDB URI:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')); // Log URI with password masked

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const db = client.db();
    
    // Check users collection
    console.log('\n--- Checking Users ---');
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`Total users: ${userCount}`);
    
    if (userCount > 0) {
      console.log('Sample users:');
      const users = await usersCollection.find().limit(3).toArray();
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  Name: ${user.name || 'N/A'}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role || 'user'}`);
        console.log(`  Created: ${user.createdAt || 'N/A'}`);
      });
    } else {
      console.log('No users found in the database');
    }
    
    // Check items collection
    console.log('\n--- Checking Items ---');
    const itemsCollection = db.collection('items');
    const itemCount = await itemsCollection.countDocuments();
    console.log(`Total items: ${itemCount}`);
    
    if (itemCount > 0) {
      console.log('Sample items:');
      const items = await itemsCollection.find().limit(3).toArray();
      items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log(`  Type: ${item.type || 'N/A'}`);
        console.log(`  Category: ${item.category || 'N/A'}`);
        console.log(`  Description: ${item.description || 'N/A'}`);
        console.log(`  Status: ${item.status || 'N/A'}`);
        console.log(`  Created: ${item.createdAt || 'N/A'}`);
      });

      // Count items by type
      const lostCount = await itemsCollection.countDocuments({ type: 'lost' });
      const foundCount = await itemsCollection.countDocuments({ type: 'found' });
      console.log(`\nLost items: ${lostCount}`);
      console.log(`Found items: ${foundCount}`);

      // Count items by status
      const pendingCount = await itemsCollection.countDocuments({ status: 'pending' });
      const matchedCount = await itemsCollection.countDocuments({ status: 'matched' });
      const claimedCount = await itemsCollection.countDocuments({ status: 'claimed' });
      console.log(`\nPending items: ${pendingCount}`);
      console.log(`Matched items: ${matchedCount}`);
      console.log(`Claimed items: ${claimedCount}`);
    } else {
      console.log('No items found in the database');
    }

    // Check API endpoints (this would be better with actual HTTP requests)
    console.log('\n--- API Endpoints ---');
    console.log('Note: API endpoints can only be tested when the server is running.');
    console.log('To test API endpoints:');
    console.log('1. Start the server with: npm run dev');
    console.log('2. Access the following endpoints:');
    console.log('   - GET /api/items/search - Search for items');
    console.log('   - GET /api/items/admin - Get all items (admin)');
    console.log('   - POST /api/items/report - Report a new item');
    console.log('   - POST /api/auth/login - Login');
    console.log('   - POST /api/auth/signup - Signup');

    // Close connection
    await client.close();
    console.log('\nTest completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testApp();
