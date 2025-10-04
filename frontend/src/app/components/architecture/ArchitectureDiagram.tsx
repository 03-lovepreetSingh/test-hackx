import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ArchitectureDiagram() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lighthouse Integration Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* High Level Architecture */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">High-Level Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 p-3 rounded">
                  <h4 className="font-medium text-blue-800">React UI Layer</h4>
                  <ul className="text-sm text-blue-700 mt-1">
                    <li>• Components</li>
                    <li>• Hooks</li>
                    <li>• State Management</li>
                  </ul>
                </div>
                <div className="bg-green-100 p-3 rounded">
                  <h4 className="font-medium text-green-800">Lighthouse SDK</h4>
                  <ul className="text-sm text-green-700 mt-1">
                    <li>• Upload/Download</li>
                    <li>• IPNS Management</li>
                    <li>• Error Handling</li>
                  </ul>
                </div>
                <div className="bg-purple-100 p-3 rounded">
                  <h4 className="font-medium text-purple-800">IPFS Network</h4>
                  <ul className="text-sm text-purple-700 mt-1">
                    <li>• Distributed Storage</li>
                    <li>• Immutable Content</li>
                    <li>• Global Access</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Flow */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Data Flow</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="bg-blue-200 px-3 py-1 rounded">User Action</span>
                <span className="text-gray-500">→</span>
                <span className="bg-green-200 px-3 py-1 rounded">React Hook</span>
                <span className="text-gray-500">→</span>
                <span className="bg-yellow-200 px-3 py-1 rounded">Lighthouse Service</span>
                <span className="text-gray-500">→</span>
                <span className="bg-purple-200 px-3 py-1 rounded">IPFS Upload</span>
                <span className="text-gray-500">→</span>
                <span className="bg-red-200 px-3 py-1 rounded">IPNS Update</span>
                <span className="text-gray-500">→</span>
                <span className="bg-indigo-200 px-3 py-1 rounded">UI Update</span>
              </div>
            </div>

            {/* CRUD Operations */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">CRUD Operations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                  <h4 className="font-medium text-green-800">CREATE</h4>
                  <p className="text-sm text-green-700">Upload to IPFS → Update IPNS</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <h4 className="font-medium text-blue-800">READ</h4>
                  <p className="text-sm text-blue-700">Resolve IPNS → Download from IPFS</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  <h4 className="font-medium text-yellow-800">UPDATE</h4>
                  <p className="text-sm text-yellow-700">Get current data → Modify → Upload → Update IPNS</p>
                </div>
                <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                  <h4 className="font-medium text-red-800">DELETE</h4>
                  <p className="text-sm text-red-700">Remove from data → Upload → Update IPNS</p>
                </div>
              </div>
            </div>

            {/* IPFS vs IPNS */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">IPFS vs IPNS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-medium text-blue-800 mb-2">IPFS (InterPlanetary File System)</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Content-addressed storage</li>
                    <li>• Immutable content</li>
                    <li>• Distributed across nodes</li>
                    <li>• Hash-based identification</li>
                    <li>• Example: QmHash123...</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-medium text-green-800 mb-2">IPNS (InterPlanetary Name System)</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Human-readable names</li>
                    <li>• Mutable references</li>
                    <li>• Points to IPFS hashes</li>
                    <li>• Can be updated</li>
                    <li>• Example: "hackathons"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Benefits</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-green-100 p-2 rounded text-center">
                  <span className="text-sm font-medium text-green-800">Decentralized</span>
                </div>
                <div className="bg-blue-100 p-2 rounded text-center">
                  <span className="text-sm font-medium text-blue-800">Immutable</span>
                </div>
                <div className="bg-purple-100 p-2 rounded text-center">
                  <span className="text-sm font-medium text-purple-800">Global Access</span>
                </div>
                <div className="bg-yellow-100 p-2 rounded text-center">
                  <span className="text-sm font-medium text-yellow-800">Cost Effective</span>
                </div>
                <div className="bg-red-100 p-2 rounded text-center">
                  <span className="text-sm font-medium text-red-800">Censorship Resistant</span>
                </div>
                <div className="bg-indigo-100 p-2 rounded text-center">
                  <span className="text-sm font-medium text-indigo-800">Version History</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
