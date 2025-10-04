import React from 'react';
import { DatabaseBackedHackathonManager } from '../components/hackathon/DatabaseBackedHackathonManager';

export default function DatabaseDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Database-Backed Lighthouse Integration</h1>
          <p className="text-lg text-gray-600">
            Each hackathon is stored in the database with individual IPFS/IPNS references for optimal performance and management.
          </p>
        </div>
        
        <DatabaseBackedHackathonManager />
        
        <div className="mt-8 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">How It Works Now</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-blue-700 mb-1">1. Database Storage</h3>
                <p className="text-sm text-blue-600">
                  Each hackathon gets a database record with metadata and IPFS/IPNS references. 
                  This enables fast queries and individual hackathon management.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-blue-700 mb-1">2. Individual IPFS Storage</h3>
                <p className="text-sm text-blue-600">
                  Each hackathon is stored individually on IPFS with its own hash. 
                  This allows for granular updates and better performance.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-blue-700 mb-1">3. Combined IPNS Record</h3>
                <p className="text-sm text-blue-600">
                  A main IPNS record contains all hackathons for global access, 
                  while individual records enable direct access to specific hackathons.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-3">Benefits of This Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-green-700 mb-2">Performance</h3>
                <p className="text-sm text-green-600">
                  Database queries are much faster than IPFS lookups. 
                  Metadata is instantly available without network calls.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-green-700 mb-2">Individual Management</h3>
                <p className="text-sm text-green-600">
                  Each hackathon can be updated independently without affecting others. 
                  No need to re-upload all hackathons for a single change.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-green-700 mb-2">Search & Filtering</h3>
                <p className="text-sm text-green-600">
                  Database enables complex queries, filtering, and search functionality 
                  that would be impossible with IPFS alone.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-green-700 mb-2">Reliability</h3>
                <p className="text-sm text-green-600">
                  Database provides a reliable fallback if IPFS is temporarily unavailable. 
                  Critical metadata is always accessible.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-3">Database Schema</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-purple-700 mb-1">hackathon_references</h3>
                <p className="text-sm text-purple-600">
                  Stores IPFS/IPNS references for each hackathon with metadata like title, slug, and status.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-purple-700 mb-1">hackathon_metadata</h3>
                <p className="text-sm text-purple-600">
                  Contains hackathon details for fast access without IPFS lookups.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-purple-700 mb-1">ipns_records</h3>
                <p className="text-sm text-purple-600">
                  Manages IPNS records and their current IPFS hashes for version control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
