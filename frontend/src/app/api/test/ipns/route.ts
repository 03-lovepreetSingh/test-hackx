import { NextRequest, NextResponse } from 'next/server';
import { testIPNSResolution, testLighthouseConnectivity } from '../../../../lib/test-ipns-resolution';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const test = searchParams.get('test');

  try {
    if (test === 'connectivity') {
      await testLighthouseConnectivity();
      return NextResponse.json({
        success: true,
        message: 'Lighthouse connectivity test completed - check console logs'
      });
    } else if (test === 'resolution') {
      await testIPNSResolution();
      return NextResponse.json({
        success: true,
        message: 'IPNS resolution test completed - check console logs'
      });
    } else {
      // Run both tests
      await testLighthouseConnectivity();
      console.log('\n' + '='.repeat(50) + '\n');
      await testIPNSResolution();

      return NextResponse.json({
        success: true,
        message: 'All IPNS tests completed - check console logs'
      });
    }
  } catch (error) {
    console.error('IPNS test error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}