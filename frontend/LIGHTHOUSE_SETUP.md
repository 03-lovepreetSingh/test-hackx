# Lighthouse IPFS Setup Guide

## Overview
The project archive system uses Lighthouse IPFS for decentralized storage. This guide will help you set up the necessary credentials.

## Quick Start (Development Mode)
If you don't have Lighthouse credentials yet, the app will automatically use a mock service for development. This allows you to test all functionality locally without IPFS.

## Setting Up Lighthouse (Production)

### 1. Get Lighthouse API Key
1. Visit [Lighthouse Storage](https://lighthouse.storage/)
2. Sign up for an account
3. Navigate to your dashboard
4. Generate an API key

### 2. Configure Environment Variables
Create a `.env.local` file in the frontend directory:

```bash
# Lighthouse Configuration
LIGHTHOUSE_API_KEY=your_api_key_here
LIGHTHOUSE_PRIVATE_KEY=your_private_key_here
```

### 3. Restart the Development Server
After adding the environment variables, restart your development server:

```bash
npm run dev
```

## Features Available

### With Lighthouse (Production)
- ✅ Projects stored on IPFS
- ✅ IPNS resolution for decentralized access
- ✅ Hierarchical IPNS structure
- ✅ Full CRUD operations
- ✅ Search and filtering

### With Mock Service (Development)
- ✅ All CRUD operations work locally
- ✅ Search and filtering
- ✅ Project creation and editing
- ⚠️ Data is not persisted (resets on server restart)
- ⚠️ No IPFS/IPNS storage

## Testing the System

### 1. Access the Project Archive
Navigate to: `http://localhost:3000/dashboard/projects`

### 2. Create a New Project
Click the "Create Project" button to add a new project.

### 3. Test CRUD Operations
- Create projects
- Edit existing projects
- Delete projects
- Search and filter

## Troubleshooting

### "Failed to fetch projects from IPNS"
This error occurs when:
1. Lighthouse API key is not configured (use mock service)
2. Network connectivity issues
3. Invalid API credentials

### Mock Service Warnings
If you see warnings about using the mock service, this is normal for development without Lighthouse credentials.

## Next Steps

1. **For Development**: The mock service allows full testing of the UI and functionality
2. **For Production**: Set up Lighthouse credentials to enable IPFS storage
3. **For Testing**: Use the populate endpoint to add sample data

## API Endpoints

- `GET /api/project-archives` - Get all projects
- `POST /api/project-archives` - Create new project
- `GET /api/project-archives/[id]` - Get specific project
- `PUT /api/project-archives/[id]` - Update project
- `DELETE /api/project-archives/[id]` - Delete project
- `GET /api/project-archives/search` - Search projects
- `POST /api/populate-project-archives` - Add sample data
