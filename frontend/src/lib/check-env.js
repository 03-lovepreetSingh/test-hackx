// Simple environment checker
// Run with: node src/lib/check-env.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Environment Variables...\n');

const vars = [
  'NEXT_PUBLIC_LIGHTHOUSE_API_KEY',
  'LIGHTHOUSE_KEY',
  'LIGHTHOUSE_PRIVATE_KEY',
  'NEXT_PUBLIC_HACKATHONS_IPNS',
  'DATABASE_URL'
];

vars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.slice(0, 10)}...${value.slice(-5)}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n📋 Environment Summary:');
const hasApiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || process.env.LIGHTHOUSE_KEY;
const hasPrivateKey = process.env.LIGHTHOUSE_PRIVATE_KEY;

if (hasApiKey && hasPrivateKey) {
  console.log('✅ Lighthouse credentials are properly configured');
} else {
  console.log('❌ Lighthouse credentials are missing');
  console.log('\n🔧 To fix this, add to your .env.local file:');
  console.log('NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_api_key_here');
  console.log('LIGHTHOUSE_PRIVATE_KEY=your_private_key_here');
}