import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '../../../../lib/auth-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/auth/signup - Registering new user');
    const body = await request.json();

    // Validate required fields
    if (!body.username || !body.email || !body.password || !body.fullName) {
      console.log('❌ Validation failed: missing required fields');
      return NextResponse.json(
        { success: false, error: 'Username, email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      console.log('❌ Validation failed: invalid email format');
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (body.password.length < 6) {
      console.log('❌ Validation failed: password too short');
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate username format - allow letters, numbers, underscores, hyphens, and dots
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(body.username)) {
      console.log('❌ Validation failed: invalid username format');
      return NextResponse.json(
        { success: false, error: 'Username can only contain letters, numbers, underscores, hyphens, and dots' },
        { status: 400 }
      );
    }

    // Validate username length
    if (body.username.length < 3) {
      console.log('❌ Validation failed: username too short');
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (body.username.length > 30) {
      console.log('❌ Validation failed: username too long');
      return NextResponse.json(
        { success: false, error: 'Username must be less than 30 characters' },
        { status: 400 }
      );
    }

    console.log(`📝 Registering user: ${body.username} (${body.email})`);

    const authService = getAuthService();
    await authService.initializeMasterIPNS();
    
    const result = await authService.registerUser({
      username: body.username,
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      role: body.role || 'user',
      bio: body.bio,
      location: body.location,
      website: body.website,
      github: body.github,
      twitter: body.twitter,
      linkedin: body.linkedin,
      skills: body.skills || [],
      interests: body.interests || []
    });

    if (result.success) {
      console.log(`✅ User registered successfully: ${body.username}`);
      return NextResponse.json({
        success: true,
        data: {
          user: result.user,
          message: result.message
        }
      });
    } else {
      console.log(`❌ Registration failed: ${result.error}`);
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          code: result.error
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Error registering user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
