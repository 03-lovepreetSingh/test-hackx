import { NextResponse } from 'next/server';
import { getAuthService } from '../../../lib/auth-storage';

export async function GET() {
  try {
    console.log('🧪 Testing user access...');

    const authService = getAuthService();
    await authService.initializeMasterIPNS();

    // Test if we can access existing users
    const allUsers = await authService.getAllUsers();

    return NextResponse.json({
      success: true,
      message: 'User access test successful',
      data: {
        totalUsers: allUsers.length,
        users: allUsers.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          isActive: user.isActive
        }))
      }
    });

  } catch (error) {
    console.error('❌ User access test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to access users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}