import { NextRequest, NextResponse } from 'next/server';
import { testLighthouseAuth, validateAPIKey, getAuthMessage } from '../../../../lib/lighthouse-auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const test = searchParams.get('test');

  try {
    if (test === 'validate') {
      const apiKey = searchParams.get('key');
      if (!apiKey) {
        return NextResponse.json({
          success: false,
          error: 'API key parameter is required'
        }, { status: 400 });
      }

      const isValid = await validateAPIKey(apiKey);
      return NextResponse.json({
        success: true,
        data: {
          apiKey: `${apiKey.slice(0, 10)}...`,
          isValid
        }
      });
    }

    if (test === 'auth-flow') {
      await testLighthouseAuth();
      return NextResponse.json({
        success: true,
        message: 'Authentication flow test completed - check console logs'
      });
    }

    if (test === 'get-message') {
      const publicKey = searchParams.get('publicKey') || '0x42785cf8870C9851eDD5a8cEE0303CbE3FED9419';
      const authResponse = await getAuthMessage(publicKey);

      return NextResponse.json(authResponse);
    }

    // Default: Test current API keys
    const possibleKeys = [
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      process.env.LIGHTHOUSE_KEY,
      '7d7e1bc7.4b27eb60a60d4a20a71f6f098e96f807',
      '0x42785cf8870C9851eDD5a8cEE0303CbE3FED9419'
    ].filter(Boolean);

    const results = [];

    for (const key of possibleKeys) {
      const isValid = await validateAPIKey(key);
      results.push({
        key: `${key.slice(0, 10)}...`,
        isValid,
        length: key.length
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        testedKeys: results,
        environment: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}