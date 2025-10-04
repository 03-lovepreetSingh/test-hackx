import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for session persistence
let sessionHackathons: any[] = [];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching hackathons from simple storage...');

    // Mock data
    const mockHackathons: any[] = [
      {
        id: '1',
        title: 'Web3 Innovate Jam',
        slug: 'web3-innovate-jam',
        description: 'The Web3 Innovate Jam is designed to inspire developers, designers, and innovators to build innovative applications that integrate blockchain technology.',
        status: 'live',
        registrationClose: '2024-05-12',
        registrationDaysLeft: 12,
        techStack: 'Web3, Blockchain, DeFi',
        level: 'All levels',
        totalPrize: 30000,
        location: 'Online',
        tags: ['Web3', 'Blockchain', 'DeFi']
      },
      {
        id: '2',
        title: 'Coindora Hackfest',
        slug: 'coindora-hackfest',
        description: 'Coindora Hackfest is a premier event for blockchain enthusiasts to collaborate and build innovative solutions for real-world problems.',
        status: 'live',
        registrationClose: '2024-09-08',
        registrationDaysLeft: 20,
        techStack: 'Crypto, Smart Contracts, NFT',
        level: 'All levels',
        totalPrize: 35000,
        location: 'Hybrid',
        tags: ['Crypto', 'Smart Contracts', 'NFT']
      }
    ];

    // Combine session storage with mock data
    const allHackathons = [...sessionHackathons, ...mockHackathons];

    return NextResponse.json({
      success: true,
      data: allHackathons,
      count: allHackathons.length,
      mode: 'simple-storage'
    });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hackathons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Creating hackathon in simple storage...');
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Generate ID and slug
    const hackathonId = body.id || crypto.randomUUID();
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const hackathon: any = {
      ...body,
      id: hackathonId,
      slug,
      createdAt: body.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    // Store in session storage
    sessionHackathons.push(hackathon);
    console.log('✅ Successfully stored hackathon:', hackathon.title);

    return NextResponse.json({
      success: true,
      data: {
        id: hackathonId,
        slug,
        message: 'Hackathon created successfully (simple storage mode)',
        mode: 'simple-storage'
      }
    });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    return NextResponse.json(
      { success: false, error: `Failed to create hackathon: ${error}` },
      { status: 500 }
    );
  }
}
