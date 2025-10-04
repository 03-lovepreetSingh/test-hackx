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
    // 2. Update the invitation status to 'declined'
    // 3. Send confirmation email
    // 4. Optionally suggest alternative ways to participate

    console.log(`❌ Judge declined invitation with token: ${token}`);

    // For now, return a success response
    return NextResponse.json({
      success: true,
      message: 'Judge invitation declined',
      data: {
        token,
        status: 'declined',
        declinedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error declining judge invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to decline invitation' },
      { status: 500 }
    );
  }
}
