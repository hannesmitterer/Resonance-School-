/**
 * Configuration Module
 * Centralizes all system configuration with validation
 */
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // IPFS Configuration
  ipfs: {
    host: process.env.IPFS_HOST || '127.0.0.1',
    port: parseInt(process.env.IPFS_PORT) || 5001,
    protocol: process.env.IPFS_PROTOCOL || 'http'
  },

  // API Discovery
  apiDiscovery: {
    enabled: process.env.API_DISCOVERY_ENABLED !== 'false',
    interval: parseInt(process.env.API_DISCOVERY_INTERVAL) || 300000,
    validationStrict: process.env.API_VALIDATION_STRICT !== 'false'
  },

  // Real-time Streaming
  streaming: {
    websocket: {
      enabled: process.env.WEBSOCKET_ENABLED !== 'false',
      reconnectInterval: parseInt(process.env.WEBSOCKET_RECONNECT_INTERVAL) || 5000
    },
    rest: {
      enabled: process.env.REST_POLLING_ENABLED !== 'false',
      pollingInterval: parseInt(process.env.REST_POLLING_INTERVAL) || 10000
    }
  },

  // Data Queue
  queue: {
    maxSize: parseInt(process.env.QUEUE_MAX_SIZE) || 10000,
    batchSize: parseInt(process.env.QUEUE_BATCH_SIZE) || 100,
    flushInterval: parseInt(process.env.QUEUE_FLUSH_INTERVAL) || 5000
  },

  // Self-Healing
  recovery: {
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
    autoRecoveryEnabled: process.env.AUTO_RECOVERY_ENABLED !== 'false',
    maxRetryAttempts: parseInt(process.env.MAX_RETRY_ATTEMPTS) || 3,
    retryBackoffMs: parseInt(process.env.RETRY_BACKOFF_MS) || 1000
  },

  // Monitoring
  monitoring: {
    metricsPort: parseInt(process.env.METRICS_PORT) || 9090,
    metricsEnabled: process.env.METRICS_ENABLED !== 'false',
    dashboardPort: parseInt(process.env.DASHBOARD_PORT) || 3000
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/system.log'
  },

  // Resonance School Specific
  resonance: {
    seedbringerTreasury: process.env.SEEDBRINGER_TREASURY || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2'
  }
};

export default config;
