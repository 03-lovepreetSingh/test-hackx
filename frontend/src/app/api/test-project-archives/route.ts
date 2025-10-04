import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing project archives API...');
    
    // Test if we can import the service
    const { getProjectArchiveService } = await import('../../../lib/project-archive-storage');
    
    console.log('✅ Service imported successfully');
    
    const service = getProjectArchiveService();
    console.log('✅ Service instance created');
    
    await service.initializeMasterIPNS();
    console.log('✅ Master IPNS initialized');
    
    const projects = await service.getAllProjects();
    console.log(`✅ Retrieved ${projects.length} projects`);
    
    return NextResponse.json({
      success: true,
      message: 'Project archives API is working!',
      projectCount: projects.length,
      projects: projects.slice(0, 2) // Return first 2 projects for testing
    });
  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
