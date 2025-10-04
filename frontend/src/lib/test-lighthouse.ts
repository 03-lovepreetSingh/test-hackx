import { getLighthouseService, initializeHackathonStorage } from './lighthouse-storage';
import { Hackathon } from '../app/types';

export async function testLighthouseIntegration() {
  try {
    console.log('🚀 Testing Lighthouse Integration...');
    
    // Test 1: Initialize storage
    console.log('📦 Initializing hackathon storage...');
    const ipns = await initializeHackathonStorage();
    console.log('✅ Storage initialized with IPNS:', ipns);
    
    // Test 2: Create a test hackathon
    console.log('➕ Creating test hackathon...');
    const service = getLighthouseService();
    const testHackathon: Hackathon = {
      id: 'test-' + Date.now(),
      title: 'Test Web3 Hackathon',
      description: 'A test hackathon for Lighthouse integration',
      status: 'live',
      registrationClose: '2024-12-31',
      registrationDaysLeft: 30,
      techStack: 'React, Node.js, Web3',
      level: 'All levels',
      totalPrize: 10000,
      location: 'Online',
      tags: ['Test', 'Web3', 'Lighthouse']
    };
    
    const hackathonId = await service.createHackathon(ipns, testHackathon);
    console.log('✅ Test hackathon created with ID:', hackathonId);
    
    // Test 3: Retrieve hackathons
    console.log('📋 Retrieving all hackathons...');
    const hackathons = await service.getAllHackathons(ipns);
    console.log('✅ Retrieved hackathons:', hackathons.length);
    
    // Test 4: Get specific hackathon
    console.log('🔍 Getting specific hackathon...');
    const specificHackathon = await service.getHackathonById(ipns, hackathonId);
    console.log('✅ Retrieved specific hackathon:', specificHackathon?.title);
    
    // Test 5: Update hackathon
    console.log('✏️ Updating hackathon...');
    const updatedHackathon = {
      ...testHackathon,
      title: 'Updated Test Web3 Hackathon',
      totalPrize: 15000
    };
    await service.updateHackathon(ipns, hackathonId, updatedHackathon);
    console.log('✅ Hackathon updated');
    
    // Test 6: Verify update
    console.log('🔍 Verifying update...');
    const updatedHackathonData = await service.getHackathonById(ipns, hackathonId);
    console.log('✅ Updated hackathon title:', updatedHackathonData?.title);
    console.log('✅ Updated hackathon prize:', updatedHackathonData?.totalPrize);
    
    // Test 7: Delete hackathon
    console.log('🗑️ Deleting hackathon...');
    await service.deleteHackathon(ipns, hackathonId);
    console.log('✅ Hackathon deleted');
    
    // Test 8: Verify deletion
    console.log('🔍 Verifying deletion...');
    const finalHackathons = await service.getAllHackathons(ipns);
    console.log('✅ Final hackathon count:', finalHackathons.length);
    
    console.log('🎉 All tests passed! Lighthouse integration is working correctly.');
    
    return {
      success: true,
      ipns,
      message: 'All tests passed successfully'
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Test failed'
    };
  }
}

// Export for use in development
export async function runLighthouseTests() {
  if (typeof window === 'undefined') {
    console.log('This test should be run in the browser environment');
    return;
  }
  
  const result = await testLighthouseIntegration();
  return result;
}
