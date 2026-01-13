/**
 * REST Polling Client
 * Polls REST APIs for data updates
 */
import axios from 'axios';
import logger from '../utils/logger.js';
import config from '../config/index.js';

class RESTPollingClient {
  constructor(dataQueue, apiDiscovery) {
    this.polls = new Map();
    this.dataQueue = dataQueue;
    this.apiDiscovery = apiDiscovery;
    this.pollingInterval = config.streaming.rest.pollingInterval;
  }

  /**
   * Start polling an API endpoint
   * @param {string} apiId - API identifier
   * @param {Object} apiConfig - API configuration
   */
  startPolling(apiId, apiConfig) {
    if (!config.streaming.rest.enabled) {
      logger.warn('REST polling is disabled');
      return;
    }

    if (this.polls.has(apiId)) {
      logger.warn('Already polling this API', { apiId });
      return;
    }

    logger.info('Starting REST polling', { 
      apiId, 
      interval: this.pollingInterval 
    });

    const poll = {
      apiId,
      config: apiConfig,
      interval: apiConfig.interval || this.pollingInterval,
      timer: null,
      lastPoll: null,
      pollCount: 0,
      errorCount: 0
    };

    // Start polling
    poll.timer = setInterval(
      () => this.poll(apiId),
      poll.interval
    );

    this.polls.set(apiId, poll);

    // Immediate first poll
    this.poll(apiId);
  }

  /**
   * Poll an API endpoint
   * @param {string} apiId - API identifier
   */
  async poll(apiId) {
    const pollInfo = this.polls.get(apiId);
    if (!pollInfo) return;

    try {
      logger.debug('Polling API', { apiId });
      
      const response = await axios({
        method: pollInfo.config.method || 'GET',
        url: pollInfo.config.url,
        headers: pollInfo.config.headers || {},
        timeout: 10000
      });

      // Validate response
      if (this.apiDiscovery) {
        const validation = this.apiDiscovery.validateResponse(
          apiId, 
          response.data
        );
        
        if (!validation.valid) {
          logger.warn('REST response validation failed', {
            apiId,
            errors: validation.errors
          });
        }
      }

      // Enqueue data
      this.dataQueue.enqueue({
        source: apiId,
        type: 'rest',
        data: response.data,
        receivedAt: new Date().toISOString()
      });

      pollInfo.lastPoll = new Date().toISOString();
      pollInfo.pollCount++;
      
      logger.debug('REST poll successful', { 
        apiId, 
        pollCount: pollInfo.pollCount 
      });
    } catch (error) {
      pollInfo.errorCount++;
      logger.error('REST poll failed', {
        apiId,
        error: error.message,
        errorCount: pollInfo.errorCount
      });
    }
  }

  /**
   * Stop polling an API endpoint
   * @param {string} apiId - API identifier
   */
  stopPolling(apiId) {
    const pollInfo = this.polls.get(apiId);
    if (pollInfo && pollInfo.timer) {
      clearInterval(pollInfo.timer);
      this.polls.delete(apiId);
      logger.info('Stopped REST polling', { apiId });
    }
  }

  /**
   * Get polling status
   * @returns {Array} - Array of poll statuses
   */
  getStatus() {
    return Array.from(this.polls.values()).map(poll => ({
      apiId: poll.apiId,
      interval: poll.interval,
      lastPoll: poll.lastPoll,
      pollCount: poll.pollCount,
      errorCount: poll.errorCount
    }));
  }

  /**
   * Stop all polling
   */
  stopAll() {
    for (const apiId of this.polls.keys()) {
      this.stopPolling(apiId);
    }
    logger.info('All REST polling stopped');
  }
}

export default RESTPollingClient;
