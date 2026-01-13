/**
 * Main Data Integration System
 * Orchestrates all components for automated live data integration
 */
import IPFSClient from './ipfs/client.js';
import APIDiscoveryService from './api-discovery/service.js';
import DataQueue from './ingestion/queue.js';
import WebSocketClient from './ingestion/websocket.js';
import RESTPollingClient from './ingestion/rest-polling.js';
import RecoveryService from './recovery/service.js';
import MetricsCollector from './monitoring/metrics.js';
import MonitoringDashboard from './monitoring/dashboard.js';
import logger from './utils/logger.js';
import config from './config/index.js';

class DataIntegrationSystem {
  constructor() {
    this.ipfsClient = new IPFSClient();
    this.apiDiscovery = new APIDiscoveryService();
    this.dataQueue = new DataQueue();
    this.websocketClient = null;
    this.restClient = null;
    this.recoveryService = null;
    this.metricsCollector = new MetricsCollector();
    this.dashboard = null;
    this.initialized = false;
  }

  /**
   * Initialize the entire system
   */
  async initialize() {
    try {
      logger.info('═══════════════════════════════════════════════════════');
      logger.info('  RESONANCE SCHOOL - DATA INTEGRATION SYSTEM');
      logger.info('═══════════════════════════════════════════════════════');
      logger.info('Initializing automated data integration system...');

      // Initialize IPFS
      logger.info('Initializing IPFS client...');
      await this.ipfsClient.initialize();

      // Initialize components that depend on IPFS
      this.websocketClient = new WebSocketClient(this.dataQueue, this.apiDiscovery);
      this.restClient = new RESTPollingClient(this.dataQueue, this.apiDiscovery);
      this.recoveryService = new RecoveryService(
        this.ipfsClient,
        this.apiDiscovery,
        this.websocketClient,
        this.restClient
      );
      
      this.dashboard = new MonitoringDashboard(
        this.metricsCollector,
        this.ipfsClient,
        this.apiDiscovery,
        this.recoveryService
      );

      // Setup queue flush handler to store data in IPFS
      this.dataQueue.onFlush(async (batch) => {
        await this.processBatch(batch);
      });

      this.initialized = true;
      logger.info('System initialization completed successfully');
      logger.info('═══════════════════════════════════════════════════════\n');
      
      return true;
    } catch (error) {
      logger.error('System initialization failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Start all system components
   */
  async start() {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }

    logger.info('Starting all system components...');

    // Start data queue
    this.dataQueue.start();

    // Start API discovery
    this.apiDiscovery.start();

    // Start recovery service
    this.recoveryService.start();

    // Start monitoring dashboard
    this.dashboard.start();

    logger.info('═══════════════════════════════════════════════════════');
    logger.info('  SYSTEM OPERATIONAL');
    logger.info('═══════════════════════════════════════════════════════');
    logger.info(`Dashboard: http://localhost:${config.monitoring.dashboardPort}/dashboard`);
    logger.info(`Metrics: http://localhost:${config.monitoring.dashboardPort}/metrics`);
    logger.info(`Treasury: ${config.resonance.seedbringerTreasury}`);
    logger.info('═══════════════════════════════════════════════════════\n');
  }

  /**
   * Register a data source for monitoring
   * @param {string} sourceId - Unique source identifier
   * @param {Object} sourceConfig - Source configuration
   */
  async registerDataSource(sourceId, sourceConfig) {
    logger.info('Registering data source', { sourceId });

    try {
      // Register with API discovery
      await this.apiDiscovery.registerAPI(sourceId, {
        url: sourceConfig.url,
        method: sourceConfig.method,
        headers: sourceConfig.headers,
        openApiUrl: sourceConfig.openApiUrl,
        autoInferSchema: sourceConfig.autoInferSchema !== false
      });

      // Setup streaming based on type
      if (sourceConfig.type === 'websocket') {
        this.websocketClient.connect(sourceId, sourceConfig.wsUrl, sourceConfig.wsOptions);
      } else if (sourceConfig.type === 'rest' || !sourceConfig.type) {
        this.restClient.startPolling(sourceId, {
          url: sourceConfig.url,
          method: sourceConfig.method,
          headers: sourceConfig.headers,
          interval: sourceConfig.interval
        });
      }

      logger.info('Data source registered successfully', { sourceId });
      return true;
    } catch (error) {
      logger.error('Failed to register data source', { 
        sourceId, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Process a batch of data
   * @param {Array} batch - Batch of data items
   */
  async processBatch(batch) {
    logger.info('Processing data batch', { size: batch.length });

    for (const item of batch) {
      try {
        // Validate data if schema exists
        if (this.apiDiscovery) {
          const validation = this.apiDiscovery.validateResponse(item.source, item.data);
          this.metricsCollector.recordValidation(item.source, validation.valid);
          
          if (!validation.valid && config.apiDiscovery.validationStrict) {
            logger.warn('Skipping invalid data', { 
              source: item.source,
              errors: validation.errors 
            });
            continue;
          }
        }

        // Store in IPFS
        const result = await this.ipfsClient.storeData(item.data, {
          source: item.source,
          type: item.type,
          receivedAt: item.receivedAt
        });

        this.metricsCollector.recordIPFSStore(item.source, true);
        this.metricsCollector.updateCIDVersions(
          item.source, 
          this.ipfsClient.getCIDHistory(item.source).length
        );

        logger.debug('Data stored in IPFS', { 
          source: item.source, 
          cid: result.cid 
        });
      } catch (error) {
        this.metricsCollector.recordIPFSStore(item.source, false);
        logger.error('Failed to process data item', { 
          source: item.source,
          error: error.message 
        });
      }
    }

    this.metricsCollector.recordBatchProcessed();
    this.metricsCollector.updateQueueSize(this.dataQueue.getStatus().size);
  }

  /**
   * Get system status
   */
  async getStatus() {
    return {
      initialized: this.initialized,
      ipfs: this.ipfsClient.getStatus(),
      apis: this.apiDiscovery.getRegisteredAPIs(),
      queue: this.dataQueue.getStatus(),
      websockets: this.websocketClient.getStatus(),
      restPolling: this.restClient.getStatus(),
      recovery: this.recoveryService.getStatus()
    };
  }

  /**
   * Shutdown the system gracefully
   */
  async shutdown() {
    logger.info('Shutting down data integration system...');

    // Stop monitoring
    this.dashboard.stop();

    // Stop recovery service
    this.recoveryService.stop();

    // Stop API discovery
    this.apiDiscovery.stop();

    // Stop streaming clients
    this.websocketClient.disconnectAll();
    this.restClient.stopAll();

    // Stop and flush queue
    this.dataQueue.stop();

    logger.info('System shutdown completed');
  }
}

export default DataIntegrationSystem;
