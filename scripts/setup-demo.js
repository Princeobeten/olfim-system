// Script to set up the demo environment
const { execSync } = require('child_process');
const path = require('path');

console.log('Setting up demo environment...');

try {
  // Run create-admin.js
  console.log('\n1. Creating admin user...');
  execSync('node scripts/create-admin.js', { stdio: 'inherit' });
  
  // Run add-sample-items.js
  console.log('\n2. Adding sample items...');
  execSync('node scripts/add-sample-items.js', { stdio: 'inherit' });
  
  console.log('\nDemo setup completed successfully!');
  console.log('\nAdmin login credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
  console.log('\nYou can now start the application with:');
  console.log('npm run dev');
} catch (error) {
  console.error('Error setting up demo:', error.message);
  process.exit(1);
}
