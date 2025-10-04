'use client'

import { useState } from 'react';
import { getLighthouseService } from '../../lib/lighthouse-storage';

export default function TestLighthouseAPI() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLighthouse = async () => {
    setLoading(true);
    setResult('Testing Lighthouse service...\n');
    
    try {
      const service = getLighthouseService();
      setResult(prev => prev + 'Lighthouse service initialized successfully\n');
      
      // Test getting hackathons from IPNS
      const hackathons = await service.getAllHackathons('hackathons');
      setResult(prev => prev + `Found ${hackathons.length} hackathons from IPFS\n`);
      setResult(prev => prev + JSON.stringify(hackathons, null, 2));
      
    } catch (error) {
      setResult(prev => prev + `Error: ${error}\n`);
      console.error('Lighthouse test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing API route...\n');
    
    try {
      const response = await fetch('/api/hackathons');
      const data = await response.json();
      setResult(prev => prev + `API Response: ${JSON.stringify(data, null, 2)}\n`);
    } catch (error) {
      setResult(prev => prev + `API Error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lighthouse API Test</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testLighthouse}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Lighthouse Service
        </button>
        
        <button 
          onClick={testAPI}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test API Route
        </button>
      </div>
      
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
        {result}
      </pre>
    </div>
  );
}
