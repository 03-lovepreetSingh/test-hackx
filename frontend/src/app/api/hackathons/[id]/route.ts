import { NextRequest, NextResponse } from 'next/server';
import { getMasterIPNSService } from '../../../../lib/master-ipns-storage';
import { Hackathon } from '../../../types';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const service = getMasterIPNSService();
    const hackathon = await service.getHackathonById(id);

    if (!hackathon) {
      return NextResponse.json(
        { success: false, error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch hackathon: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Generate updated slug if title changed
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const updatedHackathon: Hackathon = {
      ...body,
      id,
      slug,
      updatedAt: Date.now()
    };

    const service = getMasterIPNSService();
    await service.updateHackathon(id, updatedHackathon);

    return NextResponse.json({
      success: true,
      data: {
        id,
        slug,
        message: 'Hackathon updated successfully and published to IPNS'
      }
    });
  } catch (error) {
    console.error('Error updating hackathon:', error);
    return NextResponse.json(
      { success: false, error: `Failed to update hackathon: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const service = getMasterIPNSService();
    await service.deleteHackathon(id);

    return NextResponse.json({
      success: true,
      data: {
        id,
        message: 'Hackathon deleted successfully (archived in IPNS)'
      }
    });
  } catch (error) {
    console.error('Error deleting hackathon:', error);
    return NextResponse.json(
      { success: false, error: `Failed to delete hackathon: ${error}` },
      { status: 500 }
    );
  }
}
