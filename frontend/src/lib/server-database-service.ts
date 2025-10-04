import { getDatabase } from './db-connection';
import { 
  hackathonReferencesTable, 
  hackathonMetadataTable, 
  ipnsRecordsTable 
} from '../db/schema';
import { Hackathon } from '../app/types';
import { eq, and, desc } from 'drizzle-orm';

export interface HackathonReference {
  id: number;
  hackathonId: string;
  title: string;
  slug: string;
  ipnsRecord?: string;
  ipfsHash: string;
  previousIpfsHash?: string;
  status: 'active' | 'archived' | 'deleted';
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt?: Date;
  isPublished: boolean;
}

export interface HackathonMetadata {
  id: number;
  hackathonId: string;
  title: string;
  description?: string;
  status: string;
  registrationClose?: Date;
  registrationDaysLeft?: number;
  techStack?: string;
  level?: string;
  totalPrize?: number;
  location?: string;
  image?: string;
  subtitle?: string;
  tags?: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export class ServerDatabaseService {
  private db: ReturnType<typeof getDatabase>;

  constructor() {
    this.db = getDatabase();
  }

  // Hackathon Reference Operations
  async createHackathonReference(
    hackathonId: string,
    title: string,
    slug: string,
    ipfsHash: string,
    createdBy?: number,
    ipnsRecord?: string
  ): Promise<HackathonReference> {
    const [reference] = await this.db
      .insert(hackathonReferencesTable)
      .values({
        hackathonId,
        title,
        slug,
        ipfsHash,
        createdBy,
        ipnsRecord,
        status: 'active',
        isPublished: false
      })
      .returning();
    
    return reference;
  }

  async getHackathonReference(hackathonId: string): Promise<HackathonReference | null> {
    const [reference] = await this.db
      .select()
      .from(hackathonReferencesTable)
      .where(eq(hackathonReferencesTable.hackathonId, hackathonId))
      .limit(1);
    
    return reference || null;
  }

  async getHackathonReferenceBySlug(slug: string): Promise<HackathonReference | null> {
    const [reference] = await this.db
      .select()
      .from(hackathonReferencesTable)
      .where(eq(hackathonReferencesTable.slug, slug))
      .limit(1);
    
    return reference || null;
  }

  async updateHackathonReference(
    hackathonId: string,
    updates: Partial<Pick<HackathonReference, 'ipfsHash' | 'previousIpfsHash' | 'isPublished' | 'lastSyncedAt'>>
  ): Promise<void> {
    await this.db
      .update(hackathonReferencesTable)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(hackathonReferencesTable.hackathonId, hackathonId));
  }

  async deleteHackathonReference(hackathonId: string): Promise<void> {
    await this.db
      .update(hackathonReferencesTable)
      .set({
        status: 'deleted',
        updatedAt: new Date()
      })
      .where(eq(hackathonReferencesTable.hackathonId, hackathonId));
  }

  async getAllHackathonReferences(): Promise<HackathonReference[]> {
    return await this.db
      .select()
      .from(hackathonReferencesTable)
      .where(eq(hackathonReferencesTable.status, 'active'))
      .orderBy(desc(hackathonReferencesTable.createdAt));
  }

  // Hackathon Metadata Operations
  async createHackathonMetadata(hackathon: Hackathon): Promise<HackathonMetadata> {
    const [metadata] = await this.db
      .insert(hackathonMetadataTable)
      .values({
        hackathonId: hackathon.id,
        title: hackathon.title,
        description: hackathon.description,
        status: hackathon.status,
        registrationClose: hackathon.registrationClose ? new Date(hackathon.registrationClose) : null,
        registrationDaysLeft: hackathon.registrationDaysLeft,
        techStack: hackathon.techStack,
        level: hackathon.level,
        totalPrize: hackathon.totalPrize,
        location: hackathon.location,
        image: hackathon.image,
        subtitle: hackathon.subtitle,
        tags: hackathon.tags ? JSON.stringify(hackathon.tags) : null
      })
      .returning();
    
    return metadata;
  }

  async updateHackathonMetadata(hackathonId: string, hackathon: Hackathon): Promise<void> {
    await this.db
      .update(hackathonMetadataTable)
      .set({
        title: hackathon.title,
        description: hackathon.description,
        status: hackathon.status,
        registrationClose: hackathon.registrationClose ? new Date(hackathon.registrationClose) : null,
        registrationDaysLeft: hackathon.registrationDaysLeft,
        techStack: hackathon.techStack,
        level: hackathon.level,
        totalPrize: hackathon.totalPrize,
        location: hackathon.location,
        image: hackathon.image,
        subtitle: hackathon.subtitle,
        tags: hackathon.tags ? JSON.stringify(hackathon.tags) : null,
        updatedAt: new Date()
      })
      .where(eq(hackathonMetadataTable.hackathonId, hackathonId));
  }

  async deleteHackathonMetadata(hackathonId: string): Promise<void> {
    await this.db
      .delete(hackathonMetadataTable)
      .where(eq(hackathonMetadataTable.hackathonId, hackathonId));
  }

  async getHackathonMetadata(hackathonId: string): Promise<HackathonMetadata | null> {
    const [metadata] = await this.db
      .select()
      .from(hackathonMetadataTable)
      .where(eq(hackathonMetadataTable.hackathonId, hackathonId))
      .limit(1);
    
    return metadata || null;
  }

  async getAllHackathonMetadata(): Promise<HackathonMetadata[]> {
    return await this.db
      .select()
      .from(hackathonMetadataTable)
      .orderBy(desc(hackathonMetadataTable.createdAt));
  }

  // Utility Methods
  async getHackathonBySlug(slug: string): Promise<{ reference: HackathonReference; metadata: HackathonMetadata } | null> {
    const reference = await this.getHackathonReferenceBySlug(slug);
    if (!reference) return null;

    const metadata = await this.getHackathonMetadata(reference.hackathonId);
    if (!metadata) return null;

    return { reference, metadata };
  }

  async getAllHackathonsWithReferences(): Promise<Array<{ reference: HackathonReference; metadata: HackathonMetadata }>> {
    const references = await this.getAllHackathonReferences();
    const results = [];

    for (const reference of references) {
      const metadata = await this.getHackathonMetadata(reference.hackathonId);
      if (metadata) {
        results.push({ reference, metadata });
      }
    }

    return results;
  }

  // Convert metadata to Hackathon object
  metadataToHackathon(metadata: HackathonMetadata): Hackathon {
    return {
      id: metadata.hackathonId,
      title: metadata.title,
      description: metadata.description || '',
      status: metadata.status as 'live' | 'voting' | 'ended',
      registrationClose: metadata.registrationClose?.toISOString() || '',
      registrationDaysLeft: metadata.registrationDaysLeft || 0,
      techStack: metadata.techStack || '',
      level: metadata.level || '',
      totalPrize: metadata.totalPrize || 0,
      location: metadata.location || '',
      image: metadata.image,
      subtitle: metadata.subtitle,
      tags: metadata.tags ? JSON.parse(metadata.tags) : []
    };
  }
}

// Singleton instance
let serverDatabaseService: ServerDatabaseService | null = null;

export function getServerDatabaseService(): ServerDatabaseService {
  if (!serverDatabaseService) {
    serverDatabaseService = new ServerDatabaseService();
  }
  return serverDatabaseService;
}
