import { lighthouse } from '@lighthouse-web3/sdk';
import { Hackathon } from '../app/types';

export interface LighthouseConfig {
  apiKey: string;
  privateKey: string;
}

export interface IPNSRecord {
  ipns: string;
  ipfsHash: string;
  timestamp: number;
}

export interface HackathonStorageData {
  hackathons: Hackathon[];
  metadata: {
    lastUpdated: number;
    version: string;
  };
}

export class LighthouseStorageService {
  private config: LighthouseConfig;
  private ipnsRecords: Map<string, IPNSRecord> = new Map();

  constructor(config: LighthouseConfig) {
    this.config = config;
  }

  /**
   * Upload hackathon data to IPFS and get IPFS hash
   */
  async uploadHackathonData(data: HackathonStorageData): Promise<string> {
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
   * Download hackathon data from IPFS hash
   */
  async downloadHackathonData(ipfsHash: string): Promise<HackathonStorageData> {
    try {
      const response = await lighthouse.getFile(ipfsHash);
      return JSON.parse(response.data);
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
      const response = await lighthouse.publishRecord(
        this.config.privateKey,
        ipfsHash,
        ipnsName
      );
      
      if (response.data && response.data.Name) {
        const ipns = response.data.Name;
        this.ipnsRecords.set(ipns, {
          ipns,
          ipfsHash,
          timestamp: Date.now()
        });
        return ipns;
      }
      throw new Error('Failed to get IPNS from publish response');
    } catch (error) {
      console.error('Error publishing IPNS record:', error);
      throw new Error(`Failed to publish IPNS record: ${error}`);
    }
  }

  /**
   * Resolve IPNS to get current IPFS hash
   */
  async resolveIPNS(ipns: string): Promise<string> {
    try {
      const response = await lighthouse.resolveName(ipns);
      return response.data;
    } catch (error) {
      console.error('Error resolving IPNS:', error);
      throw new Error(`Failed to resolve IPNS: ${error}`);
    }
  }

  /**
   * Get all hackathons from IPNS
   */
  async getAllHackathons(ipns?: string): Promise<Hackathon[]> {
    try {
      if (ipns) {
        const ipfsHash = await this.resolveIPNS(ipns);
        const data = await this.downloadHackathonData(ipfsHash);
        return data.hackathons;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting all hackathons:', error);
      throw new Error(`Failed to get hackathons: ${error}`);
    }
  }

  /**
   * Get specific hackathon by ID
   */
  async getHackathonById(ipns: string, hackathonId: string): Promise<Hackathon | null> {
    try {
      const hackathons = await this.getAllHackathons(ipns);
      return hackathons.find(h => h.id === hackathonId) || null;
    } catch (error) {
      console.error('Error getting hackathon by ID:', error);
      throw new Error(`Failed to get hackathon: ${error}`);
    }
  }

  /**
   * Get hackathon by slug
   */
  async getHackathonBySlug(slug: string): Promise<Hackathon | null> {
    try {
      // For now, return null - this will be handled by the API routes
      return null;
    } catch (error) {
      console.error('Error getting hackathon by slug:', error);
      throw new Error(`Failed to get hackathon: ${error}`);
    }
  }

  /**
   * Create new hackathon
   */
  async createHackathon(ipns: string, hackathon: Hackathon): Promise<string> {
    try {
      // Get current data
      let currentData: HackathonStorageData;
      try {
        const ipfsHash = await this.resolveIPNS(ipns);
        currentData = await this.downloadHackathonData(ipfsHash);
      } catch {
        // If IPNS doesn't exist or is empty, create new data structure
        currentData = {
          hackathons: [],
          metadata: {
            lastUpdated: Date.now(),
            version: '1.0.0'
          }
        };
      }

      // Add new hackathon
      currentData.hackathons.push(hackathon);
      currentData.metadata.lastUpdated = Date.now();

      // Upload updated data
      const newIpfsHash = await this.uploadHackathonData(currentData);
      
      // Update IPNS
      await this.createOrUpdateIPNS(newIpfsHash, ipns);
      
      return hackathon.id;
    } catch (error) {
      console.error('Error creating hackathon:', error);
      throw new Error(`Failed to create hackathon: ${error}`);
    }
  }

  /**
   * Update existing hackathon
   */
  async updateHackathon(ipns: string, hackathonId: string, updatedHackathon: Hackathon): Promise<void> {
    try {
      const ipfsHash = await this.resolveIPNS(ipns);
      const currentData = await this.downloadHackathonData(ipfsHash);
      
      const index = currentData.hackathons.findIndex(h => h.id === hackathonId);
      if (index === -1) {
        throw new Error('Hackathon not found');
      }

      // Update hackathon
      currentData.hackathons[index] = updatedHackathon;
      currentData.metadata.lastUpdated = Date.now();

      // Upload updated data
      const newIpfsHash = await this.uploadHackathonData(currentData);
      
      // Update IPNS
      await this.createOrUpdateIPNS(newIpfsHash, ipns);
    } catch (error) {
      console.error('Error updating hackathon:', error);
      throw new Error(`Failed to update hackathon: ${error}`);
    }
  }

  /**
   * Delete hackathon
   */
  async deleteHackathon(ipns: string, hackathonId: string): Promise<void> {
    try {
      const ipfsHash = await this.resolveIPNS(ipns);
      const currentData = await this.downloadHackathonData(ipfsHash);
      
      const index = currentData.hackathons.findIndex(h => h.id === hackathonId);
      if (index === -1) {
        throw new Error('Hackathon not found');
      }

      // Remove hackathon
      currentData.hackathons.splice(index, 1);
      currentData.metadata.lastUpdated = Date.now();

      // Upload updated data
      const newIpfsHash = await this.uploadHackathonData(currentData);
      
      // Update IPNS
      await this.createOrUpdateIPNS(newIpfsHash, ipns);
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      throw new Error(`Failed to delete hackathon: ${error}`);
    }
  }

  /**
   * Get IPNS records for management
   */
  getIPNSRecords(): IPNSRecord[] {
    return Array.from(this.ipnsRecords.values());
  }

  /**
   * Clear local IPNS records cache
   */
  clearIPNSCache(): void {
    this.ipnsRecords.clear();
  }

}

// Singleton instance
let lighthouseService: LighthouseStorageService | null = null;

export function getLighthouseService(): LighthouseStorageService {
  if (!lighthouseService) {
    const config: LighthouseConfig = {
      apiKey: process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || '',
      privateKey: process.env.LIGHTHOUSE_PRIVATE_KEY || ''
    };
    
    if (!config.apiKey || !config.privateKey) {
      throw new Error('Lighthouse API key and private key must be set in environment variables');
    }
    
    lighthouseService = new LighthouseStorageService(config);
  }
  
  return lighthouseService;
}

// Utility functions for easy usage
export async function initializeHackathonStorage(): Promise<string> {
  const service = getLighthouseService();
  const initialData: HackathonStorageData = {
    hackathons: [],
    metadata: {
      lastUpdated: Date.now(),
      version: '1.0.0'
    }
  };
  
  const ipfsHash = await service.uploadHackathonData(initialData);
  const ipns = await service.createOrUpdateIPNS(ipfsHash);
  
  return ipns;
}
