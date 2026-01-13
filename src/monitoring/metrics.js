/**
 * Metrics Collector
 * Collects and exposes metrics for monitoring
 */
import { register, Counter, Gauge, Histogram } from 'prom-client';
import logger from '../utils/logger.js';

class MetricsCollector {
  constructor() {
    // API Metrics
    this.apiRequestsTotal = new Counter({
      name: 'api_requests_total',
      help: 'Total number of API requests',
      labelNames: ['api_id', 'status']
    });

    this.apiLatency = new Histogram({
      name: 'api_latency_seconds',
      help: 'API request latency in seconds',
      labelNames: ['api_id'],
      buckets: [0.1, 0.5, 1, 2, 5, 10]
    });

    this.apiHealthStatus = new Gauge({
      name: 'api_health_status',
      help: 'API health status (1 = healthy, 0 = unhealthy)',
      labelNames: ['api_id']
    });

    // IPFS Metrics
    this.ipfsStoresTotal = new Counter({
      name: 'ipfs_stores_total',
      help: 'Total number of IPFS store operations',
      labelNames: ['source', 'status']
    });

    this.ipfsRetrievesTotal = new Counter({
      name: 'ipfs_retrieves_total',
      help: 'Total number of IPFS retrieve operations',
      labelNames: ['status']
    });

    this.ipfsCIDVersions = new Gauge({
      name: 'ipfs_cid_versions',
      help: 'Number of CID versions per source',
      labelNames: ['source']
    });

    // Queue Metrics
    this.queueSize = new Gauge({
      name: 'queue_size',
      help: 'Current size of data queue'
    });

    this.queueBatchesProcessed = new Counter({
      name: 'queue_batches_processed_total',
      help: 'Total number of queue batches processed'
    });

    // WebSocket Metrics
    this.websocketConnections = new Gauge({
      name: 'websocket_connections',
      help: 'Number of active WebSocket connections',
      labelNames: ['status']
    });

    this.websocketMessagesReceived = new Counter({
      name: 'websocket_messages_received_total',
      help: 'Total WebSocket messages received',
      labelNames: ['api_id']
    });

    // REST Polling Metrics
    this.restPollsTotal = new Counter({
      name: 'rest_polls_total',
      help: 'Total REST polls executed',
      labelNames: ['api_id', 'status']
    });

    // Recovery Metrics
    this.recoveryAttemptsTotal = new Counter({
      name: 'recovery_attempts_total',
      help: 'Total recovery attempts',
      labelNames: ['component', 'status']
    });

    this.healthChecksTotal = new Counter({
      name: 'health_checks_total',
      help: 'Total health checks performed'
    });

    // Validation Metrics
    this.validationChecks = new Counter({
      name: 'validation_checks_total',
      help: 'Total validation checks',
      labelNames: ['api_id', 'result']
    });

    logger.info('Metrics collector initialized');
  }

  /**
   * Record API request
   */
  recordAPIRequest(apiId, status, latencySeconds) {
    this.apiRequestsTotal.inc({ api_id: apiId, status });
    if (latencySeconds !== undefined) {
      this.apiLatency.observe({ api_id: apiId }, latencySeconds);
    }
  }

  /**
   * Update API health status
   */
  updateAPIHealth(apiId, isHealthy) {
    this.apiHealthStatus.set({ api_id: apiId }, isHealthy ? 1 : 0);
  }

  /**
   * Record IPFS store
   */
  recordIPFSStore(source, success) {
    this.ipfsStoresTotal.inc({ 
      source, 
      status: success ? 'success' : 'failure' 
    });
  }

  /**
   * Record IPFS retrieve
   */
  recordIPFSRetrieve(success) {
    this.ipfsRetrievesTotal.inc({ 
      status: success ? 'success' : 'failure' 
    });
  }

  /**
   * Update CID version count
   */
  updateCIDVersions(source, count) {
    this.ipfsCIDVersions.set({ source }, count);
  }

  /**
   * Update queue size
   */
  updateQueueSize(size) {
    this.queueSize.set(size);
  }

  /**
   * Record batch processed
   */
  recordBatchProcessed() {
    this.queueBatchesProcessed.inc();
  }

  /**
   * Update WebSocket connections
   */
  updateWebSocketConnections(connected, disconnected) {
    this.websocketConnections.set({ status: 'connected' }, connected);
    this.websocketConnections.set({ status: 'disconnected' }, disconnected);
  }

  /**
   * Record WebSocket message
   */
  recordWebSocketMessage(apiId) {
    this.websocketMessagesReceived.inc({ api_id: apiId });
  }

  /**
   * Record REST poll
   */
  recordRESTPoll(apiId, success) {
    this.restPollsTotal.inc({ 
      api_id: apiId, 
      status: success ? 'success' : 'failure' 
    });
  }

  /**
   * Record recovery attempt
   */
  recordRecoveryAttempt(component, success) {
    this.recoveryAttemptsTotal.inc({ 
      component, 
      status: success ? 'success' : 'failure' 
    });
  }

  /**
   * Record health check
   */
  recordHealthCheck() {
    this.healthChecksTotal.inc();
  }

  /**
   * Record validation check
   */
  recordValidation(apiId, isValid) {
    this.validationChecks.inc({ 
      api_id: apiId, 
      result: isValid ? 'valid' : 'invalid' 
    });
  }

  /**
   * Get metrics in Prometheus format
   */
  async getMetrics() {
    return await register.metrics();
  }

  /**
   * Get metrics registry
   */
  getRegistry() {
    return register;
  }
}

export default MetricsCollector;
