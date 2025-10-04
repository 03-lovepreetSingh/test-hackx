import { NextRequest, NextResponse } from 'next/server';
import { getProjectArchiveService } from '../../../lib/project-archive-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing project creation without timeouts...');

    const body = await request.json();

    // Test service initialization
    const service = getProjectArchiveService();
    console.log('✅ Service initialized');

    // Initialize master IPNS (without timeout)
    console.log('🏗️ Initializing master IPNS...');
    await service.initializeMasterIPNS();
    console.log('✅ Master IPNS initialized');

    // Create project (without timeout)
    console.log('📝 Creating project...');
    const projectData = {
      title: body.title || 'Test Project',
      status: 'In Progress' as const,
      description: body.description || 'Test project creation',
      date: '2025-01-05',
      hackathon: 'Test Hackathon',
      technologies: ['Test', 'API'],
      result: 'Testing',
      prize: '0',
      stars: 0,
      color: '#0092ff'
    };

    const projectId = await service.createProject(projectData);
    console.log('✅ Project created successfully:', projectId);

    // Test retrieval
    console.log('📖 Retrieving project...');
    const project = await service.getProjectById(projectId);
    console.log('✅ Project retrieved successfully:', project?.title);

    return NextResponse.json({
      success: true,
      message: 'Project creation test successful',
      data: {
        projectId,
        project,
        ipfsWorking: true
      }
    });

  } catch (error) {
    console.error('❌ Project creation test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Project creation test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}