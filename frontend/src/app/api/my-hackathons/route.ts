import { NextRequest, NextResponse } from 'next/server';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  participants: number;
  projectsSubmitted: number;
  judges: number;
  prizePool: string;
  categories: string[];
  techStack: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  judgesList: {
    id: string;
    name: string;
    email: string;
    status: 'invited' | 'accepted' | 'declined';
    invitedAt: string;
    acceptedAt?: string;
  }[];
}

// Mock data for development
const mockHackathons: Hackathon[] = [
  {
    id: '1',
    title: 'ChainSpark Hackathon',
    description: 'ChainSpark Hackathon was born from a simple but radical belief: true innovation shouldn\'t be strangled by black-box algorithms or centralized gatekeepers.',
    status: 'live',
    startDate: '2024-10-12',
    endDate: '2024-10-16',
    participants: 405,
    projectsSubmitted: 3,
    judges: 5,
    prizePool: '$38,000',
    categories: ['Smart Contracts', 'Financial Inclusion'],
    techStack: ['All tech stack'],
    createdAt: '2024-09-01',
    updatedAt: '2024-10-15',
    creatorId: '1',
    creatorName: 'Alice Johnson',
    creatorEmail: 'alice@example.com',
    judgesList: [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        status: 'accepted',
        invitedAt: '2024-09-15',
        acceptedAt: '2024-09-16'
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        status: 'accepted',
        invitedAt: '2024-09-15',
        acceptedAt: '2024-09-17'
      },
      {
        id: '3',
        name: 'Carol Davis',
        email: 'carol@example.com',
        status: 'invited',
        invitedAt: '2024-10-01'
      }
    ]
  },
  {
    id: '2',
    title: 'DeFi Innovation Challenge',
    description: 'Build the next generation of decentralized finance applications with cutting-edge protocols and innovative solutions.',
    status: 'upcoming',
    startDate: '2024-11-01',
    endDate: '2024-11-05',
    participants: 0,
    projectsSubmitted: 0,
    judges: 3,
    prizePool: '$50,000',
    categories: ['DeFi', 'Smart Contracts'],
    techStack: ['Ethereum', 'Polygon', 'Arbitrum'],
    createdAt: '2024-10-01',
    updatedAt: '2024-10-15',
    creatorId: '1',
    creatorName: 'Alice Johnson',
    creatorEmail: 'alice@example.com',
    judgesList: [
      {
        id: '4',
        name: 'David Wilson',
        email: 'david@example.com',
        status: 'accepted',
        invitedAt: '2024-10-05',
        acceptedAt: '2024-10-06'
      }
    ]
  },
  {
    id: '3',
    title: 'Web3 Gaming Hackathon',
    description: 'Create immersive gaming experiences powered by blockchain technology and NFT integration.',
    status: 'completed',
    startDate: '2024-09-15',
    endDate: '2024-09-19',
    participants: 180,
    projectsSubmitted: 12,
    judges: 4,
    prizePool: '$25,000',
    categories: ['Gaming', 'NFTs'],
    techStack: ['Unity', 'Web3.js', 'Ethereum'],
    createdAt: '2024-08-01',
    updatedAt: '2024-09-20',
    creatorId: '2',
    creatorName: 'Bob Smith',
    creatorEmail: 'bob@example.com',
    judgesList: [
      {
        id: '5',
        name: 'Eva Brown',
        email: 'eva@example.com',
        status: 'accepted',
        invitedAt: '2024-08-15',
        acceptedAt: '2024-08-16'
      }
    ]
  },
  {
    id: '4',
    title: 'AI & Machine Learning Challenge',
    description: 'Build innovative AI solutions using cutting-edge machine learning algorithms and frameworks.',
    status: 'draft',
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    participants: 0,
    projectsSubmitted: 0,
    judges: 0,
    prizePool: '$30,000',
    categories: ['AI', 'Machine Learning', 'Data Science'],
    techStack: ['Python', 'TensorFlow', 'PyTorch'],
    createdAt: '2024-11-01',
    updatedAt: '2024-11-15',
    creatorId: '3',
    creatorName: 'Carol Davis',
    creatorEmail: 'carol@example.com',
    judgesList: []
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request headers or query params
    // In a real app, this would come from JWT token or session
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1'; // Default to user ID 1 for demo
    
    // Filter hackathons by creator ID
    const userHackathons = mockHackathons.filter(hackathon => hackathon.creatorId === userId);
    
    return NextResponse.json({
      success: true,
      data: userHackathons,
      message: 'User hackathons retrieved successfully'
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
    const body = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      prizePool,
      categories,
      techStack,
      imageUrl,
      creatorId,
      creatorName,
      creatorEmail
    } = body;

    // Validate required fields
    if (!title || !description || !startDate || !endDate || !prizePool) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate creator information
    if (!creatorId || !creatorName || !creatorEmail) {
      return NextResponse.json(
        { success: false, error: 'Creator information is required' },
        { status: 400 }
      );
    }

    // Create new hackathon
    const newHackathon: Hackathon = {
      id: Date.now().toString(),
      title,
      description,
      status: 'draft',
      startDate,
      endDate,
      participants: 0,
      projectsSubmitted: 0,
      judges: 0,
      prizePool,
      categories: categories || [],
      techStack: techStack || [],
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorId,
      creatorName,
      creatorEmail,
      judgesList: []
    };

    // In a real app, this would be saved to a database
    mockHackathons.push(newHackathon);

    return NextResponse.json({
      success: true,
      data: newHackathon,
      message: 'Hackathon created successfully'
    });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hackathon' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Hackathon ID is required' },
        { status: 400 }
      );
    }

    // Find existing hackathon
    const hackathonIndex = mockHackathons.findIndex(h => h.id === id);
    if (hackathonIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    // Update hackathon
    mockHackathons[hackathonIndex] = {
      ...mockHackathons[hackathonIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockHackathons[hackathonIndex],
      message: 'Hackathon updated successfully'
    });
  } catch (error) {
    console.error('Error updating hackathon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hackathon' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Hackathon ID is required' },
        { status: 400 }
      );
    }

    const hackathonIndex = mockHackathons.findIndex(h => h.id === id);
    if (hackathonIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    mockHackathons.splice(hackathonIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hackathon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete hackathon' },
      { status: 500 }
    );
  }
}
