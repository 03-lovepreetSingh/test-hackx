import { NextRequest, NextResponse } from 'next/server';
import { getProjectArchiveService } from '../../../lib/project-archive-storage';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Project Archive Service...');

    // Test service initialization
    const service = getProjectArchiveService();
    console.log('✅ Service initialized successfully');

    // Test environment variables in service context
    const apiKey = process.env.LIGHTHOUSE_KEY || process.env.LIGHTHOUSE_API_KEY;
    console.log('🔑 API Key in service context:', !!apiKey);

    // Test basic IPFS operations
    console.log('📤 Testing IPFS upload...');
    const testData = { test: 'Project Service Test', timestamp: Date.now() };
    const uploadResult = await service.uploadToIPFS(testData);
    console.log('✅ IPFS upload successful:', uploadResult);

    // Test IPNS operations
    console.log('🔑 Testing IPNS key generation...');
    const keyResult = await service.generateIPNSKey();
    console.log('✅ IPNS key generation successful:', keyResult);

    // Test IPNS publish
    console.log('📡 Testing IPNS publish...');
    const publishResult = await service.createOrUpdateIPNS(uploadResult, keyResult.ipnsName);
    console.log('✅ IPNS publish successful:', publishResult);

    // Test master IPNS initialization
    console.log('🏗️ Testing master IPNS initialization...');
    await service.initializeMasterIPNS();
    console.log('✅ Master IPNS initialization successful');

    return NextResponse.json({
      success: true,
      message: 'Project Archive Service working correctly',
      tests: {
        upload: uploadResult,
        keyGen: keyResult,
        publish: publishResult
      }
    });

  } catch (error) {
    console.error('❌ Project Archive Service test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Project Archive Service test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}