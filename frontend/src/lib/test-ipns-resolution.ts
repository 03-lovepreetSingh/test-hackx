import { getMasterIPNSService } from './master-ipns-storage';

/**
 * Test script to check IPNS resolution functionality
 */
async function testIPNSResolution() {
  console.log('🔍 Testing IPNS Resolution...\n');

  try {
    const service = getMasterIPNSService();

    // Test 1: Check if we can get all IPNS keys
    console.log('1️⃣ Getting all IPNS keys...');
    const keys = await service.getAllIPNSKeys();
    console.log(`✅ Found ${keys.length} IPNS keys:`);
    keys.forEach(key => {
      console.log(`   - ${key.ipnsName} (${key.ipnsId})`);
    });

    // Test 2: Check master IPNS key
    console.log('\n2️⃣ Checking master IPNS key...');
    const masterKey = keys.find(key => key.ipnsName === service.getMasterIPNS());
    if (masterKey) {
      console.log(`✅ Master IPNS key found: ${masterKey.ipnsId}`);
    } else {
      console.log('❌ Master IPNS key not found');
    }

    // Test 3: Try to get master index
    console.log('\n3️⃣ Getting master index...');
    try {
      const masterIndex = await service.getMasterIndex();
      console.log(`✅ Master index retrieved successfully`);
      console.log(`   - Total hackathons: ${masterIndex.hackathons.length}`);
      console.log(`   - Active hackathons: ${masterIndex.hackathons.filter(h => h.status === 'active').length}`);
      console.log(`   - Last updated: ${new Date(masterIndex.metadata.lastUpdated).toISOString()}`);

      if (masterIndex.hackathons.length > 0) {
        console.log('\n📋 Hackathons in master index:');
        masterIndex.hackathons.forEach(h => {
          console.log(`   - ${h.title} (${h.status}) - IPNS: ${h.ipnsRecord}`);
        });
      }
    } catch (indexError) {
      console.log(`❌ Failed to get master index: ${indexError}`);
    }

    // Test 4: Test IPNS resolution if we have keys
    if (keys.length > 0) {
      console.log('\n4️⃣ Testing IPNS resolution...');
      for (const key of keys.slice(0, 3)) { // Test first 3 keys
        try {
          console.log(`\n   Resolving ${key.ipnsName}...`);
          const cid = await service.resolveIPNSToCID(key.ipnsId);
          console.log(`   ✅ Resolved to CID: ${cid}`);
        } catch (resolveError) {
          console.log(`   ❌ Failed to resolve: ${resolveError}`);
        }
      }
    }

    // Test 5: Try to fetch data from IPFS if we have hackathons
    if (keys.length > 0) {
      console.log('\n5️⃣ Testing IPFS data fetch...');
      try {
        const hackathons = await service.getAllHackathons();
        console.log(`✅ Successfully fetched ${hackathons.length} hackathons from IPFS`);

        if (hackathons.length > 0) {
          console.log('\n📄 Sample hackathon data:');
          const sample = hackathons[0];
          console.log(`   - Title: ${sample.title}`);
          console.log(`   - ID: ${sample.id}`);
          console.log(`   - Status: ${sample.status}`);
        }
      } catch (fetchError) {
        console.log(`❌ Failed to fetch hackathons: ${fetchError}`);
      }
    }

    console.log('\n🏁 IPNS Resolution Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

/**
 * Test Lighthouse API connectivity
 */
async function testLighthouseConnectivity() {
  console.log('🌐 Testing Lighthouse API Connectivity...\n');

  try {
    const service = getMasterIPNSService();

    // Test generating a new key
    console.log('1️⃣ Testing IPNS key generation...');
    try {
      const newKey = await service.generateIPNSKey();
      console.log(`✅ Successfully generated new IPNS key:`);
      console.log(`   - Name: ${newKey.ipnsName}`);
      console.log(`   - ID: ${newKey.ipnsId}`);
    } catch (keyError) {
      console.log(`❌ Failed to generate IPNS key: ${keyError}`);
    }

    // Test uploading to IPFS
    console.log('\n2️⃣ Testing IPFS upload...');
    try {
      const testData = {
        test: true,
        timestamp: Date.now(),
        message: 'IPNS resolution test'
      };
      const ipfsHash = await service.uploadToIPFS(testData);
      console.log(`✅ Successfully uploaded to IPFS: ${ipfsHash}`);

      // Test downloading from IPFS
      console.log('\n3️⃣ Testing IPFS download...');
      const downloadedData = await service.downloadFromIPFS(ipfsHash);
      console.log(`✅ Successfully downloaded from IPFS:`, downloadedData);
    } catch (ipfsError) {
      console.log(`❌ IPFS operation failed: ${ipfsError}`);
    }

    console.log('\n🏁 Lighthouse Connectivity Test Complete!');

  } catch (error) {
    console.error('❌ Connectivity test failed:', error);
  }
}

// Export functions for manual testing
export { testIPNSResolution, testLighthouseConnectivity };

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  (async () => {
    await testLighthouseConnectivity();
    console.log('\n' + '='.repeat(50) + '\n');
    await testIPNSResolution();
  })();
}