import { getMasterIPNSService } from './master-ipns-storage';

/**
 * Utility functions for IPNS debugging and testing
 */
export class IPNSUtils {
  private service = getMasterIPNSService();

  /**
   * Initialize the master IPNS system
   */
  async initializeMasterIndex(): Promise<{ success: boolean; message: string }> {
    try {
      const masterIndex = await this.service.getMasterIndex();

      if (masterIndex.hackathons.length === 0) {
        // Create initial master index if it doesn't exist
        await this.service.updateMasterIndex(masterIndex);
        return {
          success: true,
          message: 'Master IPNS index initialized successfully'
        };
      }

      return {
        success: true,
        message: `Master IPNS index already exists with ${masterIndex.hackathons.length} hackathons`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to initialize master IPNS index: ${error}`
      };
    }
  }

  /**
   * Get IPNS system status
   */
  async getSystemStatus(): Promise<{
    success: boolean;
    data: {
      totalKeys: number;
      masterIndexExists: boolean;
      totalHackathons: number;
      masterIPNS: string;
      keys: any[];
    };
  }> {
    try {
      const keys = await this.service.getAllIPNSKeys();
      const masterIndex = await this.service.getMasterIndex();
      const masterKey = keys.find(key => key.ipnsName === this.service.getMasterIPNS());

      return {
        success: true,
        data: {
          totalKeys: keys.length,
          masterIndexExists: !!masterKey,
          totalHackathons: masterIndex.hackathons.length,
          masterIPNS: this.service.getMasterIPNS(),
          keys: keys.map(key => ({
            name: key.ipnsName,
            id: key.ipnsId,
            isMaster: key.ipnsName === this.service.getMasterIPNS()
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        data: {
          totalKeys: 0,
          masterIndexExists: false,
          totalHackathons: 0,
          masterIPNS: '',
          keys: []
        }
      };
    }
  }

  /**
   * Test IPNS resolution
   */
  async testIPNSResolution(ipnsId: string): Promise<{
    success: boolean;
    data?: { cid: string };
    error?: string;
  }> {
    try {
      const cid = await this.service.resolveIPNSToCID(ipnsId);
      return {
        success: true,
        data: { cid }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to resolve IPNS ${ipnsId}: ${error}`
      };
    }
  }

  /**
   * Validate master IPNS system integrity
   */
  async validateSystemIntegrity(): Promise<{
    success: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check if we have any IPNS keys
      const keys = await this.service.getAllIPNSKeys();
      if (keys.length === 0) {
        issues.push('No IPNS keys found');
        recommendations.push('Initialize the IPNS system by creating the first hackathon');
      }

      // Check if master key exists
      const masterKey = keys.find(key => key.ipnsName === this.service.getMasterIPNS());
      if (!masterKey) {
        issues.push('Master IPNS key not found');
        recommendations.push('Create a hackathon to initialize the master IPNS index');
      }

      // Check master index integrity
      try {
        const masterIndex = await this.service.getMasterIndex();
        if (!masterIndex.hackathons) {
          issues.push('Master index structure is invalid');
          recommendations.push('Reinitialize master index');
        }

        // Check if all hackathon entries have valid IPNS records
        for (const entry of masterIndex.hackathons) {
          const hackathonKey = keys.find(key => key.ipnsName === entry.ipnsRecord);
          if (!hackathonKey) {
            issues.push(`IPNS key not found for hackathon: ${entry.title} (${entry.id})`);
          }
        }
      } catch (indexError) {
        issues.push(`Failed to read master index: ${indexError}`);
        recommendations.push('Check Lighthouse API configuration and connectivity');
      }

      return {
        success: issues.length === 0,
        issues,
        recommendations
      };
    } catch (error) {
      return {
        success: false,
        issues: [`System validation failed: ${error}`],
        recommendations: ['Check Lighthouse API configuration and network connectivity']
      };
    }
  }

  /**
   * Clean up orphaned IPNS records
   */
  async cleanupOrphanedRecords(): Promise<{
    success: boolean;
    cleaned: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let cleaned = 0;

    try {
      const keys = await this.service.getAllIPNSKeys();
      const masterIndex = await this.service.getMasterIndex();

      // Find IPNS keys that are not referenced in master index
      const referencedIPNS = new Set(
        masterIndex.hackathons.map(h => h.ipnsRecord)
      );

      const orphanedKeys = keys.filter(key =>
        key.ipnsName !== this.service.getMasterIPNS() &&
        !referencedIPNS.has(key.ipnsName)
      );

      // Note: Actual cleanup would require API calls to remove keys
      // For now, just report what would be cleaned
      cleaned = orphanedKeys.length;

      return {
        success: true,
        cleaned,
        errors
      };
    } catch (error) {
      return {
        success: false,
        cleaned: 0,
        errors: [`Cleanup failed: ${error}`]
      };
    }
  }

  /**
   * Generate test data for development
   */
  async generateTestData(): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      const testHackathon = {
        id: `test-${Date.now()}`,
        title: 'Test Hackathon for IPNS',
        description: 'This is a test hackathon created to validate IPNS functionality',
        status: 'live' as const,
        registrationClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        registrationDaysLeft: 30,
        techStack: 'React, TypeScript, IPFS, IPNS',
        level: 'All levels',
        totalPrize: 5000,
        location: 'Online',
        tags: ['Test', 'IPNS', 'Web3'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const createdId = await this.service.createHackathon(testHackathon);

      return {
        success: true,
        message: 'Test hackathon created successfully',
        data: {
          id: createdId,
          title: testHackathon.title
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create test data: ${error}`
      };
    }
  }
}

// Export singleton instance
export const ipnsUtils = new IPNSUtils();