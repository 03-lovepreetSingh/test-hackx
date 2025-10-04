const lighthouse = require('@lighthouse-web3/sdk');

// Test the IPFS integration
async function testIPFSIntegration() {
  try {
    const apiKey = 'fb05215f.8b154384f7d8457e8d5b27a8a16219af';

    console.log('🚀 Testing IPFS integration...');

    // Test 1: Generate a new key
    console.log('\n1. Testing key generation...');
    const keyResult = await lighthouse.generateKey(apiKey);
    console.log('✅ Key generated:', keyResult.data.ipnsId);

    // Test 2: Upload some text
    console.log('\n2. Testing text upload...');
    const testProject = {
      id: 'test-project-123',
      title: 'Test Project',
      status: 'In Progress',
      description: 'A test project for IPFS integration',
      date: '2025-01-05',
      hackathon: 'Test Hackathon',
      technologies: ['Test', 'IPFS'],
      result: 'Testing',
      prize: '0',
      stars: 0,
      color: '#0092ff',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const uploadResult = await lighthouse.uploadText(
      JSON.stringify(testProject),
      apiKey
    );
    console.log('✅ Project uploaded:', uploadResult.data.Hash);

    // Test 3: Publish to IPNS
    console.log('\n3. Testing IPNS publish...');
    const publishResult = await lighthouse.publishRecord(
      uploadResult.data.Hash,
      keyResult.data.ipnsName,
      apiKey
    );
    console.log('✅ Published to IPNS:', publishResult.data.Name);

    // Test 4: Retrieve from IPNS
    console.log('\n4. Testing IPNS retrieval...');
    const ipnsId = keyResult.data.ipnsId;
    const response = await fetch(`https://gateway.lighthouse.storage/ipns/${ipnsId}`);
    const retrievedProject = await response.json();
    console.log('✅ Retrieved project:', retrievedProject.title);

    console.log('\n🎉 All tests passed! IPFS integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testIPFSIntegration();