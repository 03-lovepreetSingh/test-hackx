# Lighthouse Storage Integration

This project integrates Lighthouse storage for decentralized hackathon data management using IPFS and IPNS.

## Overview

Lighthouse provides a decentralized storage solution that allows you to:
- Store hackathon data on IPFS (InterPlanetary File System)
- Use IPNS (InterPlanetary Name System) for human-readable references
- Create, read, update, and delete hackathon data in a decentralized manner

## Setup

### 1. Install Dependencies

The Lighthouse SDK is already included in `package.json`:
```bash
npm install @lighthouse-web3/sdk
```

### 2. Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
# Lighthouse Storage Configuration
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_lighthouse_api_key_here
LIGHTHOUSE_PRIVATE_KEY=your_lighthouse_private_key_here

# Default IPNS for hackathons
NEXT_PUBLIC_HACKATHONS_IPNS=your_default_ipns_here
```

### 3. Get Lighthouse API Keys

1. Visit [Lighthouse Documentation](https://docs.lighthouse.storage/lighthouse-1)
2. Sign up for an account
3. Generate your API key and private key
4. Add them to your environment variables

## Architecture

### Core Components

1. **LighthouseStorageService** (`src/lib/lighthouse-storage.ts`)
   - Handles all IPFS/IPNS operations
   - Provides CRUD operations for hackathon data
   - Manages IPNS record updates

2. **useLighthouseHackathons Hook** (`src/app/hooks/useLighthouseHackathons.ts`)
   - React hook for easy integration
   - Provides loading states and error handling
   - Manages hackathon data state

3. **LighthouseHackathonManager** (`src/app/components/hackathon/LighthouseHackathonManager.tsx`)
   - UI component for managing hackathons
   - Full CRUD interface
   - Real-time updates

### Data Flow

```
User Action → React Hook → Lighthouse Service → IPFS Upload → IPNS Update → UI Update
```

## Usage

### Basic Usage

```typescript
import { useLighthouseHackathons } from '../hooks/useLighthouseHackathons';

function MyComponent() {
  const {
    hackathons,
    loading,
    error,
    createHackathon,
    updateHackathon,
    deleteHackathon
  } = useLighthouseHackathons({
    ipns: 'my-hackathons-ipns',
    autoFetch: true
  });

  // Use the data and functions...
}
```

### Creating a Hackathon

```typescript
const newHackathon = {
  title: 'Web3 Hackathon',
  description: 'Build the future of Web3',
  status: 'live',
  registrationClose: '2024-12-31',
  registrationDaysLeft: 30,
  techStack: 'React, Node.js, Web3',
  level: 'All levels',
  totalPrize: 50000,
  location: 'Online',
  tags: ['Web3', 'Blockchain', 'DeFi']
};

await createHackathon(newHackathon);
```

### Updating a Hackathon

```typescript
const updatedHackathon = {
  ...existingHackathon,
  title: 'Updated Web3 Hackathon',
  totalPrize: 75000
};

await updateHackathon(hackathonId, updatedHackathon);
```

## IPNS and IPFS Concepts

### IPFS (InterPlanetary File System)
- Content-addressed storage system
- Each file gets a unique hash (CID)
- Immutable - content cannot be changed
- Distributed across multiple nodes

### IPNS (InterPlanetary Name System)
- Human-readable names for IPFS hashes
- Can be updated to point to new content
- Acts like a pointer that can be redirected
- Enables mutable references to immutable content

### How It Works in This App

1. **Create/Update Hackathon**: 
   - Data is uploaded to IPFS → gets IPFS hash
   - IPNS record is updated to point to new hash
   - Old data remains on IPFS (immutable history)

2. **Read Hackathons**:
   - Resolve IPNS to get current IPFS hash
   - Download data from IPFS using the hash
   - Display hackathon data

3. **Delete Hackathon**:
   - Create new data structure without the hackathon
   - Upload to IPFS → get new hash
   - Update IPNS to point to new hash

## Demo Page

Visit `/lighthouse-demo` to see the integration in action:
- Create, edit, and delete hackathons
- Real-time updates
- Error handling
- Loading states

## Benefits

1. **Decentralized**: No single point of failure
2. **Immutable History**: All changes are preserved
3. **Censorship Resistant**: Data cannot be easily removed
4. **Global Access**: Available from anywhere
5. **Cost Effective**: No ongoing hosting costs

## Troubleshooting

### Common Issues

1. **API Key Not Set**: Ensure environment variables are properly configured
2. **Network Issues**: Check internet connection and Lighthouse service status
3. **IPNS Resolution**: May take a few minutes for IPNS updates to propagate

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG_LIGHTHOUSE=true
```

## Future Enhancements

1. **File Uploads**: Support for hackathon images and documents
2. **Versioning**: Track changes over time
3. **Collaboration**: Multiple users editing simultaneously
4. **Backup**: Automatic backup to multiple IPFS nodes
5. **Search**: Full-text search across hackathon data

## Resources

- [Lighthouse Documentation](https://docs.lighthouse.storage/lighthouse-1)
- [IPFS Documentation](https://docs.ipfs.io/)
- [IPNS Documentation](https://docs.ipfs.io/concepts/ipns/)
