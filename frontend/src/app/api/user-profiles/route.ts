import { NextRequest, NextResponse } from 'next/server';
import { getUserProfileService } from '../../../lib/user-profile-storage';
import { UserProfile } from '../../../lib/user-profile-storage';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/user-profiles - Fetching all user profiles');
    
    const service = getUserProfileService();
    await service.initializeMasterIPNS();
    
    const profiles = await service.getAllUserProfiles();
    console.log(`✅ Successfully fetched ${profiles.length} user profiles`);
    
    return NextResponse.json({
      success: true,
      data: profiles,
      count: profiles.length
    });
  } catch (error) {
    console.error('❌ Error fetching user profiles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user profiles',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/user-profiles - Creating new user profile');
    const body = await request.json();

    // Validate required fields
    if (!body.username || !body.email || !body.fullName) {
      console.log('❌ Validation failed: missing required fields');
      return NextResponse.json(
        { success: false, error: 'Username, email, and full name are required' },
        { status: 400 }
      );
    }

    // Set default values
    const profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'ipnsRecord' | 'ipfsHash'> = {
      username: body.username,
      email: body.email,
      fullName: body.fullName,
      bio: body.bio || '',
      avatar: body.avatar || '',
      location: body.location || '',
      website: body.website || '',
      github: body.github || '',
      twitter: body.twitter || '',
      linkedin: body.linkedin || '',
      skills: body.skills || [],
      interests: body.interests || [],
      achievements: body.achievements || [],
      projects: body.projects || [],
      socialStats: body.socialStats || {
        followers: 0,
        following: 0,
        projects: 0,
        hackathons: 0
      },
      preferences: body.preferences || {
        theme: 'dark',
        notifications: true,
        publicProfile: true
      }
    };

    console.log(`📝 Creating user profile: ${profileData.username}`);

    const service = getUserProfileService();
    await service.initializeMasterIPNS();
    
    // Generate user ID
    const userId = body.id || crypto.randomUUID();
    const ipnsRecord = await service.createOrUpdateUserProfile(userId, profileData);

    console.log(`✅ Successfully created user profile: ${ipnsRecord}`);
    return NextResponse.json({
      success: true,
      data: {
        id: userId,
        ipnsRecord,
        message: 'User profile created successfully and published to IPNS'
      }
    });
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
