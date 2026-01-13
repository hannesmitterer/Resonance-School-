/**
 * Data Queue
 * Manages buffering and batching of incoming data
 */
import logger from '../utils/logger.js';
import config from '../config/index.js';

class DataQueue {
  constructor() {
    this.queue = [];
    this.maxSize = config.queue.maxSize;
    this.batchSize = config.queue.batchSize;
    this.flushInterval = config.queue.flushInterval;
    this.flushTimer = null;
    this.handlers = [];
  }

  /**
   * Start the queue with automatic flushing
   */
  start() {
    logger.info('Starting data queue', {
      maxSize: this.maxSize,
      batchSize: this.batchSize,
      flushInterval: this.flushInterval
    });

    this.flushTimer = setInterval(
      () => this.flush(),
      this.flushInterval
    );
  }

  /**
   * Stop the queue
   */
  stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Flush remaining items
    this.flush();
    logger.info('Data queue stopped');
  }

  /**
   * Enqueue data
   * @param {Object} item - Data item
   */
  enqueue(item) {
    if (this.queue.length >= this.maxSize) {
      logger.warn('Queue is full, flushing early');
      this.flush();
    }

    this.queue.push({
      ...item,
      enqueuedAt: new Date().toISOString()
    });

    // Auto-flush if batch size reached
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Register a handler for flushed batches
   * @param {Function} handler - Async function to handle batch
   */
  onFlush(handler) {
    this.handlers.push(handler);
  }

  /**
   * Flush the queue
   */
  async flush() {
    if (this.queue.length === 0) {
      return;
    }

    const batch = this.queue.splice(0, this.batchSize);
    logger.info('Flushing queue batch', { count: batch.length });

    // Call all registered handlers
    for (const handler of this.handlers) {
      try {
        await handler(batch);
      } catch (error) {
        logger.error('Error in flush handler', { error: error.message });
      }
    }
  }

  /**
   * Get queue status
   * @returns {Object} - Queue status
   */
  getStatus() {
    return {
      size: this.queue.length,
      maxSize: this.maxSize,
      utilizationPercent: (this.queue.length / this.maxSize) * 100
    };
  }
}

export default DataQueue;
