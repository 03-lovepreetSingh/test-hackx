import React from 'react';
import { ArchitectureDiagram } from '../components/architecture/ArchitectureDiagram';

export default function ArchitecturePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Lighthouse Integration Architecture</h1>
          <p className="text-lg text-gray-600">
            Understanding how the decentralized storage system works for hackathon data management
          </p>
        </div>
        
        <ArchitectureDiagram />
        
        <div className="mt-8 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-blue-700 mb-2">IPFS (InterPlanetary File System)</h3>
                <p className="text-sm text-blue-600">
                  A distributed storage system where content is identified by cryptographic hashes. 
                  Once uploaded, content becomes immutable and globally accessible.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-blue-700 mb-2">IPNS (InterPlanetary Name System)</h3>
                <p className="text-sm text-blue-600">
                  A naming system that provides human-readable names for IPFS content. 
                  These names can be updated to point to new content, enabling mutable references.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-3">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
              <li><strong>Create:</strong> User creates a hackathon → Data is uploaded to IPFS → Gets unique hash → IPNS record is created/updated to point to this hash</li>
              <li><strong>Read:</strong> User requests hackathon data → IPNS is resolved to get current IPFS hash → Data is downloaded from IPFS using the hash</li>
              <li><strong>Update:</strong> User modifies hackathon → Current data is retrieved → Modified → New version uploaded to IPFS → IPNS updated to point to new hash</li>
              <li><strong>Delete:</strong> User deletes hackathon → Data structure is modified → New version uploaded to IPFS → IPNS updated</li>
            </ol>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-3">Technical Implementation</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-purple-700 mb-1">LighthouseStorageService</h3>
                <p className="text-sm text-purple-600">
                  Core service that handles all IPFS/IPNS operations including upload, download, 
                  IPNS management, and CRUD operations for hackathon data.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-purple-700 mb-1">useLighthouseHackathons Hook</h3>
                <p className="text-sm text-purple-600">
                  React hook that provides easy integration with the storage service, 
                  managing state, loading states, and error handling.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-purple-700 mb-1">UI Components</h3>
                <p className="text-sm text-purple-600">
                  React components that provide user interfaces for managing hackathons, 
                  including forms, lists, and management interfaces.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-3">Benefits of This Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-yellow-700 mb-2">Decentralization</h3>
                <p className="text-sm text-yellow-600">
                  No single point of failure. Data is distributed across multiple nodes globally.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-yellow-700 mb-2">Immutability</h3>
                <p className="text-sm text-yellow-600">
                  Once uploaded, data cannot be modified, ensuring data integrity and version history.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-yellow-700 mb-2">Cost Effectiveness</h3>
                <p className="text-sm text-yellow-600">
                  No ongoing hosting costs. Pay only for storage operations.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-yellow-700 mb-2">Censorship Resistance</h3>
                <p className="text-sm text-yellow-600">
                  Difficult to block or remove content once it's on the network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
