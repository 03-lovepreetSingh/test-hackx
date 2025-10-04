// Quick test for IPNS resolution - run with: node src/lib/quick-ipns-test.js

const { getMasterIPNSService } = require('./master-ipns-storage');

async function quickTest() {
  console.log('🚀 Quick IPNS Test Started...\n');

  try {
    // Test 1: Check configuration
    console.log('1️⃣ Checking configuration...');
    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || process.env.LIGHTHOUSE_KEY;
    const privateKey = process.env.LIGHTHOUSE_PRIVATE_KEY;

    console.log('📋 Environment variables:');
    console.log(`   - NEXT_PUBLIC_LIGHTHOUSE_API_KEY: ${apiKey ? `${apiKey.slice(0, 10)}...` : 'NOT SET'}`);
    console.log(`   - LIGHTHOUSE_KEY: ${process.env.LIGHTHOUSE_KEY ? `${process.env.LIGHTHOUSE_KEY.slice(0, 10)}...` : 'NOT SET'}`);
    console.log(`   - LIGHTHOUSE_PRIVATE_KEY: ${privateKey ? `${privateKey.slice(0, 10)}...` : 'NOT SET'}`);

    if (!apiKey || !privateKey) {
      console.log('❌ Missing credentials - please check your .env file');
      return;
    }

    // Test 2: Try to create service
    console.log('\n2️⃣ Creating service...');
    const service = getMasterIPNSService();
    console.log('✅ Service created successfully');

    // Test 3: Try to get IPNS keys
    console.log('\n3️⃣ Getting IPNS keys...');
    const keys = await service.getAllIPNSKeys();
    console.log(`✅ Found ${keys.length} IPNS keys`);

    if (keys.length > 0) {
      console.log('\n📋 IPNS Keys:');
      keys.forEach((key, index) => {
        console.log(`   ${index + 1}. ${key.ipnsName} - ${key.ipnsId}`);
      });

      // Test 4: Try to resolve first key
      console.log('\n4️⃣ Testing IPNS resolution...');
      const firstKey = keys[0];
      console.log(`Trying to resolve: ${firstKey.ipnsId}`);

      try {
        const resolved = await service.resolveIPNS(firstKey.ipnsId);
        console.log(`✅ Resolved successfully: ${resolved.slice(0, 100)}...`);
      } catch (resolveError) {
        console.log(`❌ Resolution failed: ${resolveError.message}`);
      }

      // Test 5: Try CID resolution
      console.log('\n5️⃣ Testing CID resolution...');
      try {
        const cid = await service.resolveIPNSToCID(firstKey.ipnsId);
        console.log(`✅ CID resolved: ${cid}`);
      } catch (cidError) {
        console.log(`❌ CID resolution failed: ${cidError.message}`);
      }
    } else {
      console.log('\n⚠️ No IPNS keys found - system not initialized yet');
    }

    // Test 6: Try to create test data
    console.log('\n6️⃣ Creating test hackathon...');
    const testHackathon = {
      id: `test-${Date.now()}`,
      title: 'Test Hackathon for IPNS',
      description: 'This is a test to verify IPNS functionality',
      status: 'live',
      registrationClose: '2024-12-31',
      registrationDaysLeft: 30,
      techStack: 'React, TypeScript, IPFS, IPNS',
      level: 'All levels',
      totalPrize: 5000,
      location: 'Online',
      tags: ['Test', 'IPNS', 'Web3'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    try {
      const createdId = await service.createHackathon(testHackathon);
      console.log(`✅ Test hackathon created: ${createdId}`);

      // Test 7: Try to retrieve it
      console.log('\n7️⃣ Retrieving test hackathon...');
      const retrieved = await service.getHackathonById(createdId);
      if (retrieved) {
        console.log(`✅ Retrieved successfully: ${retrieved.title}`);
      } else {
        console.log('❌ Failed to retrieve hackathon');
      }
    } catch (createError) {
      console.log(`❌ Creation failed: ${createError.message}`);
    }

    console.log('\n🏁 Quick test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
quickTest();