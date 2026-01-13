/**
 * Recovery Service
 * Implements self-healing and recovery workflows
 */
import logger from '../utils/logger.js';
import config from '../config/index.js';

class RecoveryService {
  constructor(ipfsClient, apiDiscovery, websocketClient, restClient) {
    this.ipfsClient = ipfsClient;
    this.apiDiscovery = apiDiscovery;
    this.websocketClient = websocketClient;
    this.restClient = restClient;
    this.healthCheckInterval = null;
    this.recoveryAttempts = new Map();
  }

  /**
   * Start health monitoring
   */
  start() {
    logger.info('Starting recovery service', {
      interval: config.recovery.healthCheckInterval
    });

    this.healthCheckInterval = setInterval(
      () => this.performHealthCheck(),
      config.recovery.healthCheckInterval
    );

    // Initial health check
    this.performHealthCheck();
  }

  /**
   * Stop health monitoring
   */
  stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      logger.info('Recovery service stopped');
    }
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    logger.info('Performing system health check');

    const health = {
      timestamp: new Date().toISOString(),
      ipfs: this.checkIPFSHealth(),
      apis: await this.checkAPIHealth(),
      websockets: this.checkWebSocketHealth(),
      restPolling: this.checkRESTPollingHealth()
    };

    // Trigger recovery for unhealthy components
    if (!health.ipfs.healthy) {
      await this.recoverIPFS();
    }

    for (const api of health.apis.unhealthy) {
      await this.recoverAPI(api.id);
    }

    for (const ws of health.websockets.disconnected) {
      await this.recoverWebSocket(ws.apiId);
    }

    logger.info('Health check completed', {
      ipfsHealthy: health.ipfs.healthy,
      apisHealthy: health.apis.healthy.length,
      apisUnhealthy: health.apis.unhealthy.length
    });

    return health;
  }

  /**
   * Check IPFS health
   */
  checkIPFSHealth() {
    const status = this.ipfsClient.getStatus();
    return {
      healthy: status.initialized,
      ...status
    };
  }

  /**
   * Check API health
   */
  async checkAPIHealth() {
    const healthStatus = await this.apiDiscovery.healthCheck();
    
    const healthy = healthStatus.apis.filter(api => api.status === 'healthy');
    const unhealthy = healthStatus.apis.filter(api => api.status === 'unhealthy');

    return {
      total: healthStatus.total,
      healthy,
      unhealthy
    };
  }

  /**
   * Check WebSocket health
   */
  checkWebSocketHealth() {
    const connections = this.websocketClient.getStatus();
    
    return {
      total: connections.length,
      connected: connections.filter(c => c.status === 'connected'),
      disconnected: connections.filter(c => c.status === 'disconnected')
    };
  }

  /**
   * Check REST polling health
   */
  checkRESTPollingHealth() {
    const polls = this.restClient.getStatus();
    
    return {
      total: polls.length,
      active: polls.filter(p => p.pollCount > 0),
      errors: polls.filter(p => p.errorCount > 0)
    };
  }

  /**
   * Recover IPFS connection
   */
  async recoverIPFS() {
    if (!config.recovery.autoRecoveryEnabled) {
      logger.warn('Auto-recovery is disabled');
      return false;
    }

    logger.info('Attempting IPFS recovery');

    try {
      const success = await this.ipfsClient.initialize();
      if (success) {
        logger.info('IPFS recovery successful');
        return true;
      }
    } catch (error) {
      logger.error('IPFS recovery failed', { error: error.message });
    }

    return false;
  }

  /**
   * Recover API connection
   * @param {string} apiId - API identifier
   */
  async recoverAPI(apiId) {
    if (!config.recovery.autoRecoveryEnabled) {
      return false;
    }

    const attempts = this.recoveryAttempts.get(apiId) || 0;
    
    if (attempts >= config.recovery.maxRetryAttempts) {
      logger.error('Max recovery attempts reached', { apiId, attempts });
      return false;
    }

    logger.info('Attempting API recovery', { apiId, attempt: attempts + 1 });

    try {
      // Wait with exponential backoff
      const backoff = config.recovery.retryBackoffMs * Math.pow(2, attempts);
      await new Promise(resolve => setTimeout(resolve, backoff));

      const apiInfo = this.apiDiscovery.getAPI(apiId);
      if (!apiInfo) {
        logger.error('API not found for recovery', { apiId });
        return false;
      }

      // Try to re-register the API
      await this.apiDiscovery.registerAPI(apiId, {
        url: apiInfo.url,
        method: apiInfo.method,
        headers: apiInfo.headers
      });

      this.recoveryAttempts.set(apiId, 0);
      logger.info('API recovery successful', { apiId });
      return true;
    } catch (error) {
      this.recoveryAttempts.set(apiId, attempts + 1);
      logger.error('API recovery failed', { 
        apiId, 
        attempt: attempts + 1,
        error: error.message 
      });
      return false;
    }
  }

  /**
   * Recover WebSocket connection
   * @param {string} apiId - API identifier
   */
  async recoverWebSocket(apiId) {
    logger.info('WebSocket auto-reconnect handled by client', { apiId });
    // WebSocket client handles auto-reconnect
    return true;
  }

  /**
   * Retrieve backup from IPFS
   * @param {string} source - Data source identifier
   * @returns {Object} - Restored data
   */
  async retrieveBackup(source) {
    logger.info('Retrieving backup from IPFS', { source });

    try {
      const latestCID = this.ipfsClient.getLatestCID(source);
      
      if (!latestCID) {
        logger.warn('No backup found', { source });
        return null;
      }

      const data = await this.ipfsClient.retrieveData(latestCID);
      logger.info('Backup retrieved successfully', { 
        source, 
        cid: latestCID 
      });

      return data;
    } catch (error) {
      logger.error('Failed to retrieve backup', { 
        source, 
        error: error.message 
      });
      return null;
    }
  }

  /**
   * Create emergency backup
   * @param {string} source - Data source identifier
   */
  async createEmergencyBackup(source) {
    logger.info('Creating emergency backup', { source });

    try {
      const backup = await this.ipfsClient.createBackup(source);
      logger.info('Emergency backup created', { 
        source, 
        backupCID: backup.backupCID 
      });
      return backup;
    } catch (error) {
      logger.error('Failed to create emergency backup', { 
        source, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Get recovery status
   * @returns {Object} - Recovery service status
   */
  getStatus() {
    return {
      autoRecoveryEnabled: config.recovery.autoRecoveryEnabled,
      healthCheckInterval: config.recovery.healthCheckInterval,
      activeRecoveries: Array.from(this.recoveryAttempts.entries()).map(
        ([apiId, attempts]) => ({ apiId, attempts })
      )
    };
  }
}

export default RecoveryService;
