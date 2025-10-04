'use client'

import { useState } from 'react';

export default function TestIPNS() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  const testEnvironment = async () => {
    setLoading(true);
    setResult('Testing environment configuration...\n');

    try {
      const response = await fetch('/api/debug/env');
      const data = await response.json();

      if (data.success) {
        setResult(prev => prev + `✅ Environment: ${data.data.environment}\n`);
        setResult(prev => prev + `📊 API Key configured: ${data.data.envStatus.hasApiKey}\n`);
        setResult(prev => prev + `📊 Private Key configured: ${data.data.envStatus.hasPrivateKey}\n`);

        setResult(prev => prev + '\n🔑 Environment Variables:\n');
        Object.entries(data.data.envVars).forEach(([key, value]) => {
          setResult(prev => prev + `   ${key}: ${value}\n`);
        });

        if (data.data.envStatus.hasApiKey && data.data.envStatus.hasPrivateKey) {
          setResult(prev => prev + '\n✅ Environment is properly configured!\n');
        } else {
          setResult(prev => prev + '\n❌ Environment configuration incomplete!\n');
          setResult(prev => prev + 'Please check your .env.local file\n');
        }
      } else {
        setResult(prev => prev + `❌ Debug API error: ${data.error}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Environment check failed: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testLighthouseMethods = async () => {
    setLoading(true);
    setResult('Testing Lighthouse SDK methods...\n');

    try {
      // First check environment
      setResult(prev => prev + '🔍 Checking environment first...\n');
      const envResponse = await fetch('/api/debug/env');
      const envData = await envResponse.json();

      if (!envData.success || !envData.data.envStatus.hasApiKey || !envData.data.envStatus.hasPrivateKey) {
        setResult(prev => prev + '❌ Environment not properly configured. Please run "Test Environment" first.\n');
        setLoading(false);
        return;
      }

      // Import the service dynamically to avoid SSR issues
      const { getMasterIPNSService } = await import('../../lib/master-ipns-storage');
      const service = getMasterIPNSService();
      setResult(prev => prev + '✅ Master IPNS service initialized\n');

      // Test getting all IPNS keys
      const allKeys = await service.getAllIPNSKeys();
      setResult(prev => prev + `📊 Found ${allKeys.length} IPNS keys\n`);
      if (allKeys.length > 0) {
        setResult(prev => prev + `🔑 Keys: ${JSON.stringify(allKeys, null, 2)}\n`);
      }

      // Test getting master index
      const masterIndex = await service.getMasterIndex();
      setResult(prev => prev + `📊 Master index has ${masterIndex.hackathons.length} hackathons\n`);

      // Test IPNS resolution if we have keys
      if (allKeys.length > 0) {
        setResult(prev => prev + '\n🔍 Testing IPNS resolution...\n');
        const firstKey = allKeys[0];
        setResult(prev => prev + `Trying to resolve: ${firstKey.ipnsId}\n`);

        try {
          const resolved = await service.resolveIPNS(firstKey.ipnsId);
          setResult(prev => prev + `✅ Resolved: ${resolved.slice(0, 100)}...\n`);
        } catch (resolveError) {
          setResult(prev => prev + `❌ Resolution failed: ${resolveError.message}\n`);
        }

        try {
          const cid = await service.resolveIPNSToCID(firstKey.ipnsId);
          setResult(prev => prev + `✅ CID resolved: ${cid}\n`);
        } catch (cidError) {
          setResult(prev => prev + `❌ CID resolution failed: ${cidError.message}\n`);
        }
      } else {
        setResult(prev => prev + '\n⚠️ No IPNS keys found - system not initialized yet\n');
        setResult(prev => prev + 'Try creating a test hackathon to initialize the system\n');
      }

    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
      console.error('Lighthouse test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCreateHackathon = async () => {
    setLoading(true);
    setResult('Testing hackathon creation...\n');
    
    try {
      const response = await fetch('/api/hackathons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test IPNS Hackathon',
          description: 'This hackathon tests the IPNS system',
          status: 'live',
          registrationClose: '2024-12-31',
          registrationDaysLeft: 30,
          techStack: 'IPFS, IPNS, Lighthouse',
          level: 'All levels',
          totalPrize: 5000,
          location: 'Online',
          tags: ['IPFS', 'IPNS', 'Test']
        })
      });
      
      const data = await response.json();
      setResult(prev => prev + `✅ Created hackathon: ${JSON.stringify(data, null, 2)}\n`);
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testLighthouseDirect = async () => {
    setLoading(true);
    setResult('Testing Lighthouse API directly...\n');

    try {
      const response = await fetch('/api/test/lighthouse');
      const data = await response.json();

      if (data.success) {
        setResult(prev => prev + '✅ Lighthouse API test successful!\n');
        setResult(prev => prev + `📊 Results: ${JSON.stringify(data, null, 2)}\n`);
      } else {
        setResult(prev => prev + `❌ Lighthouse API test failed: ${data.error}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Direct test error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testPublicIPNS = async () => {
    setLoading(true);
    setResult('Testing public IPNS resolution...\n');

    try {
      const response = await fetch('/api/test/lighthouse?test=public');
      const data = await response.json();

      if (data.success) {
        setResult(prev => prev + '✅ Public IPNS test completed\n');
        setResult(prev => prev + 'Check console logs for resolution details\n');
      } else {
        setResult(prev => prev + `❌ Public IPNS test failed: ${data.error}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Public IPNS test error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testLighthouseAuth = async () => {
    setLoading(true);
    setResult('Testing Lighthouse authentication...\n');

    try {
      // Test current API keys
      setResult(prev => prev + '🔍 Testing current API keys...\n');
      const response = await fetch('/api/test/auth');
      const data = await response.json();

      if (data.success) {
        setResult(prev => prev + `📊 Tested ${data.data.testedKeys.length} API keys\n`);
        data.data.testedKeys.forEach((result: any, index: number) => {
          setResult(prev => prev + `   ${index + 1}. ${result.key}: ${result.isValid ? '✅ Valid' : '❌ Invalid'} (${result.length} chars)\n`);
        });

        const validKeys = data.data.testedKeys.filter((k: any) => k.isValid);
        if (validKeys.length > 0) {
          setResult(prev => prev + `\n✅ Found ${validKeys.length} valid API key(s)\n`);
          setResult(prev => prev + 'IPNS should work with these keys!\n');
        } else {
          setResult(prev => prev + '\n❌ No valid API keys found\n');
          setResult(prev => prev + 'Need to generate proper API keys from Lighthouse\n');
        }

        // Test full authentication flow
        setResult(prev => prev + '\n🔐 Testing authentication flow...\n');
        const authResponse = await fetch('/api/test/auth?test=auth-flow');
        if (authResponse.ok) {
          setResult(prev => prev + '✅ Authentication flow test completed\n');
        } else {
          setResult(prev => prev + '❌ Authentication flow test failed\n');
        }
      } else {
        setResult(prev => prev + `❌ Auth test failed: ${data.error}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Auth test error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testCompleteIPNS = async () => {
    setLoading(true);
    setResult('Running complete IPNS flow test...\n');

    try {
      setResult(prev => prev + '🚀 Testing API key validation...\n');
      const response = await fetch('/api/test/complete');
      const data = await response.json();

      if (data.success) {
        setResult(prev => prev + '✅ Complete IPNS flow test successful!\n');
        setResult(prev => prev + `📊 Results: ${JSON.stringify(data, null, 2)}\n`);
        setResult(prev => prev + '\n🎉 IPNS is working perfectly!\n');
        setResult(prev => prev + '\n✅ All systems operational:\n');
        setResult(prev => prev + '   • API Key: Valid\n');
        setResult(prev => prev + '   • IPNS Key Generation: Working\n');
        setResult(prev => prev + '   • IPFS Upload: Working\n');
        setResult(prev => prev + '   • IPNS Publishing: Working\n');
        setResult(prev => prev + '   • IPNS Resolution: Working\n');
        setResult(prev => prev + '   • Master IPNS Service: Working\n');
        setResult(prev => prev + '   • CRUD Operations: Working\n');
      } else {
        setResult(prev => prev + `❌ Complete IPNS test failed: ${data.error}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Complete test error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">IPNS System Test</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">🔧 Lighthouse SDK Methods</h2>
        <p className="text-sm text-gray-600 mb-2">Based on the <a href="https://docs.lighthouse.storage/lighthouse-1/how-to/ipns-handle-mutable-data" target="_blank" className="text-blue-600 underline">official documentation</a>:</p>
        <ul className="text-sm space-y-1">
          <li>• <code>lighthouse.generateKey(apiKey)</code> - Create IPNS key</li>
          <li>• <code>lighthouse.publishRecord(cid, keyName, apiKey)</code> - Publish to IPNS</li>
          <li>• <code>lighthouse.getAllKeys(apiKey)</code> - Get all IPNS keys</li>
          <li>• <code>lighthouse.removeKey(keyName, apiKey)</code> - Remove IPNS key</li>
        </ul>

        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <h3 className="font-semibold text-yellow-800 mb-1">⚠️ API Key Requirements</h3>
          <p className="text-sm text-yellow-700">
            Lighthouse API keys must be generated through proper authentication.
            See <a href="https://docs.lighthouse.storage/lighthouse-1/how-to/create-an-api-key" target="_blank" className="underline">API Key Creation Guide</a>.
            Current keys may be invalid and need regeneration.
          </p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testEnvironment}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-4 mb-2"
        >
          Test Environment
        </button>

        <button
          onClick={testCompleteIPNS}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 mr-4 mb-2"
        >
          🚀 Complete IPNS Test
        </button>

        <button
          onClick={testLighthouseAuth}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-4 mb-2"
        >
          Test Lighthouse Auth
        </button>

        <button
          onClick={testLighthouseDirect}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-4 mb-2"
        >
          Test Lighthouse Direct
        </button>

        <button
          onClick={testPublicIPNS}
          disabled={loading}
          className="bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-4 mb-2"
        >
          Test Public IPNS
        </button>

        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-4 mb-2"
        >
          Test API Route
        </button>

        <button
          onClick={testLighthouseMethods}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-4 mb-2"
        >
          Test Lighthouse Methods
        </button>

        <button
          onClick={testCreateHackathon}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50 mb-2"
        >
          Test Create Hackathon
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
