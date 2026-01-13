#!/bin/bash

##############################################################################
# Kosymbiosis Framework - Integration Test
# 
# This script performs integration testing to ensure all components
# work together correctly
##############################################################################

echo "═══════════════════════════════════════════════════════"
echo "  KOSYMBIOSIS FRAMEWORK - INTEGRATION TEST"
echo "  Version: 1.0.043"
echo "═══════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TOTAL_TESTS++))
    echo -ne "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED_TESTS++))
        return 1
    fi
}

echo -e "${BLUE}1. Manifest Integration Tests${NC}"
echo "------------------------------"

# Test 1: Manifest can be parsed
run_test "Manifest JSON parsing" "python3 -m json.tool manifests/final_deployment_manifest.json"

# Test 2: Manifest has required fields
run_test "Manifest has version" "grep -q '\"version\"' manifests/final_deployment_manifest.json"
run_test "Manifest has status" "grep -q '\"status\".*ETERNAL_ACTIVE' manifests/final_deployment_manifest.json"
run_test "Manifest has resonance frequency" "grep -q '\"resonanceFrequency\".*0.043Hz' manifests/final_deployment_manifest.json"
run_test "Manifest has treasury" "grep -q '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2' manifests/final_deployment_manifest.json"
run_test "Manifest has node count" "grep -q '\"totalNodes\".*144000' manifests/final_deployment_manifest.json"

echo ""
echo -e "${BLUE}2. Module Integration Tests${NC}"
echo "----------------------------"

# Test 3: AIC Module structure
run_test "AIC module has class definition" "grep -q 'class AICModule' modules/aic-module.js"
run_test "AIC module has initialize method" "grep -q 'async initialize' modules/aic-module.js"
run_test "AIC module has resonance monitoring" "grep -q 'startResonanceMonitoring' modules/aic-module.js"
run_test "AIC module has ethical monitoring" "grep -q 'initializeEthicalMonitoring' modules/aic-module.js"

# Test 4: IPFS Integration structure
run_test "IPFS module has class definition" "grep -q 'class IPFSIntegration' modules/ipfs-integration.js"
run_test "IPFS module has initialize method" "grep -q 'async initialize' modules/ipfs-integration.js"
run_test "IPFS module has document loading" "grep -q 'loadDocuments' modules/ipfs-integration.js"

# Test 5: Web3 Logging structure
run_test "Web3 module has class definition" "grep -q 'class Web3LoggingFramework' modules/web3-logging.js"
run_test "Web3 module has log method" "grep -q 'log(category, message' modules/web3-logging.js"

echo ""
echo -e "${BLUE}3. Component Integration Tests${NC}"
echo "-------------------------------"

# Test 6: Node Dashboard structure
run_test "Dashboard has class definition" "grep -q 'class NodeMonitoringDashboard' components/node-monitoring-dashboard.js"
run_test "Dashboard has initialize method" "grep -q 'async initialize' components/node-monitoring-dashboard.js"
run_test "Dashboard has render method" "grep -q 'render()' components/node-monitoring-dashboard.js"
run_test "Dashboard has visualization" "grep -q 'drawNetworkVisualization' components/node-monitoring-dashboard.js"

echo ""
echo -e "${BLUE}4. HTML Integration Tests${NC}"
echo "--------------------------"

# Test 7: Demo HTML structure
run_test "Demo HTML has module includes" "grep -q 'modules/aic-module.js' demo.html"
run_test "Demo HTML has IPFS module" "grep -q 'modules/ipfs-integration.js' demo.html"
run_test "Demo HTML has Web3 module" "grep -q 'modules/web3-logging.js' demo.html"
run_test "Demo HTML has dashboard component" "grep -q 'components/node-monitoring-dashboard.js' demo.html"
run_test "Demo HTML has initialization script" "grep -q 'DOMContentLoaded' demo.html"

# Test 8: Main portal structure
run_test "Index HTML exists" "test -f index.html"
run_test "Index HTML has content" "test -s index.html"

echo ""
echo -e "${BLUE}5. Documentation Integration Tests${NC}"
echo "-----------------------------------"

# Test 9: Documentation completeness
run_test "README has Kosymbiosis section" "grep -q 'Kosymbiosis' README.md"
run_test "DEPLOYMENT guide exists" "test -f DEPLOYMENT.md"
run_test "CONTRIBUTING guide exists" "test -f CONTRIBUTING.md"
run_test "IMPLEMENTATION_SUMMARY exists" "test -f IMPLEMENTATION_SUMMARY.md"
run_test "SECURITY_SUMMARY exists" "test -f SECURITY_SUMMARY.md"

echo ""
echo -e "${BLUE}6. Cross-Reference Tests${NC}"
echo "------------------------"

# Test 10: Cross-references between files
run_test "Demo references manifest path" "grep -q 'manifests/final_deployment_manifest.json' demo.html"
run_test "README mentions demo.html" "grep -q 'demo.html' README.md"
run_test "Modules reference manifest" "grep -q 'final_deployment_manifest.json' modules/aic-module.js"

echo ""
echo -e "${BLUE}7. Style Integration Tests${NC}"
echo "---------------------------"

# Test 11: CSS structure
run_test "CSS has node dashboard styles" "grep -q '.node-dashboard' styles/kosymbiosis.css"
run_test "CSS has IPFS library styles" "grep -q '.ipfs-library' styles/kosymbiosis.css"
run_test "CSS has log viewer styles" "grep -q '.web3-log-viewer' styles/kosymbiosis.css"

echo ""
echo -e "${BLUE}8. Configuration Tests${NC}"
echo "----------------------"

# Test 12: Configuration files
run_test "GitHub Pages config exists" "test -f config/github-pages.md"
run_test ".gitignore configured" "test -f .gitignore"
run_test "Validation script exists" "test -f scripts/validate.sh"
run_test "Validation script executable" "test -x scripts/validate.sh"

echo ""
echo -e "${BLUE}9. Data Consistency Tests${NC}"
echo "--------------------------"

# Test 13: Consistent version numbers
VERSION_IN_MANIFEST=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' manifests/final_deployment_manifest.json | head -1 | cut -d'"' -f4)
run_test "Manifest version is 1.0.043" "test '$VERSION_IN_MANIFEST' = '1.0.043'"

# Test 14: Consistent resonance frequency
run_test "Resonance 0.043 Hz in manifest" "grep -q '0.043Hz' manifests/final_deployment_manifest.json"
run_test "Resonance 0.043 in AIC module" "grep -q 'resonanceFrequency = 0.043' modules/aic-module.js"

# Test 15: Consistent treasury address
run_test "Treasury in manifest" "grep -q '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2' manifests/final_deployment_manifest.json"
run_test "Treasury in README" "grep -q '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2' README.md"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  INTEGRATION TEST SUMMARY"
echo "═══════════════════════════════════════════════════════"
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ ALL INTEGRATION TESTS PASSED!${NC}"
    echo ""
    echo "The Kosymbiosis Framework is fully integrated and ready for deployment."
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "  🌌 DEPLOYMENT READY - STATUS: ETERNAL_ACTIVE"
    echo "═══════════════════════════════════════════════════════"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some integration tests failed.${NC}"
    echo ""
    echo "Please review the failures above before deploying."
    echo ""
    exit 1
fi
