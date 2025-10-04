'use client'

import { useState } from 'react';

export default function SimpleTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testMasterIPNS = async () => {
    setLoading(true);
    setResult('Testing Master IPNS Service...\n');
    
    try {
      const { getMasterIPNSService } = await import('../../lib/master-ipns-storage');
      const service = getMasterIPNSService();
      setResult(prev => prev + '✅ Service initialized\n');
      
      // Test getting all keys
      const keys = await service.getAllIPNSKeys();
      setResult(prev => prev + `📊 IPNS Keys: ${JSON.stringify(keys, null, 2)}\n`);
      
      // Test getting master index
      const masterIndex = await service.getMasterIndex();
      setResult(prev => prev + `📊 Master Index: ${JSON.stringify(masterIndex, null, 2)}\n`);
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
      console.error('Master IPNS test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simple Master IPNS Test</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testMasterIPNS}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Master IPNS Service
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📝 Test Results</h3>
        <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
          {result}
        </pre>
      </div>
    </div>
  );
}
