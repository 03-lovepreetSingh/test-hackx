import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '../../../../lib/auth-storage';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/auth/logout - User logout');
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No active session found' },
        { status: 401 }
      );
    }

    try {
      // Decode token to get session ID
      const decoded = jwt.decode(token) as any;
      const sessionId = decoded?.sessionId;

      if (sessionId) {
        const authService = getAuthService();
        await authService.logoutUser(sessionId);
        console.log(`✅ User logged out successfully: session ${sessionId}`);
      }
    } catch (error) {
      console.log('⚠️ Error during logout cleanup:', error);
    }

    // Clear the auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('❌ Error during logout:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
