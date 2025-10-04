import React from 'react';
import { LighthouseHackathonManager } from '../components/hackathon/LighthouseHackathonManager';
import { lighthouseConfig } from '../../lib/config';

export default function LighthouseDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Lighthouse Storage Demo</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">How it works:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Hackathon data is stored on IPFS using Lighthouse</li>
            <li>IPNS (InterPlanetary Name System) provides human-readable names for IPFS hashes</li>
            <li>When you update hackathon data, a new IPFS hash is generated and IPNS is updated</li>
            <li>This creates a decentralized, immutable storage system</li>
          </ul>
        </div>
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm">
            <strong>Current IPNS:</strong> {lighthouseConfig.defaultIPNS}
          </p>
        </div>
      </div>
      
      <LighthouseHackathonManager />
    </div>
  );
}
