import { NextRequest, NextResponse } from 'next/server';
import { testCompleteIPNSFlow } from '../../../../lib/test-ipns-complete';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting complete IPNS flow test...');
    const result = await testCompleteIPNSFlow();

    if (result.success) {
      console.log('✅ Complete IPNS flow test successful!');
      return NextResponse.json({
        success: true,
        message: 'IPNS is working perfectly!',
        data: result.data
      });
    } else {
      console.log('❌ Complete IPNS flow test failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Complete test error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}