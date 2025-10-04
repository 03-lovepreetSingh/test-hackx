import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Simple project archives test...');
    
    // Return mock data directly without using the service
    const mockProjects = [
      {
        id: '1',
        title: 'DeFi Yield Optimizer',
        status: 'Completed',
        description: 'An automated yield farming protocol that optimizes returns across multiple DeFi platforms.',
        date: '2024-04-15',
        hackathon: 'ChainSpark Hackathon',
        technologies: ['React', 'Solidity', 'Web3.js'],
        result: '1st Place',
        prize: '$12,000',
        stars: 24,
        color: '#0092ff',
        githubUrl: 'https://github.com/example/defi-optimizer',
        demoUrl: 'https://demo.example.com',
        documentation: 'https://docs.example.com',
        teamMembers: ['Alice Johnson', 'Bob Smith'],
        tags: ['DeFi', 'Yield Farming'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: '2',
        title: 'Decentralized Identity Verification',
        status: 'Completed',
        description: 'A privacy-focused identity verification system using zero-knowledge proofs.',
        date: '2024-03-10',
        hackathon: 'Moca Network Identity',
        technologies: ['TypeScript', 'ZK-SNARKs', 'Ethereum'],
        result: '2nd Place',
        prize: '$8,000',
        stars: 17,
        color: '#4ef467',
        githubUrl: 'https://github.com/example/identity-verification',
        teamMembers: ['David Wilson', 'Eva Brown'],
        tags: ['Identity', 'Privacy'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];
    
    console.log(`✅ Returning ${mockProjects.length} mock projects`);
    
    return NextResponse.json({
      success: true,
      data: mockProjects,
      count: mockProjects.length,
      message: 'Using simple mock data (Lighthouse not configured)'
    });
  } catch (error) {
    console.error('❌ Simple test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Simple test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
