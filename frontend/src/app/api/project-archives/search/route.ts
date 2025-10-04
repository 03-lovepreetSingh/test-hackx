import { NextRequest, NextResponse } from 'next/server';
import { getProjectArchiveService } from '../../../../lib/project-archive-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || undefined;
    const hackathon = searchParams.get('hackathon') || undefined;
    
    console.log('🚀 GET /api/project-archives/search - Searching projects');
    console.log(`Search params: query="${query}", status="${status}", hackathon="${hackathon}"`);
    
    const service = getProjectArchiveService();
    await service.initializeMasterIPNS();
    
    const projects = await service.searchProjects(query, { status, hackathon });
    
    console.log(`✅ Found ${projects.length} projects matching search criteria`);
    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
      searchParams: { query, status, hackathon }
    });
  } catch (error) {
    console.error('❌ Error searching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search projects',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
