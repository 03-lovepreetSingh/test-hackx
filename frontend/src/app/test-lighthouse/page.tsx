'use client';

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { runLighthouseTests } from '../../lib/test-lighthouse';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TestLighthousePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    setTestResult(null);
    
    try {
      const result = await runLighthouseTests();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Test execution failed'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Lighthouse Integration Test</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Lighthouse Storage Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This test will verify that the Lighthouse storage integration is working correctly.
              It will test creating, reading, updating, and deleting hackathon data using IPFS and IPNS.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Prerequisites:</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                <li>Lighthouse API key must be set in environment variables</li>
                <li>Lighthouse private key must be set in environment variables</li>
                <li>Internet connection is required</li>
              </ul>
            </div>
            
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run Lighthouse Tests'
              )}
            </Button>
          </CardContent>
        </Card>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {testResult.success ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Tests Passed
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    Tests Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Result:</h3>
                  <p className={`p-3 rounded ${
                    testResult.success 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {testResult.message}
                  </p>
                </div>
                
                {testResult.ipns && (
                  <div>
                    <h3 className="font-semibold mb-2">IPNS:</h3>
                    <code className="bg-gray-100 p-2 rounded text-sm">
                      {testResult.ipns}
                    </code>
                  </div>
                )}
                
                {testResult.error && (
                  <div>
                    <h3 className="font-semibold mb-2">Error Details:</h3>
                    <code className="bg-red-50 p-2 rounded text-sm text-red-800">
                      {testResult.error}
                    </code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What This Test Does</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Initialize Storage:</strong> Creates a new IPNS record for hackathon data</li>
              <li><strong>Create Hackathon:</strong> Uploads a test hackathon to IPFS and updates IPNS</li>
              <li><strong>Read Hackathons:</strong> Retrieves all hackathons from IPNS/IPFS</li>
              <li><strong>Get Specific Hackathon:</strong> Fetches a single hackathon by ID</li>
              <li><strong>Update Hackathon:</strong> Modifies hackathon data and updates IPNS</li>
              <li><strong>Verify Update:</strong> Confirms the update was successful</li>
              <li><strong>Delete Hackathon:</strong> Removes hackathon from the data</li>
              <li><strong>Verify Deletion:</strong> Confirms the hackathon was deleted</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
