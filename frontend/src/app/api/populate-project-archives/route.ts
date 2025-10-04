import { NextRequest, NextResponse } from 'next/server';
import { getProjectArchiveService } from '../../../lib/project-archive-storage';

// Sample project data for testing
const sampleProjects = [
  {
    title: 'DeFi Yield Optimizer',
    status: 'Completed' as const,
    description: 'An automated yield farming protocol that optimizes returns across multiple DeFi platforms.',
    date: '2024-04-15',
    hackathon: 'ChainSpark Hackathon',
    technologies: ['React', 'Solidity', 'Web3.js'],
    result: '1st Place',
    prize: '$12,000',
    stars: 24,
    color: '#0092ff',
    githubUrl: 'https://github.com/example/defi-yield-optimizer',
    demoUrl: 'https://demo.example.com/defi-optimizer',
    documentation: 'https://docs.example.com/defi-optimizer',
    teamMembers: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
    tags: ['DeFi', 'Yield Farming', 'Smart Contracts'],
    images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop']
  },
  {
    title: 'Decentralized Identity Verification',
    status: 'Completed' as const,
    description: 'A privacy-focused identity verification system using zero-knowledge proofs.',
    date: '2024-03-10',
    hackathon: 'Moca Network Identity',
    technologies: ['TypeScript', 'ZK-SNARKs', 'Ethereum'],
    result: '2nd Place',
    prize: '$8,000',
    stars: 17,
    color: '#4ef467',
    githubUrl: 'https://github.com/example/identity-verification',
    demoUrl: 'https://demo.example.com/identity-verification',
    teamMembers: ['David Wilson', 'Eva Brown'],
    tags: ['Identity', 'Privacy', 'Zero-Knowledge'],
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop']
  },
  {
    title: 'Cross-Chain NFT Marketplace',
    status: 'In Progress' as const,
    description: 'A marketplace for trading NFTs across multiple blockchain networks with unified liquidity.',
    date: '2024-01-20',
    hackathon: 'Web3 Innovate Jam',
    technologies: ['Next.js', 'Solidity', 'The Graph'],
    result: 'Ongoing',
    prize: '-',
    stars: 9,
    color: '#f44336',
    githubUrl: 'https://github.com/example/nft-marketplace',
    teamMembers: ['Frank Miller', 'Grace Lee', 'Henry Taylor'],
    tags: ['NFT', 'Marketplace', 'Cross-Chain'],
    images: ['https://images.unsplash.com/photo-1639322537228-f912d17701cd?w=800&h=600&fit=crop']
  },
  {
    title: 'Decentralized Prediction Markets',
    status: 'Completed' as const,
    description: 'A platform for creating and participating in prediction markets with minimal fees.',
    date: '2024-01-25',
    hackathon: 'DeFi Winter Hack',
    technologies: ['React', 'Solidity', 'ChainLink'],
    result: 'Finalist',
    prize: '$3,000',
    stars: 15,
    color: '#ff9800',
    githubUrl: 'https://github.com/example/prediction-markets',
    demoUrl: 'https://demo.example.com/prediction-markets',
    teamMembers: ['Iris Chen', 'Jack Anderson'],
    tags: ['Prediction Markets', 'DeFi', 'Oracle'],
    images: ['https://images.unsplash.com/photo-1642790104077-9da5d6336a65?w=800&h=600&fit=crop']
  },
  {
    title: 'DAO Governance Dashboard',
    status: 'Abandoned' as const,
    description: 'An analytics and governance tool for DAOs to visualize treasury, voting patterns, and member participation.',
    date: '2023-12-05',
    hackathon: 'Governance Hackathon',
    technologies: ['Vue.js', 'Python', 'The Graph'],
    result: 'Not Submitted',
    prize: '-',
    stars: 3,
    color: '#9e9e9e',
    githubUrl: 'https://github.com/example/dao-dashboard',
    teamMembers: ['Kate Rodriguez'],
    tags: ['DAO', 'Governance', 'Analytics'],
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop']
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/populate-project-archives - Populating sample projects');
    
    const service = getProjectArchiveService();
    await service.initializeMasterIPNS();
    
    const results = [];
    
    for (const projectData of sampleProjects) {
      try {
        console.log(`📝 Creating project: ${projectData.title}`);
        const projectId = await service.createProject(projectData);
        
        results.push({
          id: projectId,
          title: projectData.title,
          status: 'success'
        });
        
        console.log(`✅ Created: ${projectData.title} (${projectId})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to create ${projectData.title}:`, error);
        results.push({
          title: projectData.title,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    console.log('🎉 Project archive population complete!');
    
    return NextResponse.json({
      success: true,
      message: 'Sample projects populated in IPNS',
      results,
      totalCreated: results.filter(r => r.status === 'success').length,
      totalFailed: results.filter(r => r.status === 'failed').length
    });
    
  } catch (error) {
    console.error('❌ Error populating project archives:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to populate project archives: ${error}`,
        results: []
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to populate sample projects in IPNS',
    projects: sampleProjects.map(p => p.title)
  });
}
