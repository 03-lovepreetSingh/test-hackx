import { lighthouse } from '@lighthouse-web3/sdk';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  avatar: string;
  location: string;
  website: string;
  github: string;
  twitter: string;
  linkedin: string;
  skills: string[];
  interests: string[];
  achievements: {
    title: string;
    description: string;
    date: string;
    type: 'hackathon' | 'certification' | 'award' | 'other';
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'archived';
    technologies: string[];
    githubUrl?: string;
    demoUrl?: string;
  }[];
  socialStats: {
    followers: number;
    following: number;
    projects: number;
    hackathons: number;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    publicProfile: boolean;
  };
  createdAt: number;
  updatedAt: number;
  ipnsRecord?: string;
  ipfsHash?: string;
}

export interface MasterUserIndex {
  users: {
    [userId: string]: {
      ipnsRecord: string;
      ipfsHash: string;
      lastUpdated: number;
    };
  };
  totalUsers: number;
  lastUpdated: number;
}

export interface LighthouseConfig {
  apiKey: string;
  privateKey: string;
}

export class UserProfileStorageService {
  private config: LighthouseConfig;
  private masterIPNSKey: string = 'user-profiles-master';
  private userIPNSPrefix: string = 'user-profile-';

  constructor(config: LighthouseConfig) {
    this.config = config;
  }

  /**
   * Initialize the master IPNS for user profiles
   */
  async initializeMasterIPNS(): Promise<void> {
    try {
      console.log('🔧 Initializing master IPNS for user profiles...');
      
      // Check if master IPNS already exists
      const existingIndex = await this.getMasterUserIndex();
      if (existingIndex) {
        console.log('✅ Master IPNS already exists');
        return;
      }

      // Create initial master index
      const masterIndex: MasterUserIndex = {
        users: {},
        totalUsers: 0,
        lastUpdated: Date.now()
      };

      // Upload to IPFS
      const ipfsHash = await this.uploadToIPFS(masterIndex);
      
      // Create IPNS record
      const ipnsRecord = await this.createIPNSRecord(this.masterIPNSKey, ipfsHash);
      
      console.log(`✅ Master IPNS initialized: ${ipnsRecord}`);
    } catch (error) {
      console.error('❌ Failed to initialize master IPNS:', error);
      throw error;
    }
  }

  /**
   * Get the master user index
   */
  async getMasterUserIndex(): Promise<MasterUserIndex | null> {
    try {
      const ipnsRecord = await this.getIPNSRecord(this.masterIPNSKey);
      if (!ipnsRecord) {
        return null;
      }

      const data = await this.downloadFromIPFS(ipnsRecord);
      return data as MasterUserIndex;
    } catch (error) {
      console.error('❌ Failed to get master user index:', error);
      return null;
    }
  }

  /**
   * Create or update a user profile
   */
  async createOrUpdateUserProfile(userId: string, profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'ipnsRecord' | 'ipfsHash'>): Promise<string> {
    try {
      console.log(`🔧 Creating/updating user profile for: ${userId}`);

      // Create user profile
      const userProfile: UserProfile = {
        ...profileData,
        id: userId,
        createdAt: profileData.createdAt || Date.now(),
        updatedAt: Date.now()
      };

      // Upload user profile to IPFS
      const userIpfsHash = await this.uploadToIPFS(userProfile);
      
      // Create IPNS record for user
      const userIPNSKey = `${this.userIPNSPrefix}${userId}`;
      const userIpnsRecord = await this.createIPNSRecord(userIPNSKey, userIpfsHash);

      // Update user profile with IPNS/IPFS data
      userProfile.ipnsRecord = userIpnsRecord;
      userProfile.ipfsHash = userIpfsHash;

      // Re-upload with IPNS/IPFS data
      const finalIpfsHash = await this.uploadToIPFS(userProfile);
      const finalIpnsRecord = await this.createIPNSRecord(userIPNSKey, finalIpfsHash);

      // Update master index
      await this.updateMasterIndex(userId, finalIpnsRecord, finalIpfsHash);

      console.log(`✅ User profile created/updated: ${finalIpnsRecord}`);
      return finalIpnsRecord;
    } catch (error) {
      console.error('❌ Failed to create/update user profile:', error);
      throw error;
    }
  }

  /**
   * Get a user profile by ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log(`🔧 Getting user profile for: ${userId}`);

      // Get master index
      const masterIndex = await this.getMasterUserIndex();
      if (!masterIndex || !masterIndex.users[userId]) {
        console.log('❌ User not found in master index');
        return null;
      }

      // Get user IPNS record
      const userIPNSKey = `${this.userIPNSPrefix}${userId}`;
      const userIpnsRecord = await this.getIPNSRecord(userIPNSKey);
      
      if (!userIpnsRecord) {
        console.log('❌ User IPNS record not found');
        return null;
      }

      // Download user profile from IPFS
      const userProfile = await this.downloadFromIPFS(userIpnsRecord);
      console.log(`✅ User profile retrieved: ${userId}`);
      
      return userProfile as UserProfile;
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Get all user profiles
   */
  async getAllUserProfiles(): Promise<UserProfile[]> {
    try {
      console.log('🔧 Getting all user profiles...');

      const masterIndex = await this.getMasterUserIndex();
      if (!masterIndex) {
        console.log('❌ Master index not found');
        return [];
      }

      const profiles: UserProfile[] = [];
      
      for (const [userId, userData] of Object.entries(masterIndex.users)) {
        try {
          const profile = await this.getUserProfile(userId);
          if (profile) {
            profiles.push(profile);
          }
        } catch (error) {
          console.error(`❌ Failed to get profile for user ${userId}:`, error);
        }
      }

      console.log(`✅ Retrieved ${profiles.length} user profiles`);
      return profiles;
    } catch (error) {
      console.error('❌ Failed to get all user profiles:', error);
      return [];
    }
  }

  /**
   * Delete a user profile
   */
  async deleteUserProfile(userId: string): Promise<boolean> {
    try {
      console.log(`🔧 Deleting user profile: ${userId}`);

      const masterIndex = await this.getMasterUserIndex();
      if (!masterIndex || !masterIndex.users[userId]) {
        console.log('❌ User not found in master index');
        return false;
      }

      // Remove from master index
      delete masterIndex.users[userId];
      masterIndex.totalUsers = Object.keys(masterIndex.users).length;
      masterIndex.lastUpdated = Date.now();

      // Update master index
      const masterIpfsHash = await this.uploadToIPFS(masterIndex);
      await this.createIPNSRecord(this.masterIPNSKey, masterIpfsHash);

      console.log(`✅ User profile deleted: ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete user profile:', error);
      return false;
    }
  }

  /**
   * Search user profiles
   */
  async searchUserProfiles(query: string, filters?: {
    skills?: string[];
    location?: string;
    interests?: string[];
  }): Promise<UserProfile[]> {
    try {
      console.log(`🔧 Searching user profiles with query: ${query}`);

      const allProfiles = await this.getAllUserProfiles();
      let filteredProfiles = allProfiles;

      if (query) {
        const searchTerm = query.toLowerCase();
        filteredProfiles = filteredProfiles.filter(profile =>
          profile.fullName.toLowerCase().includes(searchTerm) ||
          profile.username.toLowerCase().includes(searchTerm) ||
          profile.bio.toLowerCase().includes(searchTerm) ||
          profile.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
      }

      if (filters?.skills && filters.skills.length > 0) {
        filteredProfiles = filteredProfiles.filter(profile =>
          filters.skills!.some(skill =>
            profile.skills.some(profileSkill =>
              profileSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }

      if (filters?.location) {
        filteredProfiles = filteredProfiles.filter(profile =>
          profile.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters?.interests && filters.interests.length > 0) {
        filteredProfiles = filteredProfiles.filter(profile =>
          filters.interests!.some(interest =>
            profile.interests.some(profileInterest =>
              profileInterest.toLowerCase().includes(interest.toLowerCase())
            )
          )
        );
      }

      console.log(`✅ Found ${filteredProfiles.length} matching profiles`);
      return filteredProfiles;
    } catch (error) {
      console.error('❌ Failed to search user profiles:', error);
      return [];
    }
  }

  // Private helper methods

  private async uploadToIPFS(data: any): Promise<string> {
    try {
      const response = await lighthouse.uploadText(
        JSON.stringify(data),
        this.config.apiKey
      );
      return response.data.Hash;
    } catch (error) {
      console.error('❌ Failed to upload to IPFS:', error);
      throw error;
    }
  }

  private async downloadFromIPFS(hash: string): Promise<any> {
    try {
      const response = await lighthouse.downloadFile(hash);
      return JSON.parse(response.data);
    } catch (error) {
      console.error('❌ Failed to download from IPFS:', error);
      throw error;
    }
  }

  private async createIPNSRecord(key: string, hash: string): Promise<string> {
    try {
      const response = await lighthouse.publishIPNSRecord(
        hash,
        key,
        this.config.privateKey
      );
      return response.data.Name;
    } catch (error) {
      console.error('❌ Failed to create IPNS record:', error);
      throw error;
    }
  }

  private async getIPNSRecord(key: string): Promise<string | null> {
    try {
      const response = await lighthouse.getIPNSRecord(key);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get IPNS record:', error);
      return null;
    }
  }

  private async updateMasterIndex(userId: string, ipnsRecord: string, ipfsHash: string): Promise<void> {
    try {
      const masterIndex = await this.getMasterUserIndex() || {
        users: {},
        totalUsers: 0,
        lastUpdated: Date.now()
      };

      masterIndex.users[userId] = {
        ipnsRecord,
        ipfsHash,
        lastUpdated: Date.now()
      };
      masterIndex.totalUsers = Object.keys(masterIndex.users).length;
      masterIndex.lastUpdated = Date.now();

      const masterIpfsHash = await this.uploadToIPFS(masterIndex);
      await this.createIPNSRecord(this.masterIPNSKey, masterIpfsHash);
    } catch (error) {
      console.error('❌ Failed to update master index:', error);
      throw error;
    }
  }
}

// Singleton instance
let userProfileService: UserProfileStorageService | null = null;

export function getUserProfileService(): UserProfileStorageService {
  if (!userProfileService) {
    const config: LighthouseConfig = {
      apiKey: process.env.LIGHTHOUSE_API_KEY || '',
      privateKey: process.env.LIGHTHOUSE_PRIVATE_KEY || ''
    };
    
    // For development, use mock service if no API key is provided
    if (!config.apiKey) {
      console.warn('⚠️ LIGHTHOUSE_API_KEY not configured. Using mock service for development.');
      userProfileService = new MockUserProfileService();
    } else {
      userProfileService = new UserProfileStorageService(config);
    }
  }
  
  return userProfileService;
}

// Mock service for development when Lighthouse is not configured
class MockUserProfileService {
  private mockProfiles: UserProfile[] = [
    {
      id: '1',
      username: 'alice_dev',
      email: 'alice@example.com',
      fullName: 'Alice Johnson',
      bio: 'Full-stack developer passionate about DeFi and Web3 technologies. Building the future of decentralized finance.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      website: 'https://alice.dev',
      github: 'alice-dev',
      twitter: 'alice_dev',
      linkedin: 'alice-johnson',
      skills: ['React', 'Solidity', 'Web3.js', 'TypeScript', 'Node.js'],
      interests: ['DeFi', 'NFTs', 'Blockchain', 'Smart Contracts'],
      achievements: [
        {
          title: '1st Place - ChainSpark Hackathon',
          description: 'Won first place for DeFi Yield Optimizer project',
          date: '2024-04-15',
          type: 'hackathon'
        },
        {
          title: 'Certified Ethereum Developer',
          description: 'Completed advanced Solidity development course',
          date: '2024-02-10',
          type: 'certification'
        }
      ],
      projects: [
        {
          id: '1',
          title: 'DeFi Yield Optimizer',
          description: 'Automated yield farming protocol',
          status: 'completed',
          technologies: ['React', 'Solidity', 'Web3.js'],
          githubUrl: 'https://github.com/alice-dev/defi-optimizer',
          demoUrl: 'https://defi-optimizer.demo.com'
        }
      ],
      socialStats: {
        followers: 1250,
        following: 340,
        projects: 12,
        hackathons: 8
      },
      preferences: {
        theme: 'dark',
        notifications: true,
        publicProfile: true
      },
      createdAt: Date.now() - 86400000 * 30, // 30 days ago
      updatedAt: Date.now()
    },
    {
      id: '2',
      username: 'bob_builder',
      email: 'bob@example.com',
      fullName: 'Bob Smith',
      bio: 'Blockchain architect and smart contract developer. Focused on building scalable Web3 solutions.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      website: 'https://bob.build',
      github: 'bob-builder',
      twitter: 'bob_builder',
      linkedin: 'bob-smith',
      skills: ['Solidity', 'Rust', 'Go', 'Docker', 'Kubernetes'],
      interests: ['Blockchain', 'Infrastructure', 'Security', 'Scalability'],
      achievements: [
        {
          title: '2nd Place - Moca Network Identity',
          description: 'Decentralized identity verification system',
          date: '2024-03-10',
          type: 'hackathon'
        }
      ],
      projects: [
        {
          id: '2',
          title: 'Decentralized Identity Verification',
          description: 'Privacy-focused identity system using ZK-SNARKs',
          status: 'completed',
          technologies: ['TypeScript', 'ZK-SNARKs', 'Ethereum'],
          githubUrl: 'https://github.com/bob-builder/identity-verification'
        }
      ],
      socialStats: {
        followers: 890,
        following: 156,
        projects: 8,
        hackathons: 5
      },
      preferences: {
        theme: 'light',
        notifications: false,
        publicProfile: true
      },
      createdAt: Date.now() - 86400000 * 45, // 45 days ago
      updatedAt: Date.now()
    }
  ];

  async initializeMasterIPNS(): Promise<void> {
    console.log('🔧 Mock service: Master IPNS initialized for user profiles');
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    console.log(`🔧 Mock service: Getting user profile ${userId}`);
    return this.mockProfiles.find(p => p.id === userId) || null;
  }

  async getAllUserProfiles(): Promise<UserProfile[]> {
    console.log('🔧 Mock service: Returning mock user profiles');
    return this.mockProfiles;
  }

  async createOrUpdateUserProfile(userId: string, profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'ipnsRecord' | 'ipfsHash'>): Promise<string> {
    const userProfile: UserProfile = {
      ...profileData,
      id: userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const existingIndex = this.mockProfiles.findIndex(p => p.id === userId);
    if (existingIndex >= 0) {
      this.mockProfiles[existingIndex] = userProfile;
    } else {
      this.mockProfiles.push(userProfile);
    }

    console.log(`🔧 Mock service: Created/updated user profile ${userId}`);
    return `mock-ipns-${userId}`;
  }

  async deleteUserProfile(userId: string): Promise<boolean> {
    const index = this.mockProfiles.findIndex(p => p.id === userId);
    if (index >= 0) {
      this.mockProfiles.splice(index, 1);
      console.log(`🔧 Mock service: Deleted user profile ${userId}`);
      return true;
    }
    return false;
  }

  async searchUserProfiles(query: string, filters?: any): Promise<UserProfile[]> {
    let filteredProfiles = this.mockProfiles;

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.fullName.toLowerCase().includes(searchTerm) ||
        profile.username.toLowerCase().includes(searchTerm) ||
        profile.bio.toLowerCase().includes(searchTerm) ||
        profile.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    console.log(`🔧 Mock service: Found ${filteredProfiles.length} matching profiles`);
    return filteredProfiles;
  }
}
