import { NextRequest, NextResponse } from 'next/server';
import { getProjectArchiveService } from '../../../lib/project-archive-storage';
import { Project } from '../../../lib/project-archive-storage';

// Simple in-memory storage for session persistence
let sessionProjects: Project[] = [];

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/project-archives - Fetching all projects');
    
    // Check if Lighthouse is configured
    const hasLighthouseKey = (process.env.LIGHTHOUSE_KEY || process.env.LIGHTHOUSE_API_KEY) &&
                             (process.env.LIGHTHOUSE_KEY || process.env.LIGHTHOUSE_API_KEY)!.trim() !== '';

    if (!hasLighthouseKey) {
      console.log('⚠️ Lighthouse not configured, using mock data');

      // Return mock data directly
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
        },
        {
          id: '3',
          title: 'AI-Powered NFT Marketplace',
          status: 'In Progress',
          description: 'A next-generation NFT marketplace with AI-powered curation, automated pricing, and smart contract integration.',
          date: '2024-05-20',
          hackathon: 'Web3 Innovation Summit',
          technologies: ['Next.js', 'AI/ML', 'Solidity', 'IPFS'],
          result: 'Ongoing',
          prize: 'TBD',
          stars: 8,
          color: '#ff6b35',
          githubUrl: 'https://github.com/example/ai-nft-marketplace',
          demoUrl: 'https://ai-nft-demo.example.com',
          documentation: 'https://docs.ai-nft.example.com',
          teamMembers: ['Sarah Chen', 'Mike Rodriguez', 'Alex Kim'],
          tags: ['AI', 'NFT', 'Marketplace', 'Web3'],
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
      
      // Combine session storage with mock data
      const allProjects = [...sessionProjects, ...mockProjects];

      return NextResponse.json({
        success: true,
        data: allProjects,
        count: allProjects.length,
        message: 'Using mock data (Lighthouse not configured)'
      });
    }
    
    // Use Lighthouse service if configured
    try {
      const service = getProjectArchiveService();

      // Add timeout wrapper for IPNS operations with increased timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('IPNS operation timed out')), 30000);
      });

      await Promise.race([
        service.initializeMasterIPNS(),
        timeoutPromise
      ]);

      const projects = await Promise.race([
        service.getAllProjects(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Projects fetch timed out')), 25000);
        })
      ]);

      console.log(`✅ Successfully fetched ${projects.length} projects from IPNS`);

      return NextResponse.json({
        success: true,
        data: projects,
        count: projects.length
      });
    } catch (ipfsError) {
      console.error('❌ IPFS/IPNS failed, falling back to mock data:', ipfsError);

      // Fall back to mock data
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
        },
        {
          id: '3',
          title: 'AI-Powered NFT Marketplace',
          status: 'In Progress',
          description: 'A next-generation NFT marketplace with AI-powered curation, automated pricing, and smart contract integration.',
          date: '2024-05-20',
          hackathon: 'Web3 Innovation Summit',
          technologies: ['Next.js', 'AI/ML', 'Solidity', 'IPFS'],
          result: 'Ongoing',
          prize: 'TBD',
          stars: 8,
          color: '#ff6b35',
          githubUrl: 'https://github.com/example/ai-nft-marketplace',
          demoUrl: 'https://ai-nft-demo.example.com',
          documentation: 'https://docs.ai-nft.example.com',
          teamMembers: ['Sarah Chen', 'Mike Rodriguez', 'Alex Kim'],
          tags: ['AI', 'NFT', 'Marketplace', 'Web3'],
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ];

      // Combine session storage with mock data
      const allProjects = [...sessionProjects, ...mockProjects];

      return NextResponse.json({
        success: true,
        data: allProjects,
        count: allProjects.length,
        message: 'Using mock data (IPFS unavailable)'
      });
    }
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/project-archives - Creating new project');
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description) {
      console.log('❌ Validation failed: missing title or description');
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Set default values
    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ipnsRecord' | 'ipfsHash'> = {
      title: body.title,
      status: body.status || 'In Progress',
      description: body.description,
      date: body.date || new Date().toISOString().split('T')[0],
      hackathon: body.hackathon || 'Unknown Hackathon',
      technologies: body.technologies || [],
      result: body.result || 'Ongoing',
      prize: body.prize || '-',
      stars: body.stars || 0,
      color: body.color || '#0092ff',
      githubUrl: body.githubUrl,
      demoUrl: body.demoUrl,
      documentation: body.documentation,
      teamMembers: body.teamMembers || [],
      tags: body.tags || [],
      images: body.images || [],
      video: body.video
    };

    console.log(`📝 Creating project: ${projectData.title}`);

    // Try IPFS first with timeout and fallback
    let projectId: string;
    let useIPFS = true;

    try {
      const service = getProjectArchiveService();

      // Add timeout wrapper for IPNS operations with increased timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('IPNS operation timed out')), 30000);
      });

      await Promise.race([
        service.initializeMasterIPNS(),
        timeoutPromise
      ]);

      projectId = await Promise.race([
        service.createProject(projectData),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Project creation timed out')), 25000);
        })
      ]);

      console.log(`✅ Successfully created project with IPFS/IPNS: ${projectId}`);

    } catch (ipfsError) {
      console.error('❌ IPFS/IPNS failed, using fallback:', ipfsError);
      useIPFS = false;

      // Fallback: Create project with generated ID and store in session
      projectId = crypto.randomUUID();
      const newProject: Project = {
        ...projectData,
        id: projectId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ipnsRecord: '',
        ipfsHash: ''
      };

      // Store in session storage
      sessionProjects.push(newProject);
      console.log('📦 Stored project in session storage:', newProject.title);
    }
    return NextResponse.json({
      success: true,
      data: {
        id: projectId,
        message: useIPFS
          ? 'Project created successfully and published to IPNS'
          : 'Project created successfully (IPFS temporarily unavailable)',
        mode: useIPFS ? 'ipfs' : 'session'
      }
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
