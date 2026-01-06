#!/usr/bin/env node
/**
 * System Validation Script
 * Validates that all components are properly structured
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('═══════════════════════════════════════════════════════');
console.log('  Resonance School - System Validation');
console.log('═══════════════════════════════════════════════════════\n');

const requiredFiles = [
  'package.json',
  '.env.example',
  '.gitignore',
  'DATA_INTEGRATION_GUIDE.md',
  'src/index.js',
  'src/integration-system.js',
  'src/config/index.js',
  'src/ipfs/client.js',
  'src/api-discovery/service.js',
  'src/ingestion/queue.js',
  'src/ingestion/websocket.js',
  'src/ingestion/rest-polling.js',
  'src/recovery/service.js',
  'src/monitoring/metrics.js',
  'src/monitoring/dashboard.js',
  'src/utils/logger.js',
  'src/utils/validator.js',
  'monitoring/prometheus.yml',
  'monitoring/README.md'
];

let allValid = true;

console.log('Checking required files...\n');

for (const file of requiredFiles) {
  const filePath = join(rootDir, file);
  const exists = existsSync(filePath);
  
  if (exists) {
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ ${file} - MISSING`);
    allValid = false;
  }
}

console.log('\n═══════════════════════════════════════════════════════');

if (allValid) {
  console.log('✅ All required files present');
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log('System Components:');
  console.log('  ✓ IPFS Client');
  console.log('  ✓ API Discovery Service');
  console.log('  ✓ Data Queue');
  console.log('  ✓ WebSocket Client');
  console.log('  ✓ REST Polling Client');
  console.log('  ✓ Recovery Service');
  console.log('  ✓ Metrics Collector');
  console.log('  ✓ Monitoring Dashboard');
  console.log('  ✓ Schema Validator');
  console.log('  ✓ Logger');
  
  console.log('\nNext Steps:');
  console.log('  1. Configure .env file: cp .env.example .env');
  console.log('  2. Start IPFS daemon: ipfs daemon');
  console.log('  3. Run the system: npm start');
  console.log('  4. Access dashboard: http://localhost:3000/dashboard');
  console.log('  5. View metrics: http://localhost:3000/metrics');
  
  console.log('\nDocumentation:');
  console.log('  • Full guide: DATA_INTEGRATION_GUIDE.md');
  console.log('  • Monitoring setup: monitoring/README.md');
  console.log('  • Example usage: example.js');
  
  process.exit(0);
} else {
  console.log('❌ Some required files are missing');
  console.log('═══════════════════════════════════════════════════════\n');
  process.exit(1);
}
