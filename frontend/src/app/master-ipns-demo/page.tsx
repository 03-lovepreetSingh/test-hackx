'use client'

import { useState } from 'react';
import { getMasterIPNSService } from '../../lib/master-ipns-storage';
import { Hackathon } from '../types';

export default function MasterIPNSDemo() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  const testMasterIndex = async () => {
    setLoading(true);
    setResult('Testing Master IPNS Index...\n');
    
    try {
      const service = getMasterIPNSService();
      setResult(prev => prev + '✅ Master IPNS service initialized\n');
      
      // Get master index
      const masterIndex = await service.getMasterIndex();
      setResult(prev => prev + `📊 Master Index: ${JSON.stringify(masterIndex, null, 2)}\n`);
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
      console.error('Master IPNS test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testGetAllHackathons = async () => {
    setLoading(true);
    setResult('Fetching all hackathons from Master IPNS...\n');
    
    try {
      const service = getMasterIPNSService();
      const hackathons = await service.getAllHackathons();
      setHackathons(hackathons);
      setResult(prev => prev + `✅ Found ${hackathons.length} hackathons\n`);
      setResult(prev => prev + JSON.stringify(hackathons, null, 2));
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
      console.error('Get all hackathons error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCreateHackathon = async () => {
    setLoading(true);
    setResult('Creating new hackathon...\n');
    
    try {
      const service = getMasterIPNSService();
      const newHackathon: Hackathon = {
        id: crypto.randomUUID(),
        title: 'Master IPNS Test Hackathon',
        description: 'This hackathon was created using the Master IPNS system',
        status: 'live',
        registrationClose: '2024-12-31',
        registrationDaysLeft: 30,
        techStack: 'IPFS, IPNS, Lighthouse',
        level: 'All levels',
        totalPrize: 10000,
        location: 'Online',
        tags: ['IPFS', 'IPNS', 'Decentralized']
      };

      const hackathonId = await service.createHackathon(newHackathon);
      setResult(prev => prev + `✅ Created hackathon with ID: ${hackathonId}\n`);
      
      // Refresh the list
      await testGetAllHackathons();
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
      console.error('Create hackathon error:', error);
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
      setResult(prev => prev + `✅ API Response: ${JSON.stringify(data, null, 2)}\n`);
    } catch (error) {
      setResult(prev => prev + `❌ API Error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Master IPNS System Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">🏗️ Architecture</h2>
          <ul className="text-sm space-y-1">
            <li>• <strong>Master IPNS</strong>: `/ipns/hackathons-master` (index of all hackathons)</li>
            <li>• <strong>Individual IPNS</strong>: `/ipns/hackathon-{id}` (each hackathon)</li>
            <li>• <strong>No Database</strong>: Pure IPFS/IPNS storage</li>
            <li>• <strong>Decentralized</strong>: All data stored on IPFS</li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">🔄 Data Flow</h2>
          <ol className="text-sm space-y-1">
            <li>1. Master IPNS contains index of all hackathons</li>
            <li>2. Each hackathon has its own IPNS record</li>
            <li>3. Updates modify both individual and master records</li>
            <li>4. No database dependencies</li>
          </ol>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={testMasterIndex}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Master Index
          </button>
          
          <button 
            onClick={testGetAllHackathons}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Get All Hackathons
          </button>
          
          <button 
            onClick={testCreateHackathon}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Create Hackathon
          </button>
          
          <button 
            onClick={testAPI}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test API Route
          </button>
        </div>
      </div>
      
      {hackathons.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">📋 Current Hackathons ({hackathons.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hackathons.map((hackathon) => (
              <div key={hackathon.id} className="border p-4 rounded-lg">
                <h4 className="font-semibold">{hackathon.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{hackathon.description}</p>
                <div className="flex flex-wrap gap-1">
                  {hackathon.tags?.map((tag) => (
                    <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📝 Test Results</h3>
        <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
          {result}
        </pre>
      </div>
    </div>
  );
}
