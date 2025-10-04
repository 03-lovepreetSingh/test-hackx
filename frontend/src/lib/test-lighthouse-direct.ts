import { lighthouse } from '@lighthouse-web3/sdk';

/**
 * Direct Lighthouse API test to check if IPNS operations work
 */
export async function testLighthouseDirect() {
  console.log('🚀 Testing Lighthouse API Directly...\n');

  // Get API keys from environment
  const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || process.env.LIGHTHOUSE_KEY || '';
  const privateKey = process.env.LIGHTHOUSE_PRIVATE_KEY || '';

  console.log('🔑 API Keys Status:');
  console.log(`   - API Key: ${apiKey ? 'SET' : 'NOT SET'} (${apiKey.length} chars)`);
  console.log(`   - Private Key: ${privateKey ? 'SET' : 'NOT SET'} (${privateKey.length} chars)`);

  if (!apiKey || !privateKey) {
    console.log('❌ Missing API keys');
    return { success: false, error: 'Missing API keys' };
  }

  try {
    // Test 1: Generate IPNS key
    console.log('\n1️⃣ Testing IPNS key generation...');
    try {
      const keyResponse = await lighthouse.generateKey(apiKey);
      console.log('✅ IPNS key generated successfully');
      console.log('Response:', JSON.stringify(keyResponse, null, 2));

      if (keyResponse.data) {
        const { ipnsName, ipnsId } = keyResponse.data;
        console.log(`   - IPNS Name: ${ipnsName}`);
        console.log(`   - IPNS ID: ${ipnsId}`);

        // Test 2: Upload test data to IPFS
        console.log('\n2️⃣ Testing IPFS upload...');
        const testData = {
          test: true,
          timestamp: Date.now(),
          message: 'Lighthouse IPNS test'
        };

        const uploadResponse = await lighthouse.uploadText(
          JSON.stringify(testData),
          apiKey
        );
        console.log('✅ IPFS upload successful');
        console.log('Upload Response:', JSON.stringify(uploadResponse, null, 2));

        if (uploadResponse.data && uploadResponse.data.Hash) {
          const cid = uploadResponse.data.Hash;
          console.log(`   - CID: ${cid}`);

          // Test 3: Publish to IPNS
          console.log('\n3️⃣ Testing IPNS publish...');
          const publishResponse = await lighthouse.publishRecord(
            cid,
            ipnsName,
            apiKey
          );
          console.log('✅ IPNS publish successful');
          console.log('Publish Response:', JSON.stringify(publishResponse, null, 2));

          if (publishResponse.data && publishResponse.data.Name) {
            console.log(`   - Published IPNS: ${publishResponse.data.Name}`);

            // Test 4: Get all IPNS keys
            console.log('\n4️⃣ Testing get all IPNS keys...');
            const keysResponse = await lighthouse.getAllKeys(apiKey);
            console.log('✅ IPNS keys retrieved successfully');
            console.log(`Found ${keysResponse.data?.length || 0} keys`);

            if (keysResponse.data && keysResponse.data.length > 0) {
              console.log('\n📋 All IPNS Keys:');
              keysResponse.data.forEach((key, index) => {
                console.log(`   ${index + 1}. ${key.ipnsName} - ${key.ipnsId}`);
              });
            }

            // Test 5: Try to resolve IPNS
            console.log('\n5️⃣ Testing IPNS resolution...');
            try {
              const resolveUrl = `https://gateway.lighthouse.storage/ipns/${publishResponse.data.Name}`;
              console.log(`Trying to resolve: ${resolveUrl}`);

              const resolveResponse = await fetch(resolveUrl);
              if (resolveResponse.ok) {
                const resolvedContent = await resolveResponse.text();
                console.log('✅ IPNS resolution successful');
                console.log(`Resolved content: ${resolvedContent.slice(0, 100)}...`);
              } else {
                console.log(`❌ IPNS resolution failed: ${resolveResponse.status} ${resolveResponse.statusText}`);
              }
            } catch (resolveError) {
              console.log(`❌ IPNS resolution error: ${resolveError.message}`);
            }

            return {
              success: true,
              data: {
                ipnsName,
                ipnsId: publishResponse.data.Name,
                cid,
                keysCount: keysResponse.data?.length || 0
              }
            };
          }
        }
      }
    } catch (lighthouseError) {
      console.log('❌ Lighthouse API error:', lighthouseError);
      console.log('Error details:', JSON.stringify(lighthouseError, null, 2));
      return { success: false, error: lighthouseError.message || lighthouseError };
    }
  } catch (error) {
    console.log('❌ General error:', error);
    return { success: false, error: error.message || error };
  }

  return { success: false, error: 'Unknown error occurred' };
}

/**
 * Check if public IPNS records exist
 */
export async function checkPublicIPNS() {
  console.log('\n🔍 Checking Public IPNS Records...\n');

  // Try to resolve some known public IPNS records
  const publicIPNSRecords = [
    'k51qzi5uqu5dlr99jbwpbli7iqtdd60c8hk0wgrsxyvzu3lhymapd1rn4npdd8', // Example IPNS
    'QmYPnb2hVQgKqAHqWtVq9C8Zk3BfB7qXa3qK9F3w4YbJ8f3' // Example CID (not IPNS)
  ];

  for (const record of publicIPNSRecords) {
    console.log(`Checking: ${record}`);
    try {
      const gateways = [
        `https://gateway.lighthouse.storage/ipns/${record}`,
        `https://ipfs.io/ipns/${record}`,
        `https://cloudflare-ipfs.com/ipns/${record}`
      ];

      for (const gateway of gateways) {
        try {
          const response = await fetch(gateway);
          if (response.ok) {
            const content = await response.text();
            console.log(`✅ Resolved via ${gateway}: ${content.slice(0, 100)}...`);
            break;
          }
        } catch (gatewayError) {
          // Try next gateway
        }
      }
    } catch (error) {
      console.log(`❌ Failed to resolve: ${error.message}`);
    }
  }
}