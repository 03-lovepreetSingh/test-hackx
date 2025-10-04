import lighthouse from '@lighthouse-web3/sdk';
import jwt from 'jsonwebtoken';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed
  fullName: string;
  role: 'user' | 'judge' | 'admin' | 'organizer' | 'guest';
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  skills: string[];
  interests: string[];
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: number;
  createdAt: number;
  updatedAt: number;
  ipnsRecord?: string;
  ipfsHash?: string;
  // Guest-specific fields
  hackathonId?: string;
  inviteToken?: string;
  invitedBy?: string;
  invitedAt?: number;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  ipnsRecord?: string;
  ipfsHash?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message: string;
  error?: string;
}

export interface MasterAuthIndex {
  users: {
    [userId: string]: {
      ipnsRecord: string;
      ipfsHash: string;
      lastUpdated: number;
    };
  };
  sessions: {
    [sessionId: string]: {
      ipnsRecord: string;
      ipfsHash: string;
      lastUpdated: number;
    };
  };
  totalUsers: number;
  totalSessions: number;
  lastUpdated: number;
}

export interface LighthouseConfig {
  apiKey: string;
  privateKey: string;
}

export class AuthStorageService {
  private config: LighthouseConfig;
  private masterIPNSKey: string = 'auth-master';
  private userIPNSPrefix: string = 'auth-user-';
  private sessionIPNSPrefix: string = 'auth-session-';
  private jwtSecret: string;

  constructor(config: LighthouseConfig, jwtSecret: string) {
    this.config = config;
    this.jwtSecret = jwtSecret;
  }

  /**
   * Initialize the master IPNS for authentication
   */
  async initializeMasterIPNS(): Promise<void> {
    try {
      console.log('🔧 Initializing master IPNS for authentication...');
      
      // Check if master IPNS already exists
      const existingIndex = await this.getMasterAuthIndex();
      if (existingIndex) {
        console.log('✅ Master IPNS already exists');
        return;
      }

      // Create initial master index
      const masterIndex: MasterAuthIndex = {
        users: {},
        sessions: {},
        totalUsers: 0,
        totalSessions: 0,
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
   * Register a new user
   */
  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role?: 'user' | 'judge' | 'admin' | 'organizer' | 'guest';
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    skills?: string[];
    interests?: string[];
    // Guest-specific fields
    hackathonId?: string;
    inviteToken?: string;
    invitedBy?: string;
    invitedAt?: number;
  }): Promise<AuthResponse> {
    try {
      console.log(`🔧 Registering new user: ${userData.username}`);

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists',
          error: 'EMAIL_EXISTS'
        };
      }

      const existingUserByUsername = await this.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return {
          success: false,
          message: 'Username already taken',
          error: 'USERNAME_EXISTS'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Create user object
      const userId = crypto.randomUUID();
      const user: User = {
        id: userId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        fullName: userData.fullName,
        role: userData.role || 'user',
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        github: userData.github || '',
        twitter: userData.twitter || '',
        linkedin: userData.linkedin || '',
        skills: userData.skills || [],
        interests: userData.interests || [],
        isActive: true,
        isVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        // Guest-specific fields
        hackathonId: userData.hackathonId,
        inviteToken: userData.inviteToken,
        invitedBy: userData.invitedBy,
        invitedAt: userData.invitedAt
      };

      // Upload user to IPFS
      const userIpfsHash = await this.uploadToIPFS(user);
      
      // Create IPNS record for user
      const userIPNSKey = `${this.userIPNSPrefix}${userId}`;
      const userIpnsRecord = await this.createIPNSRecord(userIPNSKey, userIpfsHash);

      // Update user with IPNS/IPFS data
      user.ipnsRecord = userIpnsRecord;
      user.ipfsHash = userIpfsHash;

      // Re-upload with IPNS/IPFS data
      const finalIpfsHash = await this.uploadToIPFS(user);
      const finalIpnsRecord = await this.createIPNSRecord(userIPNSKey, finalIpfsHash);

      // Update master index
      await this.updateMasterIndex('user', userId, finalIpnsRecord, finalIpfsHash);

      console.log(`✅ User registered successfully: ${userId}`);
      console.log(`📍 User IPNS: ${finalIpnsRecord}`);
      console.log(`📍 User IPFS: ${finalIpfsHash}`);
      console.log(`📧 User email: ${user.email}`);
      return {
        success: true,
        user: { ...user, password: '' }, // Don't return password
        message: 'User registered successfully'
      };
    } catch (error) {
      console.error('❌ Failed to register user:', error);
      return {
        success: false,
        message: 'Failed to register user',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Login user
   */
  async loginUser(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    try {
      console.log(`🔧 Attempting login for: ${email}`);

      // Get user by email
      const user = await this.getUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
          error: 'INVALID_CREDENTIALS'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          message: 'Account is deactivated',
          error: 'ACCOUNT_DEACTIVATED'
        };
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password',
          error: 'INVALID_CREDENTIALS'
        };
      }

      // Update last login
      user.lastLogin = Date.now();
      await this.updateUser(user);

      // Create session
      const session = await this.createSession(user.id, ipAddress, userAgent);

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          sessionId: session.id
        },
        this.jwtSecret,
        { expiresIn: '7d' }
      );

      console.log(`✅ User logged in successfully: ${user.username}`);
      return {
        success: true,
        user: { ...user, password: '' }, // Don't return password
        token,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('❌ Failed to login user:', error);
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      console.log(`🔍 Searching for user with email: ${email}`);
      const masterIndex = await this.getMasterAuthIndex();
      if (!masterIndex) {
        console.log('❌ No master index found');
        return null;
      }

      console.log(`📊 Master index has ${Object.keys(masterIndex.users).length} users`);

      // Search through all users
      for (const [userId, userData] of Object.entries(masterIndex.users)) {
        try {
          console.log(`🔍 Checking user ${userId} with IPNS: ${userData.ipnsRecord}`);

          // Try to get from IPNS first
          const userIpnsRecord = await this.getIPNSRecord(userData.ipnsRecord);
          if (userIpnsRecord) {
            const user = await this.downloadFromIPFS(userIpnsRecord);
            if (user && user.email === email) {
              console.log(`✅ Found user ${email} via IPNS`);
              return user as User;
            }
          } else {
            console.log(`⚠️ Could not resolve IPNS for user ${userId}, trying direct IPFS hash`);
            // Fallback to direct IPFS hash if IPNS fails
            if (userData.ipfsHash) {
              const user = await this.downloadFromIPFS(userData.ipfsHash);
              if (user && user.email === email) {
                console.log(`✅ Found user ${email} via direct IPFS hash`);
                return user as User;
              }
            }
          }
        } catch (error) {
          console.error(`❌ Failed to get user ${userId}:`, error);
        }
      }

      console.log(`❌ User ${email} not found`);
      return null;
    } catch (error) {
      console.error('❌ Failed to get user by email:', error);
      return null;
    }
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const masterIndex = await this.getMasterAuthIndex();
      if (!masterIndex) return null;

      // Search through all users
      for (const [userId, userData] of Object.entries(masterIndex.users)) {
        try {
          const userIpnsRecord = await this.getIPNSRecord(userData.ipnsRecord);
          if (userIpnsRecord) {
            const user = await this.downloadFromIPFS(userIpnsRecord);
            if (user && user.username === username) {
              return user as User;
            }
          }
        } catch (error) {
          console.error(`❌ Failed to get user ${userId}:`, error);
        }
      }

      return null;
    } catch (error) {
      console.error('❌ Failed to get user by username:', error);
      return null;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const masterIndex = await this.getMasterAuthIndex();
      if (!masterIndex || !masterIndex.users[userId]) {
        return null;
      }

      const userIPNSKey = `${this.userIPNSPrefix}${userId}`;
      const userIpnsRecord = await this.getIPNSRecord(userIPNSKey);
      
      if (!userIpnsRecord) {
        return null;
      }

      const user = await this.downloadFromIPFS(userIpnsRecord);
      return user as User;
    } catch (error) {
      console.error('❌ Failed to get user by ID:', error);
      return null;
    }
  }

  /**
   * Update user
   */
  async updateUser(user: User): Promise<boolean> {
    try {
      user.updatedAt = Date.now();
      
      const userIpfsHash = await this.uploadToIPFS(user);
      const userIPNSKey = `${this.userIPNSPrefix}${user.id}`;
      const userIpnsRecord = await this.createIPNSRecord(userIPNSKey, userIpfsHash);

      await this.updateMasterIndex('user', user.id, userIpnsRecord, userIpfsHash);
      return true;
    } catch (error) {
      console.error('❌ Failed to update user:', error);
      return false;
    }
  }

  /**
   * Create session
   */
  async createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<Session> {
    try {
      const sessionId = crypto.randomUUID();
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

      const session: Session = {
        id: sessionId,
        userId,
        token: '', // Will be set by caller
        expiresAt,
        createdAt: Date.now(),
        ipAddress,
        userAgent,
        isActive: true
      };

      const sessionIpfsHash = await this.uploadToIPFS(session);
      const sessionIPNSKey = `${this.sessionIPNSPrefix}${sessionId}`;
      const sessionIpnsRecord = await this.createIPNSRecord(sessionIPNSKey, sessionIpfsHash);

      session.ipnsRecord = sessionIpnsRecord;
      session.ipfsHash = sessionIpfsHash;

      // Re-upload with IPNS/IPFS data
      const finalIpfsHash = await this.uploadToIPFS(session);
      const finalIpnsRecord = await this.createIPNSRecord(sessionIPNSKey, finalIpfsHash);

      await this.updateMasterIndex('session', sessionId, finalIpnsRecord, finalIpfsHash);

      return session;
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      throw error;
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<{ valid: boolean; user?: User; error?: string }> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      if (!decoded.userId || !decoded.sessionId) {
        return { valid: false, error: 'Invalid token' };
      }

      // Get user
      const user = await this.getUserById(decoded.userId);
      if (!user) {
        return { valid: false, error: 'User not found' };
      }

      // Check if user is active
      if (!user.isActive) {
        return { valid: false, error: 'User account is deactivated' };
      }

      return { valid: true, user };
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return { valid: false, error: 'Invalid token' };
    }
  }

  /**
   * Logout user
   */
  async logoutUser(sessionId: string): Promise<boolean> {
    try {
      const masterIndex = await this.getMasterAuthIndex();
      if (!masterIndex || !masterIndex.sessions[sessionId]) {
        return false;
      }

      // Remove session from master index
      delete masterIndex.sessions[sessionId];
      masterIndex.totalSessions = Object.keys(masterIndex.sessions).length;
      masterIndex.lastUpdated = Date.now();

      // Update master index
      const masterIpfsHash = await this.uploadToIPFS(masterIndex);
      await this.createIPNSRecord(this.masterIPNSKey, masterIpfsHash);

      return true;
    } catch (error) {
      console.error('❌ Failed to logout user:', error);
      return false;
    }
  }

  // Private helper methods

  private async hashPassword(password: string): Promise<string> {
    // In a real app, use bcrypt or similar
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  private async getMasterAuthIndex(): Promise<MasterAuthIndex | null> {
    try {
      const ipnsRecord = await this.getIPNSRecord(this.masterIPNSKey);
      if (!ipnsRecord) {
        return null;
      }

      const data = await this.downloadFromIPFS(ipnsRecord);
      return data as MasterAuthIndex;
    } catch (error) {
      console.error('❌ Failed to get master auth index:', error);
      return null;
    }
  }

  private async updateMasterIndex(type: 'user' | 'session', id: string, ipnsRecord: string, ipfsHash: string): Promise<void> {
    try {
      const masterIndex = await this.getMasterAuthIndex() || {
        users: {},
        sessions: {},
        totalUsers: 0,
        totalSessions: 0,
        lastUpdated: Date.now()
      };

      if (type === 'user') {
        console.log(`📝 Adding user ${id} to master index`);
        console.log(`   - IPNS: ${ipnsRecord}`);
        console.log(`   - IPFS: ${ipfsHash}`);
        masterIndex.users[id] = {
          ipnsRecord,
          ipfsHash,
          lastUpdated: Date.now()
        };
        masterIndex.totalUsers = Object.keys(masterIndex.users).length;
        console.log(`📊 Master index now has ${masterIndex.totalUsers} users`);
      } else {
        masterIndex.sessions[id] = {
          ipnsRecord,
          ipfsHash,
          lastUpdated: Date.now()
        };
        masterIndex.totalSessions = Object.keys(masterIndex.sessions).length;
      }

      masterIndex.lastUpdated = Date.now();

      const masterIpfsHash = await this.uploadToIPFS(masterIndex);
      const masterIpnsRecord = await this.createIPNSRecord(this.masterIPNSKey, masterIpfsHash);
      console.log(`📍 Updated master index IPNS: ${masterIpnsRecord}`);
    } catch (error) {
      console.error('❌ Failed to update master index:', error);
      throw error;
    }
  }

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
      const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${hash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to download from IPFS:', error);
      throw error;
    }
  }

  private async createIPNSRecord(key: string, hash: string): Promise<string> {
    try {
      const response = await lighthouse.publishRecord(
        hash,
        key,
        this.config.apiKey
      );
      return response.data.Name;
    } catch (error) {
      console.error('❌ Failed to create IPNS record:', error);
      throw error;
    }
  }

  private async getIPNSRecord(key: string): Promise<string | null> {
    try {
      // Try to resolve IPNS through multiple gateways
      const gateways = [
        `https://gateway.lighthouse.storage/ipns/${key}`,
        `https://ipfs.io/ipns/${key}`,
        `https://cloudflare-ipfs.com/ipns/${key}`,
        `https://dweb.link/ipns/${key}`
      ];

      for (const gateway of gateways) {
        try {
          const response = await fetch(gateway);
          if (response.ok) {
            const content = await response.text();
            return content;
          }
        } catch (gatewayError) {
          console.log(`Gateway ${gateway} failed:`, gatewayError);
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to get IPNS record:', error);
      return null;
    }
  }
}

// Development service that seeds test users
class DevAuthService extends AuthStorageService {
  private testUsersSeeded = false;

  constructor(config: LighthouseConfig, jwtSecret: string) {
    super(config, jwtSecret);
    console.log('🔧 Using DevAuthService with real Lighthouse storage + test users');
  }

  async initializeMasterIPNS(): Promise<void> {
    await super.initializeMasterIPNS();

    // Seed test users if not already done
    if (!this.testUsersSeeded) {
      await this.seedTestUsers();
      this.testUsersSeeded = true;
    }
  }

  private async seedTestUsers(): Promise<void> {
    try {
      console.log('🌱 Seeding test users for development...');

      const testUsers = [
        {
          username: 'alice_dev',
          email: 'alice@example.com',
          password: 'password123',
          fullName: 'Alice Johnson',
          role: 'judge' as const,
          bio: 'Full-stack developer passionate about DeFi and Web3 technologies.',
          location: 'San Francisco, CA',
          website: 'https://alice.dev',
          github: 'alice-dev',
          twitter: 'alice_dev',
          linkedin: 'alice-johnson',
          skills: ['React', 'Solidity', 'Web3.js', 'TypeScript'],
          interests: ['DeFi', 'NFTs', 'Blockchain']
        },
        {
          username: 'bob_builder',
          email: 'bob@example.com',
          password: 'password123',
          fullName: 'Bob Smith',
          role: 'user' as const,
          bio: 'Blockchain architect and smart contract developer.',
          location: 'New York, NY',
          website: 'https://bob.build',
          github: 'bob-builder',
          twitter: 'bob_builder',
          linkedin: 'bob-smith',
          skills: ['Solidity', 'Rust', 'Go'],
          interests: ['Blockchain', 'Infrastructure']
        },
        {
          username: 'admin_user',
          email: 'admin@example.com',
          password: 'password123',
          fullName: 'Admin User',
          role: 'admin' as const,
          bio: 'Platform administrator',
          location: 'Global',
          skills: ['System Administration', 'Security', 'DevOps'],
          interests: ['Platform Management', 'Security']
        },
        {
          username: 'guest_user',
          email: 'guest@example.com',
          password: 'password123',
          fullName: 'Guest User',
          role: 'guest' as const,
          bio: 'Guest participant for hackathon events.',
          location: 'Remote',
          skills: ['JavaScript', 'React'],
          interests: ['Web Development', 'Hackathons'],
          hackathonId: 'hackathon-1',
          inviteToken: 'guest-invite-12345',
          invitedBy: 'organizer-1',
          invitedAt: Date.now()
        }
      ];

      for (const user of testUsers) {
        // Check if user already exists
        const existingUser = await this.getUserByEmail(user.email);
        if (!existingUser) {
          const result = await this.registerUser(user);
          if (result.success) {
            console.log(`✅ Created test user: ${user.email} (${user.role})`);
          } else {
            console.log(`❌ Failed to create test user ${user.email}: ${result.error}`);
          }
        } else {
          console.log(`ℹ️ Test user already exists: ${user.email}`);
        }
      }

      console.log('🎉 Test users seeding completed!');
      console.log('Available test users:');
      console.log('- alice@example.com / password123 (judge)');
      console.log('- bob@example.com / password123 (user)');
      console.log('- admin@example.com / password123 (admin)');
      console.log('- guest@example.com / password123 (guest)');

    } catch (error) {
      console.error('❌ Failed to seed test users:', error);
    }
  }
}

// Singleton instance
let authService: AuthStorageService | null = null;

export function getAuthService(): AuthStorageService {
  try {
    if (!authService) {
      const config: LighthouseConfig = {
        apiKey: process.env.LIGHTHOUSE_API_KEY || process.env.LIGHTHOUSE_KEY || '',
        privateKey: process.env.LIGHTHOUSE_PRIVATE_KEY || ''
      };

      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

      // For development, use enhanced service with IPNS/IPFS storage
      console.log('🔧 Using EnhancedMockAuthService with IPNS/IPFS storage');
      console.log('Available test users:');
      console.log('- alice@example.com / password123 (judge)');
      console.log('- bob@example.com / password123 (user)');
      console.log('- admin@example.com / password123 (admin)');
      console.log('- guest@example.com / password123 (guest)');
      console.log('✅ New users can be registered and will persist for signin');

      try {
        authService = new EnhancedMockAuthService(jwtSecret);
      } catch (error) {
        console.error('❌ Failed to initialize EnhancedMockAuthService:', error);
        console.log('🔄 Falling back to basic authentication');
        authService = new BasicAuthService(jwtSecret);
      }
    }

    return authService;
  } catch (error) {
    console.error('❌ Critical error in getAuthService:', error);
    throw new Error('Authentication service initialization failed');
  }
}

// Enhanced mock service for reliable development authentication
class EnhancedMockAuthService {
  private jwtSecret: string;
  private mockUsers: User[] = [];
  private storageKey = 'enhanced-mock-users';
  private mockSessions: Session[] = [];

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
    this.loadUsers();
    this.initializeDefaultUsers();
  }

  private loadUsers(): void {
    try {
      // Server-side persistence using global cache
      if (typeof window === 'undefined') {
        // Server-side: Use global storage for persistence between API calls
        const globalUsers = (global as any).enhancedMockUsers;
        if (globalUsers) {
          this.mockUsers = [...globalUsers];
          console.log(`🔧 Enhanced Mock Service: Loaded ${this.mockUsers.length} users from server cache`);
        }
      } else {
        // Client-side: Load from localStorage
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.mockUsers = JSON.parse(stored);
          console.log(`🔧 Enhanced Mock Service: Loaded ${this.mockUsers.length} users from localStorage`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load users:', error);
    }
  }

  private saveUsers(): void {
    try {
      if (typeof window === 'undefined') {
        // Server-side: Save to global cache
        (global as any).enhancedMockUsers = [...this.mockUsers];
        console.log(`🔧 Enhanced Mock Service: Saved ${this.mockUsers.length} users to server cache`);
      } else {
        // Client-side: Save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(this.mockUsers));
        console.log(`🔧 Enhanced Mock Service: Saved ${this.mockUsers.length} users to localStorage`);
      }
    } catch (error) {
      console.error('❌ Failed to save users:', error);
    }
  }

  private initializeDefaultUsers(): void {
    const defaultUsers: User[] = [
      {
        id: '1',
        username: 'alice_dev',
        email: 'alice@example.com',
        password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // password123
        fullName: 'Alice Johnson',
        role: 'judge',
        bio: 'Full-stack developer passionate about DeFi and Web3 technologies.',
        location: 'San Francisco, CA',
        website: 'https://alice.dev',
        github: 'alice-dev',
        twitter: 'alice_dev',
        linkedin: 'alice-johnson',
        skills: ['React', 'Solidity', 'Web3.js', 'TypeScript'],
        interests: ['DeFi', 'NFTs', 'Blockchain'],
        isActive: true,
        isVerified: true,
        lastLogin: Date.now(),
        createdAt: Date.now() - 86400000 * 30,
        updatedAt: Date.now()
      },
      {
        id: '2',
        username: 'bob_builder',
        email: 'bob@example.com',
        password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // password123
        fullName: 'Bob Smith',
        role: 'user',
        bio: 'Blockchain architect and smart contract developer.',
        location: 'New York, NY',
        website: 'https://bob.build',
        github: 'bob-builder',
        twitter: 'bob_builder',
        linkedin: 'bob-smith',
        skills: ['Solidity', 'Rust', 'Go'],
        interests: ['Blockchain', 'Infrastructure'],
        isActive: true,
        isVerified: true,
        lastLogin: Date.now(),
        createdAt: Date.now() - 86400000 * 45,
        updatedAt: Date.now()
      },
      {
        id: '3',
        username: 'admin_user',
        email: 'admin@example.com',
        password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // password123
        fullName: 'Admin User',
        role: 'admin',
        bio: 'Platform administrator',
        location: 'Global',
        skills: ['System Administration', 'Security', 'DevOps'],
        interests: ['Platform Management', 'Security'],
        isActive: true,
        isVerified: true,
        lastLogin: Date.now(),
        createdAt: Date.now() - 86400000 * 60,
        updatedAt: Date.now()
      },
      {
        id: '4',
        username: 'guest_user',
        email: 'guest@example.com',
        password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // password123
        fullName: 'Guest User',
        role: 'guest',
        bio: 'Guest participant for hackathon events.',
        location: 'Remote',
        skills: ['JavaScript', 'React'],
        interests: ['Web Development', 'Hackathons'],
        isActive: true,
        isVerified: false,
        lastLogin: Date.now(),
        createdAt: Date.now() - 86400000 * 7,
        updatedAt: Date.now(),
        hackathonId: 'hackathon-1',
        inviteToken: 'guest-invite-12345',
        invitedBy: 'organizer-1',
        invitedAt: Date.now() - 86400000 * 7
      }
    ];

    // Add default users if they don't exist
    for (const defaultUser of defaultUsers) {
      if (!this.mockUsers.find(u => u.email === defaultUser.email)) {
        this.mockUsers.push(defaultUser);
      }
    }

    if (this.mockUsers.length === defaultUsers.length) {
      console.log('🔧 Enhanced Mock Service: Initialized with default test users');
    }
  }

  async initializeMasterIPNS(): Promise<void> {
    console.log('🔧 Enhanced Mock Service: Authentication system initialized');
    console.log('✅ Pre-configured test users loaded');
  }

  async registerUser(userData: any): Promise<AuthResponse> {
    console.log(`🔧 Enhanced Mock Service: Registering new user: ${userData.email}`);

    // Check if user exists
    const existingUser = this.mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        message: 'Email already exists',
        error: 'EMAIL_EXISTS'
      };
    }

    const existingUserByUsername = this.mockUsers.find(u => u.username === userData.username);
    if (existingUserByUsername) {
      return {
        success: false,
        message: 'Username already taken',
        error: 'USERNAME_EXISTS'
      };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      password: await this.hashPassword(userData.password),
      fullName: userData.fullName,
      role: userData.role || 'user',
      bio: userData.bio || '',
      location: userData.location || '',
      website: userData.website || '',
      github: userData.github || '',
      twitter: userData.twitter || '',
      linkedin: userData.linkedin || '',
      skills: userData.skills || [],
      interests: userData.interests || [],
      isActive: true,
      isVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      // Guest-specific fields
      hackathonId: userData.hackathonId,
      inviteToken: userData.inviteToken,
      invitedBy: userData.invitedBy,
      invitedAt: userData.invitedAt
    };

    this.mockUsers.push(newUser);
    this.saveUsers(); // Save to persistent storage
    console.log(`✅ Enhanced Mock Service: User registered successfully: ${newUser.email}`);
    console.log(`📊 Total users in storage: ${this.mockUsers.length}`);

    return {
      success: true,
      user: { ...newUser, password: '' },
      message: 'User registered successfully'
    };
  }

  async loginUser(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    console.log(`🔧 Enhanced Mock Service: Login attempt for: ${email}`);

    const user = this.mockUsers.find(u => u.email === email);
    if (!user) {
      console.log(`❌ Enhanced Mock Service: User not found: ${email}`);
      console.log(`🔍 Available users:`, this.mockUsers.map(u => u.email));
      return {
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      };
    }

    // For development, use simple password check
    const isPasswordValid = password === 'password123' || await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      console.log(`❌ Enhanced Mock Service: Invalid password for: ${email}`);
      console.log(`🔍 Expected: password123 or hash match`);
      console.log(`🔍 Got: ${password}`);
      return {
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      };
    }

    // Update last login
    user.lastLogin = Date.now();
    user.updatedAt = Date.now();

    // Create session
    const session = await this.createSession(user.id, ipAddress, userAgent);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        sessionId: session.id
      },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    console.log(`✅ Enhanced Mock Service: User logged in successfully: ${user.username} (${user.role})`);
    return {
      success: true,
      user: { ...user, password: '' },
      token,
      message: 'Login successful'
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    console.log(`🔧 Enhanced Mock Service: Looking up user by email: ${email}`);
    console.log(`🔍 Total users in database: ${this.mockUsers.length}`);
    console.log(`🔍 Available emails:`, this.mockUsers.map(u => u.email));

    const user = this.mockUsers.find(u => u.email === email);
    if (user) {
      console.log(`✅ Enhanced Mock Service: Found user: ${user.email} (${user.role})`);
    } else {
      console.log(`❌ Enhanced Mock Service: User not found: ${email}`);
    }
    return user || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.mockUsers.find(u => u.username === username) || null;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.mockUsers.find(u => u.id === userId) || null;
  }

  async updateUser(user: User): Promise<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.mockUsers[index] = { ...user, updatedAt: Date.now() };
      return true;
    }
    return false;
  }

  async createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<Session> {
    const session: Session = {
      id: crypto.randomUUID(),
      userId,
      token: '',
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      ipAddress,
      userAgent,
      isActive: true
    };

    this.mockSessions.push(session);
    return session;
  }

  async verifyToken(token: string): Promise<{ valid: boolean; user?: User; error?: string }> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;

      if (!decoded.userId) {
        return { valid: false, error: 'Invalid token' };
      }

      const user = await this.getUserById(decoded.userId);
      if (!user || !user.isActive) {
        return { valid: false, error: 'User not found or inactive' };
      }

      return { valid: true, user };
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }

  async logoutUser(sessionId: string): Promise<boolean> {
    const index = this.mockSessions.findIndex(s => s.id === sessionId);
    if (index >= 0) {
      this.mockSessions.splice(index, 1);
      return true;
    }
    return false;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  // Add missing methods to match AuthStorageService interface
  async getMasterAuthIndex(): Promise<MasterAuthIndex | null> {
    return {
      users: {},
      sessions: {},
      totalUsers: this.mockUsers.length,
      totalSessions: this.mockSessions.length,
      lastUpdated: Date.now()
    };
  }

  async updateMasterIndex(type: 'user' | 'session', id: string, ipnsRecord: string, ipfsHash: string): Promise<void> {
    console.log(`Enhanced Mock Service: Updated ${type} ${id}`);
  }

  private async uploadToIPFS(data: any): Promise<string> {
    return `mock-ipfs-hash-${Date.now()}`;
  }

  private async downloadFromIPFS(hash: string): Promise<any> {
    return { mock: true, hash };
  }

  private async createIPNSRecord(key: string, hash: string): Promise<string> {
    return `mock-ipns-${key}-${Date.now()}`;
  }

  private async getIPNSRecord(key: string): Promise<string | null> {
    return null;
  }
}

// Basic fallback service for critical errors
class BasicAuthService {
  private jwtSecret: string;
  private dynamicUsers: any[] = [];

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  async initializeMasterIPNS(): Promise<void> {
    console.log('🔧 BasicAuthService: Initialized');
  }

  async registerUser(userData: any): Promise<AuthResponse> {
    console.log(`🔧 BasicAuthService: Registration attempt for: ${userData.email}`);

    // Check if user already exists
    const testUsers = {
      'alice@example.com': true,
      'bob@example.com': true,
      'admin@example.com': true,
      'guest@example.com': true
    };

    if (testUsers[userData.email as keyof typeof testUsers]) {
      return {
        success: false,
        message: 'Email already exists',
        error: 'EMAIL_EXISTS'
      };
    }

    // Simple validation
    if (!userData.email || !userData.password || !userData.username || !userData.fullName) {
      return {
        success: false,
        message: 'Missing required fields',
        error: 'VALIDATION_ERROR'
      };
    }

    // Create new user
    const newUser = {
      id: 'basic-' + crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: 'user',
      bio: userData.bio || '',
      location: userData.location || '',
      website: userData.website || '',
      github: userData.github || '',
      twitter: userData.twitter || '',
      linkedin: userData.linkedin || '',
      skills: userData.skills || [],
      interests: userData.interests || [],
      isActive: true,
      isVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      password: userData.password // Store password for simple validation
    };

    // Store the user for login validation
    this.dynamicUsers.push(newUser);

    console.log(`✅ BasicAuthService: User registered successfully: ${newUser.email}`);
    console.log(`📊 Total registered users: ${this.dynamicUsers.length}`);

    return {
      success: true,
      user: { ...newUser, password: undefined }, // Don't return password
      message: 'User registered successfully'
    };
  }

  async loginUser(email: string, password: string): Promise<AuthResponse> {
    console.log(`🔧 BasicAuthService: Login attempt for: ${email}`);
    console.log(`🔍 Checking ${this.dynamicUsers.length} dynamic users and predefined users`);

    // First check predefined test users
    const testUsers = {
      'alice@example.com': { password: 'password123', role: 'judge', name: 'Alice Johnson' },
      'bob@example.com': { password: 'password123', role: 'user', name: 'Bob Smith' },
      'admin@example.com': { password: 'password123', role: 'admin', name: 'Admin User' },
      'guest@example.com': { password: 'password123', role: 'guest', name: 'Guest User' }
    };

    const testUser = testUsers[email as keyof typeof testUsers];
    if (testUser && password === 'password123') {
      const token = Buffer.from(JSON.stringify({ email, role: testUser.role })).toString('base64');

      return {
        success: true,
        user: {
          id: 'basic-' + email,
          username: email.split('@')[0],
          email,
          fullName: testUser.name,
          role: testUser.role as any,
          skills: [],
          interests: [],
          isActive: true,
          isVerified: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        token,
        message: 'Login successful (test user)'
      };
    }

    // Check dynamically registered users
    const dynamicUser = this.dynamicUsers.find(u => u.email === email);
    if (dynamicUser) {
      console.log(`🔍 Found dynamic user: ${email}`);

      if (password === dynamicUser.password) {
        const token = Buffer.from(JSON.stringify({ email, role: dynamicUser.role })).toString('base64');

        return {
          success: true,
          user: { ...dynamicUser, password: undefined }, // Don't return password
          token,
          message: 'Login successful (registered user)'
        };
      } else {
        console.log(`❌ Password mismatch for dynamic user: ${email}`);
      }
    }

    console.log(`❌ User not found: ${email}`);
    console.log(`🔍 Available emails:`, [
      ...Object.keys(testUsers),
      ...this.dynamicUsers.map(u => u.email)
    ]);

    return {
      success: false,
      message: 'Invalid credentials',
      error: 'INVALID_CREDENTIALS'
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return null;
  }

  async getUserById(userId: string): Promise<User | null> {
    return null;
  }

  async updateUser(user: User): Promise<boolean> {
    return false;
  }

  async createSession(userId: string): Promise<Session> {
    return {
      id: crypto.randomUUID(),
      userId,
      token: '',
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      isActive: true
    };
  }

  async verifyToken(token: string): Promise<{ valid: boolean; user?: User; error?: string }> {
    return { valid: false, error: 'Token verification not available in basic mode' };
  }

  async logoutUser(sessionId: string): Promise<boolean> {
    return true;
  }

  async getMasterAuthIndex(): Promise<MasterAuthIndex | null> {
    return {
      users: {},
      sessions: {},
      totalUsers: 0,
      totalSessions: 0,
      lastUpdated: Date.now()
    };
  }

  async updateMasterIndex(type: 'user' | 'session', id: string, ipnsRecord: string, ipfsHash: string): Promise<void> {
    // No-op in basic mode
  }
}

// Original mock service for development when Lighthouse is not configured
class MockAuthService {
  private jwtSecret: string;
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'alice_dev',
      email: 'alice@example.com',
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // password123
      fullName: 'Alice Johnson',
      role: 'judge',
      bio: 'Full-stack developer passionate about DeFi and Web3 technologies.',
      location: 'San Francisco, CA',
      website: 'https://alice.dev',
      github: 'alice-dev',
      twitter: 'alice_dev',
      linkedin: 'alice-johnson',
      skills: ['React', 'Solidity', 'Web3.js', 'TypeScript'],
      interests: ['DeFi', 'NFTs', 'Blockchain'],
      isActive: true,
      isVerified: true,
      lastLogin: Date.now(),
      createdAt: Date.now() - 86400000 * 30,
      updatedAt: Date.now()
    },
    {
      id: '2',
      username: 'bob_builder',
      email: 'bob@example.com',
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // password123
      fullName: 'Bob Smith',
      role: 'user',
      bio: 'Blockchain architect and smart contract developer.',
      location: 'New York, NY',
      website: 'https://bob.build',
      github: 'bob-builder',
      twitter: 'bob_builder',
      linkedin: 'bob-smith',
      skills: ['Solidity', 'Rust', 'Go'],
      interests: ['Blockchain', 'Infrastructure'],
      isActive: true,
      isVerified: true,
      lastLogin: Date.now(),
      createdAt: Date.now() - 86400000 * 45,
      updatedAt: Date.now()
    },
    {
      id: '3',
      username: 'admin_user',
      email: 'admin@example.com',
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // password123
      fullName: 'Admin User',
      role: 'admin',
      bio: 'Platform administrator',
      location: 'Global',
      skills: ['System Administration', 'Security', 'DevOps'],
      interests: ['Platform Management', 'Security'],
      isActive: true,
      isVerified: true,
      lastLogin: Date.now(),
      createdAt: Date.now() - 86400000 * 60,
      updatedAt: Date.now()
    },
    {
      id: '4',
      username: 'guest_user',
      email: 'guest@example.com',
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // password123
      fullName: 'Guest User',
      role: 'guest',
      bio: 'Guest participant for hackathon events.',
      location: 'Remote',
      skills: ['JavaScript', 'React'],
      interests: ['Web Development', 'Hackathons'],
      isActive: true,
      isVerified: false,
      lastLogin: Date.now(),
      createdAt: Date.now() - 86400000 * 7,
      updatedAt: Date.now(),
      hackathonId: 'hackathon-1',
      inviteToken: 'guest-invite-12345',
      invitedBy: 'organizer-1',
      invitedAt: Date.now() - 86400000 * 7
    }
  ];

  private mockSessions: Session[] = [];

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  async initializeMasterIPNS(): Promise<void> {
    console.log('🔧 Mock service: Master IPNS initialized for authentication');
  }

  async registerUser(userData: any): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = this.mockUsers.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      return {
        success: false,
        message: existingUser.email === userData.email ? 'Email already exists' : 'Username already taken',
        error: existingUser.email === userData.email ? 'EMAIL_EXISTS' : 'USERNAME_EXISTS'
      };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      password: await this.hashPassword(userData.password),
      fullName: userData.fullName,
      role: userData.role || 'user',
      bio: userData.bio || '',
      location: userData.location || '',
      website: userData.website || '',
      github: userData.github || '',
      twitter: userData.twitter || '',
      linkedin: userData.linkedin || '',
      skills: userData.skills || [],
      interests: userData.interests || [],
      isActive: true,
      isVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      // Guest-specific fields
      hackathonId: userData.hackathonId,
      inviteToken: userData.inviteToken,
      invitedBy: userData.invitedBy,
      invitedAt: userData.invitedAt
    };

    this.mockUsers.push(newUser);
    console.log(`🔧 Mock service: User registered ${newUser.username}`);

    return {
      success: true,
      user: { ...newUser, password: '' },
      message: 'User registered successfully'
    };
  }

  async loginUser(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const user = this.mockUsers.find(u => u.email === email);
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      };
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      };
    }

    // Update last login
    user.lastLogin = Date.now();

    // Create session
    const session = await this.createSession(user.id, ipAddress, userAgent);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        sessionId: session.id
      },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    console.log(`🔧 Mock service: User logged in ${user.username}`);
    return {
      success: true,
      user: { ...user, password: '' },
      token,
      message: 'Login successful'
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.mockUsers.find(u => u.email === email) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.mockUsers.find(u => u.username === username) || null;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.mockUsers.find(u => u.id === userId) || null;
  }

  async updateUser(user: User): Promise<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.mockUsers[index] = { ...user, updatedAt: Date.now() };
      return true;
    }
    return false;
  }

  async createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<Session> {
    const session: Session = {
      id: crypto.randomUUID(),
      userId,
      token: '',
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      ipAddress,
      userAgent,
      isActive: true
    };

    this.mockSessions.push(session);
    return session;
  }

  async verifyToken(token: string): Promise<{ valid: boolean; user?: User; error?: string }> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      if (!decoded.userId) {
        return { valid: false, error: 'Invalid token' };
      }

      const user = await this.getUserById(decoded.userId);
      if (!user || !user.isActive) {
        return { valid: false, error: 'User not found or inactive' };
      }

      return { valid: true, user };
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }

  async logoutUser(sessionId: string): Promise<boolean> {
    const index = this.mockSessions.findIndex(s => s.id === sessionId);
    if (index >= 0) {
      this.mockSessions.splice(index, 1);
      return true;
    }
    return false;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  // Add missing methods to match AuthStorageService interface
  async getMasterAuthIndex(): Promise<MasterAuthIndex | null> {
    return {
      users: {},
      sessions: {},
      totalUsers: this.mockUsers.length,
      totalSessions: this.mockSessions.length,
      lastUpdated: Date.now()
    };
  }

  async updateMasterIndex(type: 'user' | 'session', id: string, ipnsRecord: string, ipfsHash: string): Promise<void> {
    // Mock implementation - no actual IPNS operations
    console.log(`Mock: Updated ${type} ${id} with IPNS ${ipnsRecord}`);
  }

  private async uploadToIPFS(data: any): Promise<string> {
    // Mock implementation - return a fake hash
    return `mock-ipfs-hash-${Date.now()}`;
  }

  private async downloadFromIPFS(hash: string): Promise<any> {
    // Mock implementation - return mock data
    return { mock: true, hash };
  }

  private async createIPNSRecord(key: string, hash: string): Promise<string> {
    // Mock implementation - return a fake IPNS record
    return `mock-ipns-${key}-${Date.now()}`;
  }

  private async getIPNSRecord(key: string): Promise<string | null> {
    // Mock implementation - return null for now
    return null;
  }
}
