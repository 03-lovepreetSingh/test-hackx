import { NextRequest, NextResponse } from 'next/server';
import { getMasterIPNSService } from '../../../lib/master-ipns-storage';
import { Hackathon } from '../../types';

// Simple in-memory storage for session persistence
let sessionHackathons: Hackathon[] = [];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching hackathons...');

    // Try IPFS/IPNS with timeout and fallback
    let hackathons: Hackathon[] = [];
    let useIPFS = true;

    try {
      const service = getMasterIPNSService();

      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('IPFS operation timed out')), 10000);
      });

      hackathons = await Promise.race([
        service.getAllHackathons(),
        timeoutPromise
      ]) as Hackathon[];

      console.log('✅ Successfully fetched hackathons with IPFS/IPNS');

    } catch (ipfsError) {
      console.error('❌ IPFS/IPNS failed, using fallback:', ipfsError);
      useIPFS = false;

      // Fallback to mock data if IPNS is not available
      console.log('📦 Using mock fallback data with session storage');
      const mockHackathons = [
        {
          id: '1',
          title: 'Web3 Innovate Jam',
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

      // Combine mock data with session storage (newly created hackathons)
      hackathons = [...sessionHackathons, ...mockHackathons];
    }

    return NextResponse.json({
      success: true,
      data: hackathons,
      count: hackathons.length,
      mode: useIPFS ? 'ipfs' : 'fallback'
    });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch hackathons: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const hackathon: Hackathon = {
      ...body,
      id: hackathonId,
      slug,
      createdAt: body.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    console.log('🚀 Creating hackathon:', hackathon.title);

    // Try IPFS/IPNS with timeout and fallback
    let createdId = hackathonId;
    let useIPFS = true;

    try {
      const service = getMasterIPNSService();

      // Add timeout wrapper
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('IPFS operation timed out')), 10000);
      });

      createdId = await Promise.race([
        service.createHackathon(hackathon),
        timeoutPromise
      ]);

      console.log('✅ Successfully created hackathon with IPFS/IPNS');

    } catch (ipfsError) {
      console.error('❌ IPFS/IPNS failed, using fallback:', ipfsError);
      useIPFS = false;

      // Store in session storage for immediate visibility
      sessionHackathons.push(hackathon);
      console.log('📦 Stored hackathon in session storage:', hackathon.title);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: createdId,
        slug,
        message: useIPFS
          ? 'Hackathon created successfully and published to IPNS'
          : 'Hackathon created successfully (IPFS temporarily unavailable)',
        mode: useIPFS ? 'ipfs' : 'local'
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
