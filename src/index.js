/**
 * Main Entry Point
 * Starts the Resonance School Data Integration System
 */
import DataIntegrationSystem from './integration-system.js';
import logger from './utils/logger.js';

// Create system instance
const system = new DataIntegrationSystem();

// Handle graceful shutdown
const shutdown = async () => {
  logger.info('Received shutdown signal');
  await system.shutdown();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the system
async function main() {
  try {
    // Initialize system
    await system.initialize();
    
    // Start all components
    await system.start();

    // Example: Register a sample data source (commented out by default)
    // Uncomment and configure to add your own data sources
    /*
    await system.registerDataSource('sample-api', {
      type: 'rest',
      url: 'https://api.example.com/data',
      method: 'GET',
      interval: 10000,
      autoInferSchema: true
    });
    */

    logger.info('System is running. Press Ctrl+C to stop.');
  } catch (error) {
    logger.error('Failed to start system', { error: error.message });
    process.exit(1);
  }
}

main();
