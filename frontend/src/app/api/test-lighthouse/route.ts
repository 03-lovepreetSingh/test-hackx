import { NextRequest, NextResponse } from 'next/server';
import lighthouse from '@lighthouse-web3/sdk';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Lighthouse configuration...');

    // Test configuration
    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY ||
                   process.env.LIGHTHOUSE_KEY ||
                   process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY || '';

    console.log('🔑 Available keys:', {
      'NEXT_PUBLIC_LIGHTHOUSE_API_KEY': !!process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      'LIGHTHOUSE_KEY': !!process.env.LIGHTHOUSE_KEY,
      'LIGHTHOUSE_PRIVATE_KEY': !!process.env.LIGHTHOUSE_PRIVATE_KEY,
      'NODE_ENV': process.env.NODE_ENV
    });

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'No Lighthouse API key found in environment'
      }, { status: 500 });
    }

    // Test 1: Upload simple text
    console.log('📤 Testing upload...');
    const testData = { test: 'Hello Lighthouse', timestamp: Date.now() };
    const uploadResponse = await lighthouse.uploadText(
      JSON.stringify(testData),
      apiKey,
      'test-upload'
    );

    console.log('✅ Upload response:', uploadResponse);

    if (!uploadResponse.data?.Hash) {
      return NextResponse.json({
        success: false,
        error: 'Upload failed - no hash returned'
      }, { status: 500 });
    }

    // Test 2: Generate IPNS key
    console.log('🔑 Testing key generation...');
    const keyResponse = await lighthouse.generateKey(apiKey);
    console.log('✅ Key generation response:', keyResponse);

    // Test 3: Publish to IPNS
    console.log('📡 Testing IPNS publish...');
    const publishResponse = await lighthouse.publishRecord(
      uploadResponse.data.Hash,
      keyResponse.data.ipnsName,
      apiKey
    );
    console.log('✅ Publish response:', publishResponse);

    return NextResponse.json({
      success: true,
      message: 'All Lighthouse tests passed',
      data: {
        upload: uploadResponse.data,
        key: keyResponse.data,
        publish: publishResponse.data
      }
    });

  } catch (error) {
    console.error('❌ Lighthouse test failed:', error);
    return NextResponse.json({
      success: false,
      error: `Lighthouse test failed: ${error}`,
      stack: error.stack
    }, { status: 500 });
  }
}