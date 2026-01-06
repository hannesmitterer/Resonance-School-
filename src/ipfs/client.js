/**
 * IPFS Client Module
 * Handles all IPFS operations including storage, retrieval, and CID management
 */
import { create } from 'ipfs-http-client';
import config from '../config/index.js';
import logger from '../utils/logger.js';

class IPFSClient {
  constructor() {
    this.client = null;
    this.cidHistory = new Map(); // Track CID versions
    this.initialized = false;
  }

  /**
   * Initialize IPFS client connection
   */
  async initialize() {
    try {
      this.client = create({
        host: config.ipfs.host,
        port: config.ipfs.port,
        protocol: config.ipfs.protocol
      });

      // Test connection
      const version = await this.client.version();
      logger.info('IPFS client initialized', { version: version.version });
      this.initialized = true;
      return true;
    } catch (error) {
      logger.error('Failed to initialize IPFS client', { error: error.message });
      this.initialized = false;
      return false;
    }
  }

  /**
   * Store data on IPFS with metadata
   * @param {Object} data - Data to store
   * @param {Object} metadata - Additional metadata (timestamp, source, etc.)
   * @returns {Object} - CID and metadata
   */
  async storeData(data, metadata = {}) {
    if (!this.initialized) {
      throw new Error('IPFS client not initialized');
    }

    try {
      const timestamp = new Date().toISOString();
      const enrichedData = {
        data,
        metadata: {
          ...metadata,
          timestamp,
          version: this.getNextVersion(metadata.source)
        }
      };

      const content = JSON.stringify(enrichedData);
      const result = await this.client.add(content);
      const cid = result.cid.toString();

      // Track CID history
      this.updateCIDHistory(metadata.source, cid, timestamp);

      logger.info('Data stored on IPFS', { 
        cid, 
        source: metadata.source,
        timestamp 
      });

      return {
        cid,
        timestamp,
        version: enrichedData.metadata.version,
        path: result.path
      };
    } catch (error) {
      logger.error('Failed to store data on IPFS', { error: error.message });
      throw error;
    }
  }

  /**
   * Retrieve data from IPFS by CID
   * @param {string} cid - Content Identifier
   * @returns {Object} - Retrieved data
   */
  async retrieveData(cid) {
    if (!this.initialized) {
      throw new Error('IPFS client not initialized');
    }

    try {
      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }
      
      const content = Buffer.concat(chunks).toString();
      const data = JSON.parse(content);

      logger.info('Data retrieved from IPFS', { cid });
      return data;
    } catch (error) {
      logger.error('Failed to retrieve data from IPFS', { 
        cid, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Pin content to ensure persistence
   * @param {string} cid - Content Identifier
   */
  async pinContent(cid) {
    if (!this.initialized) {
      throw new Error('IPFS client not initialized');
    }

    try {
      await this.client.pin.add(cid);
      logger.info('Content pinned on IPFS', { cid });
      return true;
    } catch (error) {
      logger.error('Failed to pin content', { cid, error: error.message });
      throw error;
    }
  }

  /**
   * Get CID history for a data source
   * @param {string} source - Data source identifier
   * @returns {Array} - Array of CID history entries
   */
  getCIDHistory(source) {
    return this.cidHistory.get(source) || [];
  }

  /**
   * Get latest CID for a data source
   * @param {string} source - Data source identifier
   * @returns {string|null} - Latest CID or null
   */
  getLatestCID(source) {
    const history = this.getCIDHistory(source);
    return history.length > 0 ? history[history.length - 1].cid : null;
  }

  /**
   * Update CID history tracking
   * @private
   */
  updateCIDHistory(source, cid, timestamp) {
    if (!source) return;

    if (!this.cidHistory.has(source)) {
      this.cidHistory.set(source, []);
    }

    this.cidHistory.get(source).push({
      cid,
      timestamp,
      version: this.cidHistory.get(source).length + 1
    });
  }

  /**
   * Get next version number for a source
   * @private
   */
  getNextVersion(source) {
    if (!source) return 1;
    const history = this.getCIDHistory(source);
    return history.length + 1;
  }

  /**
   * Create backup of data source with all versions
   * @param {string} source - Data source identifier
   * @returns {Object} - Backup CID and metadata
   */
  async createBackup(source) {
    try {
      const history = this.getCIDHistory(source);
      const backupData = {
        source,
        timestamp: new Date().toISOString(),
        versions: history
      };

      const result = await this.client.add(JSON.stringify(backupData));
      const backupCID = result.cid.toString();

      await this.pinContent(backupCID);

      logger.info('Backup created for source', { 
        source, 
        backupCID,
        versionCount: history.length 
      });

      return {
        backupCID,
        source,
        versionCount: history.length
      };
    } catch (error) {
      logger.error('Failed to create backup', { 
        source, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Get system status
   * @returns {Object} - IPFS client status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      trackedSources: this.cidHistory.size,
      totalVersions: Array.from(this.cidHistory.values())
        .reduce((sum, history) => sum + history.length, 0)
    };
  }
}

export default IPFSClient;
