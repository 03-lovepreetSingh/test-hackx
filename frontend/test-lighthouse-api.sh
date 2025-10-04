#!/bin/bash

# Simple script to test Lighthouse API directly
# Run this from the frontend directory

echo "🚀 Testing Lighthouse API Directly..."

# Test 1: Check if we can make a simple API call
echo "1️⃣ Testing Lighthouse API connectivity..."

API_KEY="7d7e1bc7.4b27eb60a60d4a20a71f6f098e96f807"
PRIVATE_KEY="7d7e1bc7.4b27eb60a60d4a20a71f6f098e96f807"

echo "Using API Key: ${API_KEY:0:10}..."

# Test IPNS key generation
echo "2️⃣ Testing IPNS key generation..."
curl -s -X POST "https://api.lighthouse.storage/api/ipns/generate_key" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" | jq .

echo -e "\n3️⃣ Testing IPNS key listing..."
curl -s -X GET "https://api.lighthouse.storage/api/ipns/get_ipns_records" \
  -H "Authorization: Bearer $API_KEY" | jq .

echo -e "\n4️⃣ Testing IPFS upload..."
TEST_DATA='{"test": true, "timestamp": '$(date +%s000)', "message": "Lighthouse API test"}'

curl -s -X POST "https://api.lighthouse.storage/api/v0/add" \
  -H "Authorization: Bearer $API_KEY" \
  -F "file=@-/dev/stdin" <<< "$TEST_DATA" | jq .

echo -e "\n🏁 Lighthouse API test completed!"
echo "Check the responses above to see if the API keys are working properly."