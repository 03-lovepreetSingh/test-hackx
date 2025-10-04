'use client'

import { useState } from 'react';

export default function TestLighthouseDirect() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLighthouseAPI = async () => {
    setLoading(true);
    setResult('Testing Lighthouse API directly...\n');
    
    try {
      // Test the Lighthouse API key directly
      const response = await fetch('https://api.lighthouse.storage/api/ipns/get_ipns_records', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(prev => prev + `✅ Lighthouse API working! Keys: ${JSON.stringify(data, null, 2)}\n`);
      } else {
        setResult(prev => prev + `❌ Lighthouse API error: ${response.status} ${response.statusText}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testEnvironmentVariables = () => {
    setResult('Environment Variables:\n');
    setResult(prev => prev + `API Key: ${process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY}\n`);
    setResult(prev => prev + `Private Key: ${process.env.LIGHTHOUSE_PRIVATE_KEY}\n`);
  };

  const testMasterIPNSService = async () => {
    setLoading(true);
    setResult('Testing Master IPNS Service...\n');
    
    try {
      const { getMasterIPNSService } = await import('../../lib/master-ipns-storage');
      const service = getMasterIPNSService();
      setResult(prev => prev + '✅ Service initialized\n');
      
      // Test getting all keys
      const keys = await service.getAllIPNSKeys();
      setResult(prev => prev + `📊 IPNS Keys: ${JSON.stringify(keys, null, 2)}\n`);
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
      console.error('Master IPNS test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Direct Lighthouse API Test</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testEnvironmentVariables}
          className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
        >
          Check Environment Variables
        </button>
        
        <button 
          onClick={testLighthouseAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-4"
        >
          Test Lighthouse API Direct
        </button>
        
        <button 
          onClick={testMasterIPNSService}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
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
