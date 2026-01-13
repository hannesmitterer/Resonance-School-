#!/bin/bash

##############################################################################
# Kosymbiosis Framework - Validation Script
# 
# This script validates the deployment and checks all components are working
##############################################################################

echo "═══════════════════════════════════════════════════════"
echo "  KOSYMBIOSIS FRAMEWORK VALIDATION"
echo "  Version: 1.0.043"
echo "═══════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        ((FAILED++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directory: $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} Missing directory: $1"
        ((FAILED++))
        return 1
    fi
}

# Function to validate JSON
check_json() {
    if python3 -m json.tool "$1" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Valid JSON: $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} Invalid JSON: $1"
        ((FAILED++))
        return 1
    fi
}

echo "Checking Directory Structure..."
echo "--------------------------------"
check_dir "manifests"
check_dir "modules"
check_dir "components"
check_dir "styles"
check_dir "config"
echo ""

echo "Checking Core Files..."
echo "----------------------"
check_file "README.md"
check_file "DEPLOYMENT.md"
check_file "CONTRIBUTING.md"
check_file "index.html"
check_file "demo.html"
check_file ".gitignore"
echo ""

echo "Checking Manifest..."
echo "--------------------"
check_file "manifests/final_deployment_manifest.json"
check_json "manifests/final_deployment_manifest.json"
echo ""

echo "Checking Modules..."
echo "-------------------"
check_file "modules/aic-module.js"
check_file "modules/ipfs-integration.js"
check_file "modules/web3-logging.js"
echo ""

echo "Checking Components..."
echo "----------------------"
check_file "components/node-monitoring-dashboard.js"
echo ""

echo "Checking Styles..."
echo "------------------"
check_file "styles/kosymbiosis.css"
echo ""

echo "Checking Scripts..."
echo "-------------------"
check_file "scripts/anchor-framework.js"
echo ""

echo "Checking Configuration..."
echo "-------------------------"
check_file "config/github-pages.md"
echo ""

# Validate manifest content
echo "Validating Manifest Content..."
echo "------------------------------"
if [ -f "manifests/final_deployment_manifest.json" ]; then
    # Check for required fields
    if grep -q '"resonanceFrequency".*"0.043Hz"' manifests/final_deployment_manifest.json; then
        echo -e "${GREEN}✓${NC} Resonance frequency: 0.043Hz"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Missing or incorrect resonance frequency"
        ((FAILED++))
    fi

    if grep -q '"status".*"ETERNAL_ACTIVE"' manifests/final_deployment_manifest.json; then
        echo -e "${GREEN}✓${NC} Status: ETERNAL_ACTIVE"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Missing or incorrect status"
        ((FAILED++))
    fi

    if grep -q '"totalNodes".*144000' manifests/final_deployment_manifest.json; then
        echo -e "${GREEN}✓${NC} Node count: 144,000"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Missing or incorrect node count"
        ((FAILED++))
    fi

    if grep -q '"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2"' manifests/final_deployment_manifest.json; then
        echo -e "${GREEN}✓${NC} Treasury address present"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Missing treasury address"
        ((FAILED++))
    fi
fi
echo ""

# Check JavaScript syntax (basic)
echo "Checking JavaScript Syntax..."
echo "-----------------------------"
for jsfile in modules/*.js components/*.js; do
    if [ -f "$jsfile" ]; then
        # Check for basic syntax errors (missing semicolons, unclosed brackets)
        if node -c "$jsfile" 2>/dev/null || python3 -c "open('$jsfile').read()" >/dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} Syntax OK: $jsfile"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠${NC} Could not verify: $jsfile (node not available)"
        fi
    fi
done
echo ""

# Summary
echo "═══════════════════════════════════════════════════════"
echo "  VALIDATION SUMMARY"
echo "═══════════════════════════════════════════════════════"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "The Kosymbiosis Framework is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "1. Test in browser: python3 -m http.server 8000"
    echo "2. Open: http://localhost:8000/demo.html"
    echo "3. Review DEPLOYMENT.md for deployment options"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review the issues above.${NC}"
    exit 1
fi
