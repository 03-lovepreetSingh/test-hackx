import lighthouse from '@lighthouse-web3/sdk';
import { Hackathon } from '../app/types';

export interface LighthouseConfig {
  apiKey: string;
  privateKey: string;
}

export interface HackathonIndexEntry {
  id: string;
  title: string;
  slug: string;
  ipnsRecord: string;
  ipfsHash: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: number;
  updatedAt: number;
}

export interface MasterIndexData {
  hackathons: HackathonIndexEntry[];
  metadata: {
    lastUpdated: number;
    version: string;
    totalCount: number;
  };
}

export class MasterIPNSStorageService {
  private config: LighthouseConfig;
  private masterIPNS: string = 'hackathons-master';

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
      const keyName = ipnsName || this.masterIPNS;

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
      throw new Error('Failed to generate IPNS key: Invalid response format');
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
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error getting IPNS keys:', error);
      return [];
    }
  }

  /**
   * Resolve IPNS to IPFS hash using IPFS gateway
   */
  async resolveIPNS(ipnsId: string): Promise<string> {
    try {
      console.log(`🔍 Resolving IPNS: ${ipnsId}`);

      // Try multiple gateways
      const gateways = [
        `https://gateway.lighthouse.storage/ipns/${ipnsId}`,
        `https://ipfs.io/ipns/${ipnsId}`,
        `https://cloudflare-ipfs.com/ipns/${ipnsId}`,
        `https://dweb.link/ipns/${ipnsId}`
      ];

      let lastError;
      for (const gateway of gateways) {
        try {
          console.log(`   Trying gateway: ${gateway}`);
          const response = await fetch(gateway);

          if (response.ok) {
            const content = await response.text();
            console.log(`✅ Successfully resolved IPNS via ${gateway}`);
            return content;
          } else {
            console.log(`   ❌ Gateway responded with ${response.status}: ${response.statusText}`);
          }
        } catch (gatewayError) {
          console.log(`   ❌ Gateway error: ${gatewayError}`);
          lastError = gatewayError;
        }
      }

      throw new Error(`All gateways failed. Last error: ${lastError}`);
    } catch (error) {
      console.error('Error resolving IPNS:', error);
      throw new Error(`Failed to resolve IPNS ${ipnsId}: ${error}`);
    }
  }

  /**
   * Resolve IPNS to IPFS hash (returns the CID)
   */
  async resolveIPNSToCID(ipnsId: string): Promise<string> {
    try {
      console.log(`🎯 Resolving IPNS to CID: ${ipnsId}`);

      // Try multiple methods to get the CID
      const methods = [
        // Method 1: Direct CID resolution through gateway
        async () => {
          const response = await fetch(`https://gateway.lighthouse.storage/ipns/${ipnsId}?format=raw`);
          if (response.ok) {
            const cid = await response.text();
            return cid.trim();
          }
          throw new Error('Gateway returned non-OK status');
        },
        // Method 2: Use resolveIPNS and parse if it's a CID
        async () => {
          const resolved = await this.resolveIPNS(ipnsId);
          // Check if the resolved content is a valid CID
          if (/^[Qb][A-Za-z1-9]{44}$/.test(resolved) || /^b[A-Za-z2-7]{58}$/.test(resolved)) {
            return resolved;
          }
          throw new Error('Resolved content is not a CID');
        },
        // Method 3: Try IPFS HTTP API directly
        async () => {
          const response = await fetch(`https://api.ipfs.io/api/v0/name/resolve?arg=${ipnsId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.Path) {
              // Extract CID from /ipfs/{CID} path
              const match = data.Path.match(/\/ipfs\/(.+)$/);
              if (match && match[1]) {
                return match[1];
              }
            }
          }
          throw new Error('IPFS API resolution failed');
        }
      ];

      let lastError;
      for (let i = 0; i < methods.length; i++) {
        try {
          console.log(`   Trying method ${i + 1}`);
          const cid = await methods[i]();
          console.log(`✅ Successfully resolved to CID: ${cid}`);
          return cid;
        } catch (methodError) {
          console.log(`   ❌ Method ${i + 1} failed: ${methodError}`);
          lastError = methodError;
        }
      }

      throw new Error(`All resolution methods failed. Last error: ${lastError}`);
    } catch (error) {
      console.error('Error resolving IPNS to CID:', error);
      throw new Error(`Failed to resolve IPNS ${ipnsId} to CID: ${error}`);
    }
  }

  /**
   * Get master index data
   */
  async getMasterIndex(): Promise<MasterIndexData> {
    try {
      // Get all IPNS keys to find the master index
      const allKeys = await this.getAllIPNSKeys();
      const masterKey = allKeys.find(key => key.ipnsName === this.masterIPNS);

      if (!masterKey) {
        // Master index doesn't exist yet, return empty
        return {
          hackathons: [],
          metadata: {
            lastUpdated: Date.now(),
            version: '1.0.0',
            totalCount: 0
          }
        };
      }

      // Resolve the master IPNS record to get the CID
      const masterCID = await this.resolveIPNSToCID(masterKey.ipnsId);

      // Download the data using the CID
      const data = await this.downloadFromIPFS(masterCID);
      return data;
    } catch (error) {
      console.error('Error getting master index:', error);
      // Return empty index if master doesn't exist yet
      return {
        hackathons: [],
        metadata: {
          lastUpdated: Date.now(),
          version: '1.0.0',
          totalCount: 0
        }
      };
    }
  }

  /**
   * Update master index
   */
  async updateMasterIndex(indexData: MasterIndexData): Promise<string> {
    try {
      const ipfsHash = await this.uploadToIPFS(indexData);
      const ipns = await this.createOrUpdateIPNS(ipfsHash, this.masterIPNS);
      return ipns;
    } catch (error) {
      console.error('Error updating master index:', error);
      throw new Error(`Failed to update master index: ${error}`);
    }
  }

  /**
   * Get all hackathons from master index
   */
  async getAllHackathons(): Promise<Hackathon[]> {
    try {
      const masterIndex = await this.getMasterIndex();
      const hackathons: Hackathon[] = [];

      // Fetch each hackathon from its individual IPNS record
      for (const entry of masterIndex.hackathons) {
        if (entry.status === 'active') {
          try {
            const hackathon = await this.getHackathonById(entry.id);
            if (hackathon) {
              hackathons.push(hackathon);
            }
          } catch (error) {
            console.warn(`Failed to fetch hackathon ${entry.id}:`, error);
          }
        }
      }

      return hackathons;
    } catch (error) {
      console.error('Error getting all hackathons:', error);
      throw new Error(`Failed to get all hackathons: ${error}`);
    }
  }

  /**
   * Get hackathon by ID
   */
  async getHackathonById(hackathonId: string): Promise<Hackathon | null> {
    try {
      const masterIndex = await this.getMasterIndex();
      const entry = masterIndex.hackathons.find(h => h.id === hackathonId);

      if (!entry) {
        return null;
      }

      // Get all IPNS keys to find the hackathon's IPNS record
      const allKeys = await this.getAllIPNSKeys();
      const hackathonKey = allKeys.find(key => key.ipnsName === entry.ipnsRecord);

      if (!hackathonKey) {
        return null;
      }

      // Resolve the hackathon IPNS record to get the CID
      const hackathonCID = await this.resolveIPNSToCID(hackathonKey.ipnsId);

      // Download the hackathon data using the CID
      const hackathonData = await this.downloadFromIPFS(hackathonCID);

      return hackathonData;
    } catch (error) {
      console.error('Error getting hackathon by ID:', error);
      return null;
    }
  }

  /**
   * Get hackathon by slug
   */
  async getHackathonBySlug(slug: string): Promise<Hackathon | null> {
    try {
      const masterIndex = await this.getMasterIndex();
      const entry = masterIndex.hackathons.find(h => h.slug === slug);
      
      if (!entry) {
        return null;
      }

      return await this.getHackathonById(entry.id);
    } catch (error) {
      console.error('Error getting hackathon by slug:', error);
      return null;
    }
  }

  /**
   * Create new hackathon
   */
  async createHackathon(hackathon: Hackathon): Promise<string> {
    try {
      // Generate slug from title
      const slug = hackathon.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Upload hackathon data to IPFS
      const hackathonIpfsHash = await this.uploadToIPFS(hackathon);

      // Generate IPNS key for this hackathon
      const hackathonIPNSKey = await this.generateIPNSKey();
      
      // Publish hackathon data to IPNS using the generated key
      const publishResponse = await lighthouse.publishRecord(
        hackathonIpfsHash,
        hackathonIPNSKey.ipnsName,
        this.config.apiKey
      );

      // Get or create master index
      let masterIndex = await this.getMasterIndex();

      // Check if hackathon already exists
      const existingIndex = masterIndex.hackathons.findIndex(h => h.id === hackathon.id);
      if (existingIndex !== -1) {
        // Update existing entry
        masterIndex.hackathons[existingIndex] = {
          id: hackathon.id,
          title: hackathon.title,
          slug,
          ipnsRecord: hackathonIPNSKey.ipnsName,
          ipfsHash: hackathonIpfsHash,
          status: 'active',
          createdAt: masterIndex.hackathons[existingIndex].createdAt,
          updatedAt: Date.now()
        };
      } else {
        // Add new entry
        const newEntry: HackathonIndexEntry = {
          id: hackathon.id,
          title: hackathon.title,
          slug,
          ipnsRecord: hackathonIPNSKey.ipnsName,
          ipfsHash: hackathonIpfsHash,
          status: 'active',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        masterIndex.hackathons.push(newEntry);
      }

      // Update master index metadata
      masterIndex.metadata.lastUpdated = Date.now();
      masterIndex.metadata.totalCount = masterIndex.hackathons.filter(h => h.status === 'active').length;

      // Upload updated master index to IPFS
      const masterIpfsHash = await this.uploadToIPFS(masterIndex);

      // Get or create master IPNS key
      let masterIPNSKey;
      const allKeys = await this.getAllIPNSKeys();
      const existingMasterKey = allKeys.find(key => key.ipnsName === this.masterIPNS);

      if (existingMasterKey) {
        masterIPNSKey = existingMasterKey;
      } else {
        masterIPNSKey = await this.generateIPNSKey();
        // Update the master IPNS name to use the generated key
        this.masterIPNS = masterIPNSKey.ipnsName;
        console.log('Created new master IPNS key:', masterIPNSKey.ipnsId);
      }

      // Publish master index to IPNS
      const masterPublishResponse = await lighthouse.publishRecord(
        masterIpfsHash,
        this.masterIPNS,
        this.config.apiKey
      );

      console.log(`Hackathon created: ${hackathon.title} (${hackathon.id})`);
      console.log(`IPNS: ${hackathonIPNSKey.ipnsName} -> ${hackathonIpfsHash}`);
      console.log(`Master updated: ${this.masterIPNS} -> ${masterIpfsHash}`);

      return hackathon.id;
    } catch (error) {
      console.error('Error creating hackathon:', error);
      throw new Error(`Failed to create hackathon: ${error}`);
    }
  }

  /**
   * Update hackathon
   */
  async updateHackathon(hackathonId: string, updatedHackathon: Hackathon): Promise<void> {
    try {
      // Generate slug from title
      const slug = updatedHackathon.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Add updated timestamp
      const hackathonWithTimestamp = {
        ...updatedHackathon,
        slug,
        updatedAt: Date.now()
      };

      // Upload updated hackathon data to IPFS
      const hackathonIpfsHash = await this.uploadToIPFS(hackathonWithTimestamp);

      // Get current master index
      const masterIndex = await this.getMasterIndex();
      const entryIndex = masterIndex.hackathons.findIndex(h => h.id === hackathonId);

      if (entryIndex === -1) {
        throw new Error('Hackathon not found in master index');
      }

      const entry = masterIndex.hackathons[entryIndex];

      // Update individual IPNS record
      await this.createOrUpdateIPNS(hackathonIpfsHash, entry.ipnsRecord);

      // Update master index entry
      masterIndex.hackathons[entryIndex] = {
        ...entry,
        title: updatedHackathon.title,
        slug,
        ipfsHash: hackathonIpfsHash,
        updatedAt: Date.now()
      };

      // Update master index metadata
      masterIndex.metadata.lastUpdated = Date.now();

      // Upload updated master index to IPFS
      const masterIpfsHash = await this.uploadToIPFS(masterIndex);

      // Publish master index to IPNS
      await this.createOrUpdateIPNS(masterIpfsHash, this.masterIPNS);

      console.log(`Hackathon updated: ${updatedHackathon.title} (${hackathonId})`);
      console.log(`IPNS updated: ${entry.ipnsRecord} -> ${hackathonIpfsHash}`);
      console.log(`Master updated: ${this.masterIPNS} -> ${masterIpfsHash}`);
    } catch (error) {
      console.error('Error updating hackathon:', error);
      throw new Error(`Failed to update hackathon: ${error}`);
    }
  }

  /**
   * Delete hackathon
   */
  async deleteHackathon(hackathonId: string): Promise<void> {
    try {
      const masterIndex = await this.getMasterIndex();
      const entryIndex = masterIndex.hackathons.findIndex(h => h.id === hackathonId);

      if (entryIndex === -1) {
        throw new Error('Hackathon not found in master index');
      }

      const entry = masterIndex.hackathons[entryIndex];
      const originalStatus = entry.status;

      // Mark as archived instead of deleting
      masterIndex.hackathons[entryIndex].status = 'archived';
      masterIndex.hackathons[entryIndex].updatedAt = Date.now();

      // Update master index metadata
      masterIndex.metadata.lastUpdated = Date.now();
      masterIndex.metadata.totalCount = masterIndex.hackathons.filter(h => h.status === 'active').length;

      // Upload updated master index to IPFS
      const masterIpfsHash = await this.uploadToIPFS(masterIndex);

      // Publish master index to IPNS
      await this.createOrUpdateIPNS(masterIpfsHash, this.masterIPNS);

      console.log(`Hackathon ${originalStatus === 'archived' ? 'permanently deleted' : 'archived'}: ${entry.title} (${hackathonId})`);
      console.log(`Master updated: ${this.masterIPNS} -> ${masterIpfsHash}`);
      console.log(`Status changed: ${originalStatus} -> archived`);
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      throw new Error(`Failed to delete hackathon: ${error}`);
    }
  }

  /**
   * Get master IPNS record name
   */
  getMasterIPNS(): string {
    return this.masterIPNS;
  }

  /**
   * Get individual hackathon IPNS name
   */
  getHackathonIPNS(hackathonId: string): string {
    return `hackathon-${hackathonId}`;
  }
}

// Singleton instance
let masterIPNSService: MasterIPNSStorageService | null = null;

export function getMasterIPNSService(): MasterIPNSStorageService {
  if (!masterIPNSService) {
    // Try multiple environment variable names
    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY ||
                   process.env.LIGHTHOUSE_KEY ||
                   process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY || '';

    const privateKey = process.env.LIGHTHOUSE_PRIVATE_KEY || '';

    console.log('🔑 Environment check:', {
      'NEXT_PUBLIC_LIGHTHOUSE_API_KEY': !!process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      'LIGHTHOUSE_KEY': !!process.env.LIGHTHOUSE_KEY,
      'LIGHTHOUSE_PRIVATE_KEY': !!process.env.LIGHTHOUSE_PRIVATE_KEY,
      'NODE_ENV': process.env.NODE_ENV
    });

    const config: LighthouseConfig = {
      apiKey,
      privateKey
    };

    console.log('🔑 Lighthouse config:', {
      hasApiKey: !!config.apiKey,
      hasPrivateKey: !!config.privateKey,
      apiKeyLength: config.apiKey ? config.apiKey.length : 0
    });

    if (!config.apiKey) {
      throw new Error('Lighthouse API key must be set in environment variables');
    }
    
    // For Lighthouse, we can use the API key as the private key if no separate private key is provided
    if (!config.privateKey) {
      config.privateKey = config.apiKey;
    }

    masterIPNSService = new MasterIPNSStorageService(config);
    console.log('✅ Master IPNS Service initialized successfully');
  }

  return masterIPNSService;
}
