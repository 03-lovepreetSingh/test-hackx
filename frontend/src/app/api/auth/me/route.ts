import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '../../../../lib/auth-storage';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/auth/me - Getting current user');
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token found' },
        { status: 401 }
      );
    }

    const authService = getAuthService();
    const verification = await authService.verifyToken(token);

    if (!verification.valid) {
      console.log(`❌ Token verification failed: ${verification.error}`);
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid token' },
        { status: 401 }
      );
    }

    console.log(`✅ User authenticated: ${verification.user?.username}`);
    return NextResponse.json({
      success: true,
      data: {
        user: verification.user
      }
    });
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get user information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
