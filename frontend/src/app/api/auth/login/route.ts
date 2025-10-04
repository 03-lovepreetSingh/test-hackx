import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '../../../../lib/auth-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/auth/login - User login attempt');
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      console.log('❌ Validation failed: missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log(`📝 Attempting login for: ${body.email}`);

    let authService;
    try {
      authService = getAuthService();
      await authService.initializeMasterIPNS();
    } catch (error) {
      console.error('❌ Failed to initialize auth service:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication service initialization failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
    
    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    let result;
    try {
      console.log(`🔍 Attempting login with email: ${body.email}`);
      console.log(`🔍 Password provided: ${body.password ? 'Yes (' + body.password.length + ' chars)' : 'No'}`);

      result = await authService.loginUser(
        body.email,
        body.password,
        ipAddress,
        userAgent
      );

      console.log(`🔍 Login result:`, {
        success: result.success,
        error: result.error,
        message: result.message,
        userFound: !!result.user
      });
    } catch (error) {
      console.error('❌ Login process failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Login process failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    if (result.success) {
      console.log(`✅ User logged in successfully: ${result.user?.username}`);
      
      // Set HTTP-only cookie for the token
      const response = NextResponse.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
          message: result.message
        }
      });

      // Set secure HTTP-only cookie
      response.cookies.set('auth-token', result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      return response;
    } else {
      console.log(`❌ Login failed: ${result.error}`);
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          code: result.error
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('❌ Error during login:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
