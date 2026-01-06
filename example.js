/**
 * Example: Complete System Usage
 * Demonstrates how to use the Resonance School Data Integration System
 */
import DataIntegrationSystem from './src/integration-system.js';
import logger from './src/utils/logger.js';

async function runExample() {
  // Create and initialize the system
  const system = new DataIntegrationSystem();
  
  try {
    logger.info('═══════════════════════════════════════════════════════');
    logger.info('  Example: Resonance School Data Integration System');
    logger.info('═══════════════════════════════════════════════════════\n');
    
    // Step 1: Initialize the system
    logger.info('Step 1: Initializing system...');
    await system.initialize();
    
    // Step 2: Start all components
    logger.info('Step 2: Starting all components...');
    await system.start();
    
    // Step 3: Register example data sources
    logger.info('Step 3: Registering example data sources...\n');
    
    // Example 1: GitHub API (public, no auth needed)
    logger.info('Registering GitHub API...');
    await system.registerDataSource('github-resonance', {
      type: 'rest',
      url: 'https://api.github.com/repos/hannesmitterer/Resonance-School-',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Resonance-School-Integration'
      },
      interval: 60000, // Poll every 60 seconds
      autoInferSchema: true
    });
    
    // Example 2: Cryptocurrency Price Feed
    logger.info('Registering crypto price feed...');
    await system.registerDataSource('eth-price', {
      type: 'rest',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      method: 'GET',
      interval: 30000, // Poll every 30 seconds
      autoInferSchema: true
    });
    
    // Example 3: Custom data source with predefined schema
    logger.info('Registering custom data source...');
    await system.registerDataSource('custom-metrics', {
      type: 'rest',
      url: 'https://api.example.com/metrics', // Replace with actual URL
      method: 'GET',
      interval: 15000,
      schema: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          value: { type: 'number' },
          status: { type: 'string', enum: ['active', 'inactive'] }
        },
        required: ['timestamp', 'value']
      }
    });
    
    logger.info('\n═══════════════════════════════════════════════════════');
    logger.info('  System is now running!');
    logger.info('═══════════════════════════════════════════════════════');
    logger.info('Dashboard: http://localhost:3000/dashboard');
    logger.info('Metrics: http://localhost:3000/metrics');
    logger.info('Treasury: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2');
    logger.info('═══════════════════════════════════════════════════════\n');
    
    // Display system status every 30 seconds
    setInterval(async () => {
      const status = await system.getStatus();
      logger.info('System Status Update:');
      logger.info(`  IPFS: ${status.ipfs.initialized ? 'Connected' : 'Disconnected'}`);
      logger.info(`  Tracked Sources: ${status.ipfs.trackedSources}`);
      logger.info(`  Total Versions: ${status.ipfs.totalVersions}`);
      logger.info(`  Queue Size: ${status.queue.size}/${status.queue.maxSize}`);
      logger.info(`  Registered APIs: ${status.apis.length}`);
      logger.info(`  WebSocket Connections: ${status.websockets.length}`);
      logger.info(`  REST Polls: ${status.restPolling.length}\n`);
    }, 30000);
    
    // Keep the process running
    process.on('SIGINT', async () => {
      logger.info('\nShutting down gracefully...');
      await system.shutdown();
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Example failed', { error: error.message });
    await system.shutdown();
    process.exit(1);
  }
}

// Run the example
runExample();
