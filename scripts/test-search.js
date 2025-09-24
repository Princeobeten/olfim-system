/**
 * Test script for search functionality
 * 
 * This script:
 * 1. Connects to the database
 * 2. Performs various search queries
 * 3. Logs the results
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// Get MongoDB URI from environment variable or use default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/olfim';

// Define test search queries
const testSearches = [
  { name: 'All items (no filters)', query: {} },
  { name: 'Lost items only', query: { type: 'lost' } },
  { name: 'Found items only', query: { type: 'found' } },
  { name: 'Electronics category', query: { category: 'Electronics' } },
  { name: 'Text search for "phone"', query: { description: { $regex: 'phone', $options: 'i' } } },
  { name: 'Combined search (lost electronics)', query: { type: 'lost', category: 'Electronics' } }
];

async function testSearch() {
  console.log('Starting search functionality test...');
  console.log('MongoDB URI:', MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')); // Log URI with password masked

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const db = client.db();
    const itemsCollection = db.collection('items');
    
    // Get total count of items
    const totalItems = await itemsCollection.countDocuments();
    console.log(`\nTotal items in database: ${totalItems}`);
    
    if (totalItems === 0) {
      console.log('No items found in the database. Please add some items first.');
      await client.close();
      return;
    }
    
    // Run test searches
    console.log('\n--- Running Test Searches ---');
    
    for (const test of testSearches) {
      console.log(`\n${test.name}:`);
      console.log(`Query: ${JSON.stringify(test.query)}`);
      
      const results = await itemsCollection.find(test.query).limit(5).toArray();
      console.log(`Found ${results.length} items (showing up to 5):`);
      
      if (results.length > 0) {
        results.forEach((item, index) => {
          console.log(`\nItem ${index + 1}:`);
          console.log(`  Type: ${item.type || 'N/A'}`);
          console.log(`  Category: ${item.category || 'N/A'}`);
          console.log(`  Description: ${item.description || 'N/A'}`);
          console.log(`  Status: ${item.status || 'N/A'}`);
        });
      } else {
        console.log('No items found matching this query.');
      }
    }
    
    // Test the search API route simulation
    console.log('\n--- Simulating API Search Logic ---');
    
    // Simulate a search with query, type, and category
    const simulatedApiSearch = async (searchParams) => {
      console.log(`\nSimulated API search with params: ${JSON.stringify(searchParams)}`);
      
      const searchQuery = {};
      
      if (searchParams.query) {
        searchQuery.description = { $regex: searchParams.query, $options: 'i' };
      }
      
      if (searchParams.type && searchParams.type !== 'all') {
        searchQuery.type = searchParams.type;
      }
      
      if (searchParams.category && searchParams.category !== 'All Categories') {
        searchQuery.category = searchParams.category;
      }
      
      console.log(`MongoDB query: ${JSON.stringify(searchQuery)}`);
      
      const results = await itemsCollection.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
        
      console.log(`Found ${results.length} items (showing up to 5):`);
      
      if (results.length > 0) {
        results.forEach((item, index) => {
          console.log(`\nItem ${index + 1}:`);
          console.log(`  Type: ${item.type || 'N/A'}`);
          console.log(`  Category: ${item.category || 'N/A'}`);
          console.log(`  Description: ${item.description || 'N/A'}`);
          console.log(`  Status: ${item.status || 'N/A'}`);
        });
      } else {
        console.log('No items found matching this query.');
      }
      
      return results;
    };
    
    // Run simulated API searches
    await simulatedApiSearch({ query: 'phone' });
    await simulatedApiSearch({ type: 'lost' });
    await simulatedApiSearch({ category: 'Electronics' });
    await simulatedApiSearch({ query: 'wallet', type: 'found' });
    
    // Close connection
    await client.close();
    console.log('\nTest completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testSearch();
