import { NextRequest, NextResponse } from 'next/server';
import { getProjectArchiveService } from '../../../../lib/project-archive-storage';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    console.log(`🚀 GET /api/project-archives/${id} - Fetching project`);
    
    const service = getProjectArchiveService();
    await service.initializeMasterIPNS();
    const project = await service.getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Successfully fetched project: ${project.title}`);
    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch project: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    console.log(`🚀 PUT /api/project-archives/${id} - Updating project`);
    
    const body = await request.json();
    
    const service = getProjectArchiveService();
    await service.initializeMasterIPNS();
    
    const success = await service.updateProject(id, body);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update project' },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully updated project: ${id}`);
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating project:', error);
    return NextResponse.json(
      { success: false, error: `Failed to update project: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    console.log(`🚀 DELETE /api/project-archives/${id} - Deleting project`);
    
    const service = getProjectArchiveService();
    await service.initializeMasterIPNS();
    
    const success = await service.deleteProject(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully deleted project: ${id}`);
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: `Failed to delete project: ${error}` },
      { status: 500 }
    );
  }
}
