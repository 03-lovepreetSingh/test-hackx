import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Invalid invitation token' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Validate the token
    // 2. Update the invitation status to 'accepted'
    // 3. Add the user as a judge for the hackathon
    // 4. Send confirmation email
    // 5. Redirect to the hackathon judging page

    console.log(`✅ Judge accepted invitation with token: ${token}`);

    // For now, return a success response
    return NextResponse.json({
      success: true,
      message: 'Judge invitation accepted successfully',
      data: {
        token,
        status: 'accepted',
        acceptedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error accepting judge invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
