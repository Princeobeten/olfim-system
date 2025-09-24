/**
 * Simple test script for the OLFIM System API routes
 * 
 * To run this script:
 * 1. Make sure your Next.js server is running
 * 2. Execute: node scripts/test-api.js
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  name: 'Test Admin',
  email: `admin${Date.now()}@example.com`, // Unique email to avoid conflicts
  password: 'password123',
  role: 'admin'
};
const TEST_ITEM = {
  type: 'lost',
  description: 'Black iPhone 13 with red case',
  category: 'Electronics',
  location: 'Library',
  image: 'https://via.placeholder.com/150'
};

let authToken = '';
let testItemId = '';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const options = {
    method,
    headers
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error);
    return { status: 500, data: { error: error.message } };
  }
}

// Test functions
async function testSignup() {
  console.log('\n--- Testing Signup ---');
  console.log(`Creating user with email: ${TEST_USER.email}`);
  
  const { status, data } = await makeRequest('/auth/signup', 'POST', TEST_USER);
  
  console.log(`Status: ${status}`);
  console.log('Response:', data);
  
  if (status === 201 && data.success && data.user && data.user.token) {
    console.log('✅ Signup successful');
    authToken = data.user.token;
    return true;
  } else {
    console.log('❌ Signup failed');
    return false;
  }
}

async function testLogin() {
  console.log('\n--- Testing Login ---');
  
  const { status, data } = await makeRequest('/auth/login', 'POST', {
    email: TEST_USER.email,
    password: TEST_USER.password
  });
  
  console.log(`Status: ${status}`);
  console.log('Response:', data);
  
  if (status === 200 && data.success && data.user && data.user.token) {
    console.log('✅ Login successful');
    authToken = data.user.token;
    return true;
  } else {
    console.log('❌ Login failed');
    return false;
  }
}

async function testReportItem() {
  console.log('\n--- Testing Report Item ---');
  
  const { status, data } = await makeRequest('/items/report', 'POST', TEST_ITEM);
  
  console.log(`Status: ${status}`);
  console.log('Response:', data);
  
  if (status === 201 && data.success && data.item) {
    console.log('✅ Report item successful');
    testItemId = data.item._id;
    return true;
  } else {
    console.log('❌ Report item failed');
    return false;
  }
}

async function testSearchItems() {
  console.log('\n--- Testing Search Items ---');
  
  const { status, data } = await makeRequest('/items/search?query=iPhone');
  
  console.log(`Status: ${status}`);
  console.log('Response:', data);
  
  if (status === 200 && data.success && Array.isArray(data.items)) {
    console.log(`✅ Search items successful (found ${data.items.length} items)`);
    return true;
  } else {
    console.log('❌ Search items failed');
    return false;
  }
}

async function testAdminItems() {
  console.log('\n--- Testing Admin Items ---');
  
  const { status, data } = await makeRequest('/items/admin');
  
  console.log(`Status: ${status}`);
  console.log('Response:', data);
  
  if (status === 200 && data.success && Array.isArray(data.items)) {
    console.log(`✅ Admin items successful (found ${data.items.length} items)`);
    return true;
  } else {
    console.log('❌ Admin items failed');
    return false;
  }
}

async function testUpdateItemStatus() {
  if (!testItemId) {
    console.log('\n❌ Cannot test update item status: No test item ID available');
    return false;
  }
  
  console.log('\n--- Testing Update Item Status ---');
  
  const { status, data } = await makeRequest('/items/admin', 'PUT', {
    itemId: testItemId,
    status: 'matched'
  });
  
  console.log(`Status: ${status}`);
  console.log('Response:', data);
  
  if (status === 200 && data.success && data.item && data.item.status === 'matched') {
    console.log('✅ Update item status successful');
    return true;
  } else {
    console.log('❌ Update item status failed');
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Starting OLFIM System API tests...');
  
  // Test signup
  const signupSuccess = await testSignup();
  if (!signupSuccess) {
    console.log('❌ Signup test failed. Trying login...');
    // Try login instead
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
      console.log('❌ Both signup and login failed. Stopping tests.');
      return;
    }
  }
  
  // Test report item
  const reportSuccess = await testReportItem();
  if (!reportSuccess) {
    console.log('❌ Report item test failed. Stopping tests.');
    return;
  }
  
  // Test search items
  await testSearchItems();
  
  // Test admin items
  await testAdminItems();
  
  // Test update item status
  await testUpdateItemStatus();
  
  console.log('\n✅ All tests completed!');
}

// Execute tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
