import { NextRequest, NextResponse } from 'next/server';
import { getUserProfileService } from '../../../../lib/user-profile-storage';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    console.log(`🚀 GET /api/user-profiles/${id} - Fetching user profile`);
    
    const service = getUserProfileService();
    await service.initializeMasterIPNS();
    
    const profile = await service.getUserProfile(id);
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Successfully fetched user profile: ${id}`);
    return NextResponse.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    console.log(`🚀 PUT /api/user-profiles/${id} - Updating user profile`);
    
    const body = await request.json();
    
    const service = getUserProfileService();
    await service.initializeMasterIPNS();
    
    // Get existing profile
    const existingProfile = await service.getUserProfile(id);
    if (!existingProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    // Update profile data
    const updatedProfileData = {
      ...existingProfile,
      ...body,
      id: existingProfile.id, // Keep original ID
      updatedAt: Date.now()
    };
    
    const ipnsRecord = await service.createOrUpdateUserProfile(id, updatedProfileData);
    
    console.log(`✅ Successfully updated user profile: ${id}`);
    return NextResponse.json({
      success: true,
      data: {
        id,
        ipnsRecord,
        message: 'User profile updated successfully'
      }
    });
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    console.log(`🚀 DELETE /api/user-profiles/${id} - Deleting user profile`);
    
    const service = getUserProfileService();
    await service.initializeMasterIPNS();
    
    const success = await service.deleteUserProfile(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Successfully deleted user profile: ${id}`);
    return NextResponse.json({
      success: true,
      message: 'User profile deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
