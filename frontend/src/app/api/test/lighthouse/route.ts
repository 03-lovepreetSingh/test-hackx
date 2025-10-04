import { NextRequest, NextResponse } from 'next/server';
import { testLighthouseDirect, checkPublicIPNS } from '../../../../lib/test-lighthouse-direct';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const test = searchParams.get('test');

  try {
    if (test === 'public') {
      await checkPublicIPNS();
      return NextResponse.json({
        success: true,
        message: 'Public IPNS check completed - check console logs'
      });
    } else {
      // Test Lighthouse API directly
      const result = await testLighthouseDirect();
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Lighthouse test error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}