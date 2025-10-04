import { NextRequest, NextResponse } from 'next/server';
import { getMasterIPNSService } from '../../../../../lib/master-ipns-storage';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const service = getMasterIPNSService();
    const hackathon = await service.getHackathonBySlug(slug);

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
    console.error('Error fetching hackathon by slug:', error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch hackathon: ${error}` },
      { status: 500 }
    );
  }
}
