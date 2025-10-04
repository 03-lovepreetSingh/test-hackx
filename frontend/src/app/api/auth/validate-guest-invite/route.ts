import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/auth/validate-guest-invite - Validating guest invitation');

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const hackathonId = searchParams.get('hackathon');

    if (!token || !hackathonId) {
      console.log('❌ Validation failed: missing token or hackathon ID');
      return NextResponse.json(
        { success: false, error: 'Token and hackathon ID are required' },
        { status: 400 }
      );
    }

    console.log(`📝 Validating token: ${token} for hackathon: ${hackathonId}`);

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
      },
      {
        id: 'mock-invite-2',
        token: 'guest-invite-67890',
        hackathonId: 'hackathon-2',
        inviterId: 'organizer-2',
        expiresAt: Date.now() + (14 * 24 * 60 * 60 * 1000), // 14 days from now
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
      console.log('❌ Invalid or expired invitation token');
      return NextResponse.json(
        { success: false, error: 'Invalid or expired invitation token' },
        { status: 400 }
      );
    }

    // Mock hackathon data
    const mockHackathons = {
      'hackathon-1': {
        id: 'hackathon-1',
        title: 'Web3 Innovate Jam 2024',
        status: 'live',
        allowGuests: true,
        description: 'A premier hackathon for blockchain and Web3 innovation',
        startDate: '2024-01-15',
        endDate: '2024-01-17'
      },
      'hackathon-2': {
        id: 'hackathon-2',
        title: 'AI & Machine Learning Summit',
        status: 'upcoming',
        allowGuests: true,
        description: 'Exploring the frontiers of artificial intelligence',
        startDate: '2024-02-01',
        endDate: '2024-02-03'
      }
    };

    const hackathon = mockHackathons[hackathonId as keyof typeof mockHackathons];

    if (!hackathon || !hackathon.allowGuests) {
      console.log('❌ Hackathon not found or not accepting guests');
      return NextResponse.json(
        { success: false, error: 'Hackathon not found or not accepting guest participants' },
        { status: 400 }
      );
    }

    console.log(`✅ Valid invitation found for hackathon: ${hackathon.title}`);

    return NextResponse.json({
      success: true,
      hackathon,
      inviterId: invitation.inviterId,
      invitationId: invitation.id,
      message: 'Invitation validated successfully'
    });

  } catch (error) {
    console.error('❌ Error validating guest invitation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate invitation token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}