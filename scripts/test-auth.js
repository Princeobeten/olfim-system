/**
 * Simple test script for authentication API routes
 * 
 * To run this script:
 * 1. Make sure your Next.js server is running
 * 2. Execute: node scripts/test-auth.js
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
  password: 'password123'
};

let authToken = '';

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

async function testGetCurrentUser() {
  console.log('\n--- Testing Get Current User ---');
  
  const { status, data } = await makeRequest('/auth/me');
  
  console.log(`Status: ${status}`);
  console.log('Response:', data);
  
  if (status === 200 && data.success && data.user) {
    console.log('✅ Get current user successful');
    return true;
  } else {
    console.log('❌ Get current user failed');
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Starting authentication API tests...');
  
  // Test signup
  const signupSuccess = await testSignup();
  if (!signupSuccess) {
    console.log('❌ Signup test failed. Stopping tests.');
    return;
  }
  
  // Test login
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log('❌ Login test failed. Stopping tests.');
    return;
  }
  
  // Test get current user
  const getCurrentUserSuccess = await testGetCurrentUser();
  if (!getCurrentUserSuccess) {
    console.log('❌ Get current user test failed.');
    return;
  }
  
  console.log('\n✅ All authentication tests passed successfully!');
}

// Execute tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
