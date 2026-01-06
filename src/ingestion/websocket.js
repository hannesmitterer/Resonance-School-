/**
 * WebSocket Client
 * Handles real-time data streaming via WebSocket
 */
import WebSocket from 'ws';
import logger from '../utils/logger.js';
import config from '../config/index.js';

class WebSocketClient {
  constructor(dataQueue, apiDiscovery) {
    this.connections = new Map();
    this.dataQueue = dataQueue;
    this.apiDiscovery = apiDiscovery;
    this.reconnectInterval = config.streaming.websocket.reconnectInterval;
  }

  /**
   * Connect to a WebSocket endpoint
   * @param {string} apiId - API identifier
   * @param {string} url - WebSocket URL
   * @param {Object} options - Connection options
   */
  connect(apiId, url, options = {}) {
    if (!config.streaming.websocket.enabled) {
      logger.warn('WebSocket streaming is disabled');
      return;
    }

    logger.info('Connecting to WebSocket', { apiId, url });

    const ws = new WebSocket(url, options);
    
    ws.on('open', () => {
      logger.info('WebSocket connected', { apiId });
      this.connections.set(apiId, {
        ws,
        url,
        options,
        status: 'connected',
        connectedAt: new Date().toISOString()
      });
    });

    ws.on('message', (data) => {
      this.handleMessage(apiId, data);
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error', { 
        apiId, 
        error: error.message 
      });
    });

    ws.on('close', () => {
      logger.warn('WebSocket disconnected', { apiId });
      this.handleDisconnect(apiId, url, options);
    });
  }

  /**
   * Handle incoming WebSocket message
   * @param {string} apiId - API identifier
   * @param {Buffer} data - Message data
   */
  handleMessage(apiId, data) {
    try {
      const message = JSON.parse(data.toString());
      
      // Validate if schema exists
      if (this.apiDiscovery) {
        const validation = this.apiDiscovery.validateResponse(apiId, message);
        
        if (!validation.valid) {
          logger.warn('WebSocket message validation failed', {
            apiId,
            errors: validation.errors
          });
        }
      }

      // Enqueue data
      this.dataQueue.enqueue({
        source: apiId,
        type: 'websocket',
        data: message,
        receivedAt: new Date().toISOString()
      });

      logger.debug('WebSocket message queued', { apiId });
    } catch (error) {
      logger.error('Failed to process WebSocket message', {
        apiId,
        error: error.message
      });
    }
  }

  /**
   * Handle WebSocket disconnection
   * @param {string} apiId - API identifier
   * @param {string} url - WebSocket URL
   * @param {Object} options - Connection options
   */
  handleDisconnect(apiId, url, options) {
    const connection = this.connections.get(apiId);
    if (connection) {
      connection.status = 'disconnected';
      connection.disconnectedAt = new Date().toISOString();
    }

    // Auto-reconnect
    logger.info('Scheduling WebSocket reconnection', { 
      apiId, 
      delay: this.reconnectInterval 
    });

    setTimeout(() => {
      this.connect(apiId, url, options);
    }, this.reconnectInterval);
  }

  /**
   * Disconnect from a WebSocket endpoint
   * @param {string} apiId - API identifier
   */
  disconnect(apiId) {
    const connection = this.connections.get(apiId);
    if (connection && connection.ws) {
      connection.ws.close();
      this.connections.delete(apiId);
      logger.info('WebSocket disconnected manually', { apiId });
    }
  }

  /**
   * Get connection status
   * @returns {Array} - Array of connection statuses
   */
  getStatus() {
    return Array.from(this.connections.entries()).map(([apiId, conn]) => ({
      apiId,
      url: conn.url,
      status: conn.status,
      connectedAt: conn.connectedAt,
      disconnectedAt: conn.disconnectedAt
    }));
  }

  /**
   * Disconnect all WebSocket connections
   */
  disconnectAll() {
    for (const apiId of this.connections.keys()) {
      this.disconnect(apiId);
    }
    logger.info('All WebSocket connections closed');
  }
}

export default WebSocketClient;
