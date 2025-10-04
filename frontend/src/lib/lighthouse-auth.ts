/**
 * Lighthouse API authentication and key generation
 * Based on: https://docs.lighthouse.storage/lighthouse-1/how-to/create-an-api-key
 */

export interface LighthouseAuthResponse {
  success: boolean;
  data?: {
    message: string;
    signature?: string;
    apiKey?: string;
  };
  error?: string;
}

/**
 * Step 1: Get authentication message from Lighthouse
 */
export async function getAuthMessage(publicKey: string): Promise<LighthouseAuthResponse> {
  try {
    const response = await fetch('https://api.lighthouse.storage/api/v0/auth/get_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicKey: publicKey
      })
    });

    const data = await response.json();

    if (response.ok && data.data) {
      return {
        success: true,
        data: {
          message: data.data.message
        }
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to get auth message'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * Step 2: Sign the authentication message and get API key
 * Note: This would typically be done in a browser with a wallet like MetaMask
 */
export async function signAndGetAPIKey(
  message: string,
  signature: string,
  publicKey: string
): Promise<LighthouseAuthResponse> {
  try {
    const response = await fetch('https://api.lighthouse.storage/api/v0/auth/verify_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signedMessage: signature,
        publicKey: publicKey
      })
    });

    const data = await response.json();

    if (response.ok && data.data) {
      return {
        success: true,
        data: {
          apiKey: data.data.apiKey,
          signature: signature
        }
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to verify signature'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error.message}`
    };
  }
}

/**
 * Simple API key validation test
 */
export async function validateAPIKey(apiKey: string): Promise<boolean> {
  try {
    // Test with a simple API call that doesn't require credits
    const response = await fetch('https://api.lighthouse.storage/api/v0/user/api_key_limit', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
}

/**
 * Generate a test Ethereum key pair for development
 */
export function generateTestKeyPair(): { publicKey: string; privateKey: string } {
  // This is a simplified approach for testing
  // In production, you should use a proper wallet library
  const testPublicKey = '0x42785cf8870C9851eDD5a8cEE0303CbE3FED9419';
  const testPrivateKey = '7d7e1bc7.4b27eb60a60d4a20a71f6f098e96f807';

  return {
    publicKey: testPublicKey,
    privateKey: testPrivateKey
  };
}

/**
 * Complete authentication flow test
 */
export async function testLighthouseAuth(): Promise<void> {
  console.log('🔐 Testing Lighthouse Authentication Flow...\n');

  try {
    // Generate test key pair
    const { publicKey, privateKey } = generateTestKeyPair();
    console.log('1️⃣ Using test public key:', publicKey);

    // Step 1: Get auth message
    console.log('\n2️⃣ Getting authentication message...');
    const authResponse = await getAuthMessage(publicKey);

    if (authResponse.success && authResponse.data?.message) {
      console.log('✅ Auth message received:', authResponse.data.message);

      // Step 2: In a real scenario, user would sign this message with their wallet
      // For testing, we'll use a placeholder signature
      console.log('\n3️⃣ In production: User would sign the message with their wallet');
      console.log('   For now, we need a real signature to get an API key');

      // Try to validate if we have a working API key
      console.log('\n4️⃣ Testing existing API key format...');
      const possibleKeys = [
        '7d7e1bc7.4b27eb60a60d4a20a71f6f098e96f807', // Current format
        '0x42785cf8870C9851eDD5a8cEE0303CbE3FED9419', // Ethereum address format
      ];

      for (const key of possibleKeys) {
        console.log(`\n   Testing API key: ${key.slice(0, 10)}...`);
        const isValid = await validateAPIKey(key);
        console.log(`   Result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      }

    } else {
      console.log('❌ Failed to get auth message:', authResponse.error);
    }

  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
}