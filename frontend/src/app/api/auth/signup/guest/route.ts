import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '../../../../../lib/auth-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/auth/signup/guest - Registering new guest user');
    const body = await request.json();

    // Validate required fields
    if (!body.username || !body.email || !body.password || !body.fullName) {
      console.log('❌ Validation failed: missing required fields');
      return NextResponse.json(
        { success: false, error: 'Username, email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Validate guest-specific fields
    if (!body.inviteToken || !body.hackathonId) {
      console.log('❌ Validation failed: missing guest invitation fields');
      return NextResponse.json(
        { success: false, error: 'Valid invitation token and hackathon ID are required for guest registration' },
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

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(body.username)) {
      console.log('❌ Validation failed: invalid username format');
      return NextResponse.json(
        { success: false, error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    console.log(`📝 Registering guest user: ${body.username} (${body.email}) for hackathon: ${body.hackathonId}`);

    // First validate the invitation token
    const tokenValidation = await validateGuestInvite(body.inviteToken, body.hackathonId);
    if (!tokenValidation.success) {
      console.log('❌ Guest invitation validation failed');
      return NextResponse.json(
        { success: false, error: tokenValidation.error || 'Invalid invitation token' },
        { status: 400 }
      );
    }

    const authService = getAuthService();
    await authService.initializeMasterIPNS();

    const result = await authService.registerUser({
      username: body.username,
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      role: 'guest', // Force guest role
      bio: body.bio,
      location: body.location,
      website: body.website,
      github: body.github,
      twitter: body.twitter,
      linkedin: body.linkedin,
      skills: body.skills || [],
      interests: body.interests || [],
      // Add guest-specific metadata
      hackathonId: body.hackathonId,
      inviteToken: body.inviteToken,
      invitedBy: tokenValidation.inviterId,
      invitedAt: Date.now()
    });

    if (result.success) {
      console.log(`✅ Guest user registered successfully: ${body.username}`);
      return NextResponse.json({
        success: true,
        data: {
          user: result.user,
          hackathon: tokenValidation.hackathon,
          message: result.message
        }
      });
    } else {
      console.log(`❌ Guest registration failed: ${result.error}`);
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
    console.error('❌ Error registering guest user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register guest user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function validateGuestInvite(token: string, hackathonId: string) {
  try {
    console.log(`🔍 Validating guest invite token: ${token} for hackathon: ${hackathonId}`);

    // In a real implementation, this would:
    // 1. Check the token against a database of issued invitations
    // 2. Verify the hackathon exists and is accepting guests
    // 3. Check if the token has expired
    // 4. Verify the token hasn't been used already

    // For now, we'll implement a simple validation logic
    // This would be replaced with actual database lookups

    // Mock validation - in production, replace with actual database checks
    const mockInvitations = [
      {
        id: 'mock-invite-1',
        token: 'guest-invite-12345',
        hackathonId: 'hackathon-1',
        inviterId: 'organizer-1',
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
        used: false
      }
    ];

    const invitation = mockInvitations.find(inv =>
      inv.token === token &&
      inv.hackathonId === hackathonId &&
      !inv.used &&
      inv.expiresAt > Date.now()
    );

    if (!invitation) {
      return {
        success: false,
        error: 'Invalid or expired invitation token'
      };
    }

    // Mock hackathon data
    const mockHackathon = {
      id: hackathonId,
      title: 'Test Hackathon 2024',
      status: 'active',
      allowGuests: true
    };

    return {
      success: true,
      hackathon: mockHackathon,
      inviterId: invitation.inviterId,
      invitationId: invitation.id
    };

  } catch (error) {
    console.error('❌ Error validating guest invite:', error);
    return {
      success: false,
      error: 'Failed to validate invitation token'
    };
  }
}