# Lighthouse Storage Integration Guide

## Overview

Lighthouse is a decentralized storage protocol that provides perpetual storage on IPFS and Filecoin. This guide covers how to integrate Lighthouse Storage into your hackathon platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [API Setup](#api-setup)
3. [File Uploads](#file-uploads)
4. [File Management](#file-management)
5. [Encryption](#encryption)
6. [Advanced Features](#advanced-features)
7. [Error Handling](#error-handling)

## Getting Started

### Installation

```bash
npm install @lighthouse-web3/sdk
# or
yarn add @lighthouse-web3/sdk
```

### Basic Setup

```javascript
import lighthouse from '@lighthouse-web3/sdk';

const apiKey = process.env.LIGHTHOUSE_API_KEY;
```

## API Setup

### Getting API Keys

1. Visit [Lighthouse Console](https://console.lighthouse.storage)
2. Sign up or login with your wallet
3. Navigate to API Keys section
4. Generate a new API key

### Environment Configuration

```env
LIGHTHOUSE_API_KEY=your_api_key_here
LIGHTHOUSE_PUBLIC_KEY=your_public_key_here
```

## File Uploads

### Simple Upload

```javascript
const uploadFile = async (file) => {
  try {
    const response = await lighthouse.upload(file, apiKey);
    console.log('File uploaded:', response.data.Hash);
    return response.data.Hash;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Multiple Files Upload

```javascript
const uploadMultipleFiles = async (files) => {
  try {
    const response = await lighthouse.upload(files, apiKey);
    return response.data;
  } catch (error) {
    console.error('Multiple upload failed:', error);
  }
};
```

### Upload with Encryption

```javascript
const uploadEncryptedFile = async (file, publicKey) => {
  try {
    const response = await lighthouse.uploadEncrypted(
      file,
      apiKey,
      publicKey
    );
    return response.data;
  } catch (error) {
    console.error('Encrypted upload failed:', error);
  }
};
```

## File Management

### Download File

```javascript
const downloadFile = async (cid) => {
  try {
    const response = await lighthouse.downloadFile(cid);
    return response;
  } catch (error) {
    console.error('Download failed:', error);
  }
};
```

### Get File Info

```javascript
const getFileInfo = async (cid) => {
  try {
    const response = await lighthouse.getFileInfo(cid, apiKey);
    return response.data;
  } catch (error) {
    console.error('Get file info failed:', error);
  }
};
```

### List All Files

```javascript
const listFiles = async () => {
  try {
    const response = await lighthouse.getFileList(apiKey);
    return response.data;
  } catch (error) {
    console.error('List files failed:', error);
  }
};
```

## Encryption

### Generate Encryption Keys

```javascript
const generateKeys = async () => {
  try {
    const keyPair = await lighthouse.generateKeyPair();
    return {
      publicKey: keyPair.publicKeyString,
      privateKey: keyPair.privateKeyString
    };
  } catch (error) {
    console.error('Key generation failed:', error);
  }
};
```

### Decrypt File

```javascript
const decryptFile = async (cid, privateKey) => {
  try {
    const response = await lighthouse.decryptFile(
      cid,
      privateKey,
      'file-name.extension'
    );
    return response;
  } catch (error) {
    console.error('Decryption failed:', error);
  }
};
```

## Advanced Features

### Token Gating

```javascript
const uploadWithTokenGating = async (file, tokenGatingCondition) => {
  try {
    const response = await lighthouse.upload(
      file,
      apiKey,
      null,
      null,
      tokenGatingCondition
    );
    return response.data;
  } catch (error) {
    console.error('Token gated upload failed:', error);
  }
};
```

### IPNS Publishing

```javascript
const publishToIPNS = async (cid) => {
  try {
    const response = await lighthouse.publishToIpns(cid, apiKey);
    return response.data;
  } catch (error) {
    console.error('IPNS publish failed:', error);
  }
};
```

### Deal Activation

```javascript
const activateDeal = async (cid) => {
  try {
    const response = await lighthouse.activateDeal(cid, apiKey);
    return response.data;
  } catch (error) {
    console.error('Deal activation failed:', error);
  }
};
```

## Error Handling

### Common Error Codes

- **400**: Bad Request - Invalid parameters
- **401**: Unauthorized - Invalid API key
- **413**: File too large
- **429**: Rate limit exceeded
- **500**: Internal server error

### Error Handling Best Practices

```javascript
const handleLighthouseError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data.message;

    switch (status) {
      case 400:
        console.error('Invalid request:', message);
        break;
      case 401:
        console.error('Authentication failed:', message);
        break;
      case 413:
        console.error('File too large:', message);
        break;
      case 429:
        console.error('Rate limit exceeded:', message);
        break;
      default:
        console.error('Unknown error:', message);
    }
  } else {
    console.error('Network error:', error.message);
  }
};
```

## Best Practices

1. **Security**: Never expose API keys in client-side code
2. **File Validation**: Always validate file types and sizes before upload
3. **Error Handling**: Implement comprehensive error handling
4. **Progress Tracking**: Use upload progress callbacks for large files
5. **Backup Strategy**: Keep local backups of critical files

## Rate Limits

- Free tier: 100 uploads per day
- Maximum file size: 100MB (free tier)
- Storage duration: Perpetual (once uploaded to Filecoin)

## Support

- Documentation: [docs.lighthouse.storage](https://docs.lighthouse.storage)
- Discord: [Lighthouse Discord](https://discord.gg/lighthouse)
- Twitter: [@lighthouse](https://twitter.com/lighthouse)
- Email: support@lighthouse.storage