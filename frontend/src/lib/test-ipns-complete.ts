import { lighthouse } from '@lighthouse-web3/sdk';
import { getMasterIPNSService } from './master-ipns-storage';

/**
 * Complete IPNS functionality test with proper Lighthouse credentials
 */
export async function testCompleteIPNSFlow() {
  console.log('🚀 Complete IPNS Flow Test with New Credentials\n');

  const apiKey = 'fb05215f.8b154384f7d8457e8d5b27a8a16219af';
  const publicKey = '0x42785cf8870C9851eDD5a8cEE0303CbE3FED9419';

  console.log('🔑 Using credentials:');
  console.log(`   - API Key: ${apiKey}`);
  console.log(`   - Public Address: ${publicKey}`);

  try {
    // Test 1: Validate API key
    console.log('\n1️⃣ Validating API key...');
    const validationResponse = await fetch('https://api.lighthouse.storage/api/v0/user/api_key_limit', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (validationResponse.ok) {
      const data = await validationResponse.json();
      console.log('✅ API key is valid');
      console.log(`   - Data limit: ${data.data?.limit || 'Unknown'}`);
      console.log(`   - Data used: ${data.data?.usage || 'Unknown'}`);
    } else {
      console.log('❌ API key validation failed');
      console.log(`   - Status: ${validationResponse.status}`);
      return { success: false, error: 'Invalid API key' };
    }

    // Test 2: Generate IPNS key
    console.log('\n2️⃣ Generating IPNS key...');
    try {
      const keyResponse = await lighthouse.generateKey(apiKey);
      if (keyResponse.data) {
        console.log('✅ IPNS key generated successfully');
        console.log(`   - IPNS Name: ${keyResponse.data.ipnsName}`);
        console.log(`   - IPNS ID: ${keyResponse.data.ipnsId}`);

        // Test 3: Upload test data to IPFS
        console.log('\n3️⃣ Uploading test data to IPFS...');
        const testData = {
          type: 'test-hackathon',
          timestamp: Date.now(),
          data: {
            id: 'test-' + Date.now(),
            title: 'Test IPNS Hackathon',
            description: 'This hackathon tests IPNS functionality',
            status: 'live',
            totalPrize: 10000,
            location: 'Online',
            tags: ['IPNS', 'Test', 'Lighthouse']
          }
        };

        const uploadResponse = await lighthouse.uploadText(
          JSON.stringify(testData),
          apiKey
        );

        if (uploadResponse.data && uploadResponse.data.Hash) {
          const cid = uploadResponse.data.Hash;
          console.log('✅ Data uploaded to IPFS');
          console.log(`   - CID: ${cid}`);

          // Test 4: Publish to IPNS
          console.log('\n4️⃣ Publishing to IPNS...');
          const publishResponse = await lighthouse.publishRecord(
            cid,
            keyResponse.data.ipnsName,
            apiKey
          );

          if (publishResponse.data && publishResponse.data.Name) {
            console.log('✅ Published to IPNS successfully');
            console.log(`   - IPNS Name: ${publishResponse.data.Name}`);

            // Test 5: Resolve IPNS (wait a moment for propagation)
            console.log('\n5️⃣ Testing IPNS resolution...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

            try {
              const resolveUrl = `https://gateway.lighthouse.storage/ipns/${publishResponse.data.Name}`;
              console.log(`   Trying: ${resolveUrl}`);

              const resolveResponse = await fetch(resolveUrl);
              if (resolveResponse.ok) {
                const resolvedContent = await resolveResponse.text();
                console.log('✅ IPNS resolution successful');

                try {
                  const resolvedData = JSON.parse(resolvedContent);
                  console.log(`   - Title: ${resolvedData.title}`);
                  console.log(`   - Description: ${resolvedData.description}`);
                  console.log(`   - Timestamp: ${resolvedData.timestamp}`);

                  // Test 6: Verify master IPNS service
                  console.log('\n6️⃣ Testing Master IPNS Service...');
                  const service = getMasterIPNSService();

                  // Test creating hackathon through the service
                  const hackathonResult = await service.createHackathon(testData.data);
                  console.log('✅ Hackathon created through Master IPNS Service');
                  console.log(`   - Hackathon ID: ${hackathonResult}`);

                  // Test retrieving the hackathon
                  const retrievedHackathon = await service.getHackathonById(hackathonResult);
                  if (retrievedHackathon) {
                    console.log('✅ Hackathon retrieved successfully');
                    console.log(`   - Title: ${retrievedHackathon.title}`);
                    console.log(`   - Status: ${retrievedHackathon.status}`);
                  }

                  // Test getting all hackathons
                  const allHackathons = await service.getAllHackathons();
                  console.log(`✅ Retrieved ${allHackathons.length} hackathons from IPNS`);

                  return {
                    success: true,
                    data: {
                      ipnsName: publishResponse.data.Name,
                      cid,
                      hackathonId: hackathonResult,
                      totalHackathons: allHackathons.length,
                      testTitle: testData.data.title
                    }
                  };

                } catch (parseError) {
                  console.log('❌ Failed to parse resolved content');
                  console.log(`   Raw content: ${resolvedContent.slice(0, 200)}...`);
                }
              } else {
                console.log(`❌ IPNS resolution failed: ${resolveResponse.status}`);
              }
            } catch (resolveError) {
              console.log(`❌ IPNS resolution error: ${resolveError.message}`);
            }
          } else {
            console.log('❌ IPNS publish failed');
            console.log('   Response:', publishResponse);
          }
        } else {
          console.log('❌ IPFS upload failed');
          console.log('   Response:', uploadResponse);
        }
      } else {
        console.log('❌ IPNS key generation failed');
        console.log('   Response:', keyResponse);
      }
    } catch (lighthouseError) {
      console.log('❌ Lighthouse SDK error:', lighthouseError.message);
      console.log('   Error details:', lighthouseError);
    }

  } catch (error) {
    console.log('❌ General error:', error);
    return { success: false, error: error.message };
  }

  return { success: false, error: 'Test failed at unknown step' };
}