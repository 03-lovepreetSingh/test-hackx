import { NextRequest, NextResponse } from 'next/server';
import { getUserProfileService } from '../../../../lib/user-profile-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const skills = searchParams.get('skills')?.split(',') || [];
    const location = searchParams.get('location') || '';
    const interests = searchParams.get('interests')?.split(',') || [];
    
    console.log(`🚀 GET /api/user-profiles/search - Searching user profiles`);
    console.log(`Query: ${query}, Skills: ${skills}, Location: ${location}, Interests: ${interests}`);
    
    const service = getUserProfileService();
    await service.initializeMasterIPNS();
    
    const filters = {
      skills: skills.length > 0 ? skills : undefined,
      location: location || undefined,
      interests: interests.length > 0 ? interests : undefined
    };
    
    const profiles = await service.searchUserProfiles(query, filters);
    
    console.log(`✅ Found ${profiles.length} matching user profiles`);
    return NextResponse.json({
      success: true,
      data: profiles,
      count: profiles.length,
      query,
      filters
    });
  } catch (error) {
    console.error('❌ Error searching user profiles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search user profiles',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
