import lighthouse from '@lighthouse-web3/sdk';

export interface LighthouseConfig {
  apiKey: string;
  privateKey: string;
}

export interface Project {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Abandoned';
  description: string;
  date: string;
  hackathon: string;
  technologies: string[];
  result: string;
  prize: string;
  stars: number;
  color: string;
  ipnsRecord?: string;
  ipfsHash?: string;
  createdAt: number;
  updatedAt: number;
  // Additional fields for detailed project info
  githubUrl?: string;
  demoUrl?: string;
  documentation?: string;
  teamMembers?: string[];
  tags?: string[];
  images?: string[];
  video?: string;
}

export interface ProjectArchiveIndexEntry {
  id: string;
  title: string;
  status: string;
  hackathon: string;
  ipnsRecord: string;
  ipfsHash: string;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectArchiveIndexData {
  projects: ProjectArchiveIndexEntry[];
  metadata: {
    lastUpdated: number;
    version: string;
    totalCount: number;
  };
}

export class ProjectArchiveStorageService {
  private config: LighthouseConfig;
  private masterIPNSId: string = '';
  private masterIPNSName: string = 'project-archives-master';
  private archiveIPNS: string = 'project-archives';

  constructor(config: LighthouseConfig) {
    this.config = config;
  }

  /**
   * Upload data to IPFS and get IPFS hash
   */
  async uploadToIPFS(data: any): Promise<string> {
    try {
      const response = await lighthouse.uploadText(
        JSON.stringify(data),
        this.config.apiKey
      );
      
      if (response.data && response.data.Hash) {
        return response.data.Hash;
      }
      throw new Error('Failed to get IPFS hash from upload response');
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error(`Failed to upload data to IPFS: ${error}`);
    }
  }

  /**
   * Download data from IPFS hash
   */
  async downloadFromIPFS(ipfsHash: string): Promise<any> {
    try {
      const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${ipfsHash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error downloading from IPFS:', error);
      throw new Error(`Failed to download data from IPFS: ${error}`);
    }
  }

  /**
   * Create or update IPNS record
   */
  async createOrUpdateIPNS(ipfsHash: string, ipnsName?: string): Promise<string> {
    try {
      const keyName = ipnsName || this.archiveIPNS;

      const response = await lighthouse.publishRecord(
        ipfsHash,
        keyName,
        this.config.apiKey
      );

      if (response.data && response.data.Name) {
        return response.data.Name;
      }
      throw new Error('Failed to get IPNS name from publish response');
    } catch (error) {
      console.error('Error creating/updating IPNS:', error);
      throw new Error(`Failed to create/update IPNS: ${error}`);
    }
  }

  /**
   * Generate a new IPNS key
   */
  async generateIPNSKey(): Promise<{ ipnsName: string; ipnsId: string }> {
    try {
      const response = await lighthouse.generateKey(this.config.apiKey);

      if (response.data && response.data.ipnsName && response.data.ipnsId) {
        return {
          ipnsName: response.data.ipnsName,
          ipnsId: response.data.ipnsId
        };
      }
      throw new Error('Failed to get IPNS key from generate response');
    } catch (error) {
      console.error('Error generating IPNS key:', error);
      throw new Error(`Failed to generate IPNS key: ${error}`);
    }
  }

  /**
   * Get all IPNS keys
   */
  async getAllIPNSKeys(): Promise<any[]> {
    try {
      const response = await lighthouse.getAllKeys(this.config.apiKey);
      return response.data || [];
    } catch (error) {
      console.error('Error getting IPNS keys:', error);
      return [];
    }
  }

  /**
   * Initialize master IPNS for project archives
   */
  async initializeMasterIPNS(): Promise<void> {
    try {
      const allKeys = await this.getAllIPNSKeys();

      // Look for existing master IPNS key by checking for projects master key
      // The master IPNS should have a specific pattern or be the first one with project data
      const existingMasterKey = allKeys.find(key =>
        key.ipnsName === 'project-archives-master' ||
        key.ipnsName === this.masterIPNSName ||
        (key.cid && key.cid !== '') // Look for a key that has content
      );

      if (!existingMasterKey) {
        // Create new master IPNS key
        const { ipnsName, ipnsId } = await this.generateIPNSKey();
        this.masterIPNSId = ipnsId; // Use the IPNS ID for lookups
        this.masterIPNSName = ipnsName; // Store the IPNS name for publishing

        // Create initial empty index
        const initialIndex: ProjectArchiveIndexData = {
          projects: [],
          metadata: {
            lastUpdated: Date.now(),
            version: '1.0.0',
            totalCount: 0
          }
        };

        const ipfsHash = await this.uploadToIPFS(initialIndex);
        await this.createOrUpdateIPNS(ipfsHash, ipnsName);

        console.log(`✅ Created new master IPNS: ${this.masterIPNSId} (${this.masterIPNSName})`);
      } else {
        this.masterIPNSId = existingMasterKey.ipnsId; // Use the IPNS ID for lookups
        this.masterIPNSName = existingMasterKey.ipnsName; // Store the IPNS name for publishing
        console.log(`✅ Using existing master IPNS: ${this.masterIPNSId} (${this.masterIPNSName})`);
      }
    } catch (error) {
      console.error('Error initializing master IPNS:', error);
      throw error;
    }
  }

  /**
   * Get master index from IPNS
   */
  async getMasterIndex(): Promise<ProjectArchiveIndexData> {
    try {
      const response = await fetch(`https://gateway.lighthouse.storage/ipns/${this.masterIPNSId}`);
      if (!response.ok) {
        console.log(`⚠️ Master IPNS not found (${response.status}), creating default index`);
        // Create default index if none exists
        const defaultIndex: ProjectArchiveIndexData = {
          projects: [],
          metadata: {
            lastUpdated: Date.now(),
            version: '1.0.0',
            totalCount: 0
          }
        };
        return defaultIndex;
      }

      const data = await response.json();

      // Validate the structure
      if (!data || !data.projects || !Array.isArray(data.projects)) {
        console.log('⚠️ Invalid master index structure, creating default');
        const defaultIndex: ProjectArchiveIndexData = {
          projects: [],
          metadata: {
            lastUpdated: Date.now(),
            version: '1.0.0',
            totalCount: 0
          }
        };
        return defaultIndex;
      }

      return data;
    } catch (error) {
      console.log('⚠️ Error getting master index, creating default:', error);
      // Create default index if there's any error
      const defaultIndex: ProjectArchiveIndexData = {
        projects: [],
        metadata: {
          lastUpdated: Date.now(),
          version: '1.0.0',
          totalCount: 0
        }
      };
      return defaultIndex;
    }
  }

  /**
   * Update master index
   */
  async updateMasterIndex(indexData: ProjectArchiveIndexData): Promise<string> {
    try {
      const ipfsHash = await this.uploadToIPFS(indexData);
      await this.createOrUpdateIPNS(ipfsHash, this.masterIPNSName);
      return ipfsHash;
    } catch (error) {
      console.error('Error updating master index:', error);
      throw new Error(`Failed to update master index: ${error}`);
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ipnsRecord' | 'ipfsHash'>): Promise<string> {
    try {
      const projectId = crypto.randomUUID();
      const now = Date.now();
      
      const project: Project = {
        ...projectData,
        id: projectId,
        createdAt: now,
        updatedAt: now
      };

      // Upload project to IPFS
      const projectIpfsHash = await this.uploadToIPFS(project);
      
      // Generate IPNS key for this specific project
      const { ipnsName: projectIpnsName } = await this.generateIPNSKey();
      
      // Publish project to its own IPNS
      await this.createOrUpdateIPNS(projectIpfsHash, projectIpnsName);
      
      // Update project with IPNS and IPFS info
      project.ipnsRecord = projectIpnsName;
      project.ipfsHash = projectIpfsHash;

      // Get current master index
      const masterIndex = await this.getMasterIndex();
      
      // Add project to master index
      const projectEntry: ProjectArchiveIndexEntry = {
        id: projectId,
        title: project.title,
        status: project.status,
        hackathon: project.hackathon,
        ipnsRecord: projectIpnsName,
        ipfsHash: projectIpfsHash,
        createdAt: now,
        updatedAt: now
      };

      masterIndex.projects.push(projectEntry);
      masterIndex.metadata.totalCount = masterIndex.projects.length;
      masterIndex.metadata.lastUpdated = now;

      // Update master index
      await this.updateMasterIndex(masterIndex);

      console.log(`✅ Created project: ${project.title} (ID: ${projectId})`);
      return projectId;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error(`Failed to create project: ${error}`);
    }
  }

  /**
   * Get all projects from master index
   */
  async getAllProjects(): Promise<Project[]> {
    try {
      const masterIndex = await this.getMasterIndex();
      const projects: Project[] = [];

      for (const entry of masterIndex.projects) {
        try {
          const project = await this.downloadFromIPFS(entry.ipfsHash);
          projects.push(project);
        } catch (error) {
          console.error(`Error fetching project ${entry.id}:`, error);
        }
      }

      return projects;
    } catch (error) {
      console.error('Error getting all projects:', error);
      throw new Error(`Failed to get all projects: ${error}`);
    }
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const masterIndex = await this.getMasterIndex();
      const entry = masterIndex.projects.find(p => p.id === projectId);
      
      if (!entry) {
        return null;
      }

      return await this.downloadFromIPFS(entry.ipfsHash);
    } catch (error) {
      console.error('Error getting project by ID:', error);
      return null;
    }
  }

  /**
   * Update project
   */
  async updateProject(projectId: string, updateData: Partial<Project>): Promise<boolean> {
    try {
      const masterIndex = await this.getMasterIndex();
      const entryIndex = masterIndex.projects.findIndex(p => p.id === projectId);
      
      if (entryIndex === -1) {
        throw new Error('Project not found');
      }

      // Get current project data
      const currentProject = await this.downloadFromIPFS(masterIndex.projects[entryIndex].ipfsHash);
      
      // Merge with update data
      const updatedProject: Project = {
        ...currentProject,
        ...updateData,
        id: projectId, // Ensure ID doesn't change
        updatedAt: Date.now()
      };

      // Upload updated project to IPFS
      const newIpfsHash = await this.uploadToIPFS(updatedProject);
      
      // Update IPNS record for this project
      await this.createOrUpdateIPNS(newIpfsHash, masterIndex.projects[entryIndex].ipnsRecord);

      // Update master index entry
      masterIndex.projects[entryIndex].ipfsHash = newIpfsHash;
      masterIndex.projects[entryIndex].updatedAt = updatedProject.updatedAt;
      masterIndex.metadata.lastUpdated = Date.now();

      // Update master index
      await this.updateMasterIndex(masterIndex);

      console.log(`✅ Updated project: ${updatedProject.title} (ID: ${projectId})`);
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error(`Failed to update project: ${error}`);
    }
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      const masterIndex = await this.getMasterIndex();
      const entryIndex = masterIndex.projects.findIndex(p => p.id === projectId);
      
      if (entryIndex === -1) {
        throw new Error('Project not found');
      }

      // Remove from master index
      masterIndex.projects.splice(entryIndex, 1);
      masterIndex.metadata.totalCount = masterIndex.projects.length;
      masterIndex.metadata.lastUpdated = Date.now();

      // Update master index
      await this.updateMasterIndex(masterIndex);

      console.log(`✅ Deleted project: ${projectId}`);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error(`Failed to delete project: ${error}`);
    }
  }

  /**
   * Search projects
   */
  async searchProjects(query: string, filters?: { status?: string; hackathon?: string }): Promise<Project[]> {
    try {
      const allProjects = await this.getAllProjects();
      
      let filteredProjects = allProjects;

      // Apply text search
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        );
      }

      // Apply status filter
      if (filters?.status) {
        filteredProjects = filteredProjects.filter(project => 
          project.status === filters.status
        );
      }

      // Apply hackathon filter
      if (filters?.hackathon) {
        filteredProjects = filteredProjects.filter(project => 
          project.hackathon.toLowerCase().includes(filters.hackathon!.toLowerCase())
        );
      }

      return filteredProjects;
    } catch (error) {
      console.error('Error searching projects:', error);
      throw new Error(`Failed to search projects: ${error}`);
    }
  }
}

// Singleton instance
let projectArchiveService: ProjectArchiveStorageService | null = null;

export function getProjectArchiveService(): ProjectArchiveStorageService {
  if (!projectArchiveService) {
    const config: LighthouseConfig = {
      apiKey: process.env.LIGHTHOUSE_KEY || process.env.LIGHTHOUSE_API_KEY || '',
      privateKey: process.env.LIGHTHOUSE_PRIVATE_KEY || ''
    };
    
    // For development, use mock service if no API key is provided
    if (!config.apiKey) {
      console.warn('⚠️ LIGHTHOUSE_API_KEY not configured. Using mock service for development.');
      projectArchiveService = new MockProjectArchiveService();
    } else {
      projectArchiveService = new ProjectArchiveStorageService(config);
    }
  }
  
  return projectArchiveService;
}

// Mock service for development when Lighthouse is not configured
class MockProjectArchiveService {
  private mockProjects: Project[] = [
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

  async initializeMasterIPNS(): Promise<void> {
    console.log('🔧 Mock service: Master IPNS initialized');
  }

  async getAllProjects(): Promise<Project[]> {
    console.log('🔧 Mock service: Returning mock projects');
    return this.mockProjects;
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    console.log(`🔧 Mock service: Getting project ${projectId}`);
    return this.mockProjects.find(p => p.id === projectId) || null;
  }

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ipnsRecord' | 'ipfsHash'>): Promise<string> {
    const projectId = crypto.randomUUID();
    const now = Date.now();
    
    const project: Project = {
      ...projectData,
      id: projectId,
      createdAt: now,
      updatedAt: now
    };

    this.mockProjects.push(project);
    console.log(`🔧 Mock service: Created project ${projectId}`);
    return projectId;
  }

  async updateProject(projectId: string, updateData: Partial<Project>): Promise<boolean> {
    const index = this.mockProjects.findIndex(p => p.id === projectId);
    if (index === -1) return false;

    this.mockProjects[index] = {
      ...this.mockProjects[index],
      ...updateData,
      id: projectId,
      updatedAt: Date.now()
    };
    
    console.log(`🔧 Mock service: Updated project ${projectId}`);
    return true;
  }

  async deleteProject(projectId: string): Promise<boolean> {
    const index = this.mockProjects.findIndex(p => p.id === projectId);
    if (index === -1) return false;

    this.mockProjects.splice(index, 1);
    console.log(`🔧 Mock service: Deleted project ${projectId}`);
    return true;
  }

  async searchProjects(query: string, filters?: { status?: string; hackathon?: string }): Promise<Project[]> {
    let filteredProjects = this.mockProjects;

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProjects = filteredProjects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
      );
    }

    if (filters?.status) {
      filteredProjects = filteredProjects.filter(project => project.status === filters.status);
    }

    if (filters?.hackathon) {
      filteredProjects = filteredProjects.filter(project => 
        project.hackathon.toLowerCase().includes(filters.hackathon!.toLowerCase())
      );
    }

    console.log(`🔧 Mock service: Found ${filteredProjects.length} projects for query "${query}"`);
    return filteredProjects;
  }
}
