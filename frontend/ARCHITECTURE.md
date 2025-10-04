# Lighthouse Integration Architecture

## Overview

The Lighthouse integration creates a decentralized storage system for hackathon data using IPFS (InterPlanetary File System) and IPNS (InterPlanetary Name System). This architecture enables immutable, distributed storage with human-readable references.

## High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │    │  Lighthouse SDK  │    │   IPFS Network  │
│                 │    │                 │    │                 │
│ • Components    │◄──►│ • Upload/Download│◄──►│ • Distributed   │
│ • Hooks         │    │ • IPNS Management│    │ • Immutable     │
│ • State Mgmt    │    │ • Error Handling │    │ • Global Access │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Actions │    │  IPNS Records    │    │  IPFS Content   │
│                 │    │                 │    │                 │
│ • Create        │    │ • Human-readable │    │ • Hash-based    │
│ • Read          │    │ • Mutable refs  │    │ • Content-addressed│
│ • Update        │    │ • Point to IPFS  │    │ • Immutable     │
│ • Delete        │    │ • Versioned      │    │ • Distributed   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Component Architecture

### 1. Data Layer (`src/lib/lighthouse-storage.ts`)

```typescript
LighthouseStorageService
├── uploadHackathonData()     // Upload to IPFS
├── downloadHackathonData()  // Download from IPFS
├── createOrUpdateIPNS()     // Update IPNS record
├── resolveIPNS()            // Get current IPFS hash
├── getAllHackathons()       // Get all hackathons
├── getHackathonById()        // Get specific hackathon
├── createHackathon()         // Create new hackathon
├── updateHackathon()         // Update existing hackathon
└── deleteHackathon()         // Delete hackathon
```

### 2. React Integration Layer (`src/app/hooks/useLighthouseHackathons.ts`)

```typescript
useLighthouseHackathons Hook
├── State Management
│   ├── hackathons: Hackathon[]
│   ├── loading: boolean
│   └── error: string | null
├── CRUD Operations
│   ├── createHackathon()
│   ├── updateHackathon()
│   ├── deleteHackathon()
│   └── getHackathonById()
└── Utility Functions
    ├── refresh()
    └── autoFetch
```

### 3. UI Layer

```
UI Components
├── LighthouseHackathonManager
│   ├── Create/Edit Forms
│   ├── Hackathon List
│   └── CRUD Operations
├── ExploreHackathons (Updated)
│   ├── Search & Filter
│   ├── Lighthouse Integration
│   └── Fallback to Mock Data
└── Demo Pages
    ├── /lighthouse-demo
    └── /test-lighthouse
```

## Data Flow Architecture

### 1. Create Hackathon Flow

```
User Input → React Hook → Lighthouse Service → IPFS Upload → IPNS Update → UI Update
     │            │              │                │            │           │
     │            │              │                │            │           │
     ▼            ▼              ▼                ▼            ▼           ▼
┌─────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Form    │ │ Hook     │ │ Service      │ │ IPFS    │ │ IPNS    │ │ UI      │
│ Data    │ │ State    │ │ Processing   │ │ Storage │ │ Record  │ │ Refresh │
└─────────┘ └──────────┘ └──────────────┘ └─────────┘ └─────────┘ └─────────┘
```

**Step-by-step process:**
1. User fills out hackathon form
2. React hook receives the data
3. Lighthouse service processes the data
4. Data is uploaded to IPFS (gets unique hash)
5. IPNS record is updated to point to new hash
6. UI refreshes to show new data

### 2. Read Hackathon Flow

```
UI Request → React Hook → Lighthouse Service → IPNS Resolution → IPFS Download → Data Display
     │            │              │                │                │              │
     │            │              │                │                │              │
     ▼            ▼              ▼                ▼                ▼              ▼
┌─────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Load   │ │ Hook      │ │ Service      │ │ IPNS    │ │ IPFS    │ │ UI      │
│ Request │ │ State    │ │ Processing   │ │ Lookup  │ │ Download│ │ Display │
└─────────┘ └──────────┘ └──────────────┘ └─────────┘ └─────────┘ └─────────┘
```

### 3. Update Hackathon Flow

```
User Edit → React Hook → Lighthouse Service → Get Current Data → Modify Data → Upload to IPFS → Update IPNS → UI Update
     │            │              │                │              │            │            │           │
     │            │              │                │              │            │            │           │
     ▼            ▼              ▼                ▼              ▼            ▼            ▼           ▼
┌─────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Form    │ │ Hook     │ │ Service      │ │ IPNS    │ │ Data    │ │ IPFS    │ │ IPNS    │ │ UI      │
│ Edit    │ │ State    │ │ Processing   │ │ Resolve │ │ Modify  │ │ Upload  │ │ Update  │ │ Refresh │
└─────────┘ └──────────┘ └──────────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

## IPFS and IPNS Architecture

### IPFS (InterPlanetary File System)
```
┌─────────────────────────────────────────────────────────────┐
│                    IPFS Network                             │
├─────────────────────────────────────────────────────────────┤
│  Content-Addressed Storage                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Node 1      │  │ Node 2      │  │ Node 3      │        │
│  │ QmHash1     │  │ QmHash2     │  │ QmHash3     │        │
│  │ Hackathon A │  │ Hackathon B │  │ Hackathon C │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  • Immutable content                                        │
│  • Distributed across nodes                                │
│  • Content-addressed (hash-based)                          │
│  • Global accessibility                                    │
└─────────────────────────────────────────────────────────────┘
```

### IPNS (InterPlanetary Name System)
```
┌─────────────────────────────────────────────────────────────┐
│                    IPNS Records                             │
├─────────────────────────────────────────────────────────────┤
│  Human-Readable Names → IPFS Hashes                         │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │ "hackathons"   │───►│ QmHash1         │                 │
│  │ "projects"      │───►│ QmHash2         │                 │
│  │ "users"         │───►│ QmHash3         │                 │
│  └─────────────────┘    └─────────────────┘                 │
│                                                             │
│  • Mutable references                                      │
│  • Human-readable                                          │
│  • Can be updated                                          │
│  • Points to latest content                                │
└─────────────────────────────────────────────────────────────┘
```

## Data Structure Architecture

### Hackathon Data Model
```typescript
interface Hackathon {
  id: string;                    // Unique identifier
  title: string;                  // Hackathon name
  description: string;            // Detailed description
  status: 'live' | 'voting' | 'ended';
  registrationClose: string;       // ISO date string
  registrationDaysLeft: number;   // Days remaining
  techStack: string;              // Technology requirements
  level: string;                  // Difficulty level
  totalPrize: number;             // Prize amount
  location: string;               // Physical/virtual location
  image?: string;                 // Optional image URL
  subtitle?: string;             // Optional subtitle
  tags?: string[];               // Optional tags
}
```

### Storage Data Structure
```typescript
interface HackathonStorageData {
  hackathons: Hackathon[];        // Array of hackathons
  metadata: {
    lastUpdated: number;          // Timestamp
    version: string;             // Data version
  };
}
```

## Error Handling Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Layer    │    │  Service Layer  │    │  Network Layer  │
│                 │    │                 │    │                 │
│ • UI Feedback   │◄──►│ • Try/Catch     │◄──►│ • API Errors    │
│ • Error Display │    │ • Validation    │    │ • Network Issues│
│ • Retry Options │    │ • Fallbacks     │    │ • Timeouts      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Error Handling Flow
1. **Network Errors**: Retry with exponential backoff
2. **Validation Errors**: Show user-friendly messages
3. **API Errors**: Fallback to mock data or cached data
4. **User Errors**: Form validation and guidance

## Security Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │  Lighthouse API │    │   IPFS Network  │
│                 │    │                 │    │                 │
│ • API Key       │───►│ • Authentication│    │ • Content Hash  │
│ • Private Key   │    │ • Authorization │    │ • Immutable     │
│ • Environment   │    │ • Rate Limiting │    │ • Distributed   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Measures
1. **API Key Protection**: Stored in environment variables
2. **Private Key Security**: Server-side only, never exposed
3. **Content Integrity**: IPFS hash verification
4. **Access Control**: Lighthouse API authentication

## Performance Architecture

### Caching Strategy
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React State   │    │  Lighthouse    │    │   IPFS Cache   │
│                 │    │   Service      │    │                 │
│ • Local State   │◄──►│ • IPNS Cache   │◄──►│ • Node Cache    │
│ • Component     │    │ • Hash Cache   │    │ • Global Cache  │
│   State          │    │ • Data Cache  │    │ • CDN Cache     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Optimization Techniques
1. **Lazy Loading**: Load data only when needed
2. **Caching**: Cache IPNS resolutions and IPFS data
3. **Batch Operations**: Group multiple operations
4. **Error Recovery**: Graceful degradation

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Lighthouse    │    │   IPFS Network  │
│   (Next.js)     │    │   Service      │    │                 │
│                 │    │                 │    │                 │
│ • Static Files  │    │ • API Gateway  │    │ • Global Nodes  │
│ • Server-Side   │    │ • Authentication│   │ • Content      │
│ • Client-Side   │    │ • Rate Limiting │    │   Distribution │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Benefits of This Architecture

1. **Decentralization**: No single point of failure
2. **Immutability**: Data cannot be tampered with
3. **Global Access**: Available worldwide
4. **Cost Effective**: No hosting costs
5. **Censorship Resistant**: Difficult to block
6. **Version History**: All changes are preserved
7. **Scalability**: Grows with the network

## Future Enhancements

1. **File Uploads**: Support for images and documents
2. **Real-time Updates**: WebSocket integration
3. **Search**: Full-text search across data
4. **Collaboration**: Multi-user editing
5. **Backup**: Multiple IPFS node redundancy
6. **Analytics**: Usage tracking and metrics
