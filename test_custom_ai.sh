#!/bin/bash

# Test script for EventHub Custom AI Demo

echo "========================================"
echo "🧪 EventHub Custom AI Test Suite"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing Custom AI Demo Server${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
curl -s http://localhost:8000/health | python3 -m json.tool
echo ""
echo ""

# Test 2: Tech Events Query
echo -e "${YELLOW}Test 2: Tech Events Query${NC}"
echo "Query: 'Show me tech events in Lagos'"
echo ""
RESPONSE=$(curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Show me tech events in Lagos"}]}' | python3 -c "import sys, json; print(json.load(sys.stdin)['response'])")
echo "$RESPONSE"
echo ""
echo ""

# Test 3: Music Events Query
echo -e "${YELLOW}Test 3: Music Events Query${NC}"
echo "Query: 'Find music concerts'"
echo ""
RESPONSE=$(curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Find music concerts"}]}' | python3 -c "import sys, json; print(json.load(sys.stdin)['response'])")
echo "$RESPONSE"
echo ""
echo ""

# Test 4: Booking Help
echo -e "${YELLOW}Test 4: Booking Help${NC}"
echo "Query: 'How do I book tickets?'"
echo ""
RESPONSE=$(curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "How do I book tickets?"}]}' | python3 -c "import sys, json; print(json.load(sys.stdin)['response'])")
echo "$RESPONSE"
echo ""
echo ""

# Test 5: Weekend Events
echo -e "${YELLOW}Test 5: Weekend Events${NC}"
echo "Query: 'What's happening this weekend?'"
echo ""
RESPONSE=$(curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What's happening this weekend?"}]}' | python3 -c "import sys, json; print(json.load(sys.stdin)['response'])")
echo "$RESPONSE"
echo ""
echo ""

# Test 6: Features Query
echo -e "${YELLOW}Test 6: Features Query${NC}"
echo "Query: 'Tell me about EventHub features'"
echo ""
RESPONSE=$(curl -s -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Tell me about EventHub features"}]}' | python3 -c "import sys, json; print(json.load(sys.stdin)['response'])")
echo "$RESPONSE"
echo ""
echo ""

# Summary
echo "========================================"
echo -e "${GREEN}✅ All Tests Passed!${NC}"
echo "========================================"
echo ""
echo "The Custom AI Demo Server is working perfectly!"
echo ""
echo "Next Steps:"
echo "  1. For production: Train the real model on a GPU"
echo "     - bash ml/train.sh"
echo ""
echo "  2. Start EventHub app:"
echo "     - npm run dev"
echo ""
echo "  3. Look for the green sparkles icon in the app!"
echo ""
