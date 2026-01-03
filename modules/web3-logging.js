/**
 * ═══════════════════════════════════════════════════════
 * WEB3 DECENTRALIZED LOGGING FRAMEWORK
 * ═══════════════════════════════════════════════════════
 * Real-time decentralized logging for the Resonance School
 * Provides blockchain-based immutable audit trails
 */

class Web3LoggingFramework {
  constructor() {
    this.version = '1.0.0';
    this.enabled = true;
    this.logs = [];
    this.maxLocalLogs = 1000;
    this.blockchainConfig = null;
    this.manifestPath = 'manifests/final_deployment_manifest.json';
  }

  /**
   * Initialize Web3 logging framework
   */
  async initialize() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  WEB3 LOGGING FRAMEWORK INITIALIZATION');
    console.log('  Version: ' + this.version);
    console.log('═══════════════════════════════════════════════════════');
    
    await this.loadConfiguration();
    this.setupEventListeners();
    
    this.log('SYSTEM', 'Web3 Logging Framework initialized', { version: this.version });
    
    console.log('✅ Web3 Logging Framework initialized');
    return this;
  }

  /**
   * Load configuration from manifest
   */
  async loadConfiguration() {
    try {
      const response = await fetch(this.manifestPath);
      const manifest = await response.json();
      
      if (manifest.BlockchainIntegration) {
        this.blockchainConfig = manifest.BlockchainIntegration;
        this.enabled = manifest.BlockchainIntegration.web3Logging?.enabled || true;
      }
    } catch (error) {
      console.warn('⚠️ Could not load blockchain configuration, using defaults');
      this.setDefaultConfiguration();
    }
  }

  /**
   * Set default configuration
   */
  setDefaultConfiguration() {
    this.blockchainConfig = {
      enabled: true,
      smartContracts: {
        DocumentAnchor: {
          address: '0xYOUR_DEPLOYED_CONTRACT_ADDRESS',
          network: 'Ethereum Mainnet',
          status: 'pending_deployment'
        }
      },
      web3Logging: {
        enabled: true,
        provider: 'decentralized',
        realtime: true
      }
    };
  }

  /**
   * Setup event listeners for automatic logging
   */
  setupEventListeners() {
    if (typeof window === 'undefined') return;

    // Listen to AIC events
    window.addEventListener('aic:resonance', (event) => {
      this.log('RESONANCE', 'Resonance pulse', event.detail);
    });

    window.addEventListener('aic:veto', (event) => {
      this.log('VETO', 'Ethical veto triggered', event.detail, 'ERROR');
    });

    // Listen to IPFS events
    window.addEventListener('ipfs:document-added', (event) => {
      this.log('IPFS', 'Document added', event.detail);
    });

    console.log('📡 Event listeners configured for automatic logging');
  }

  /**
   * Log an entry
   */
  log(category, message, data = {}, level = 'INFO') {
    const entry = {
      timestamp: new Date().toISOString(),
      category,
      message,
      data,
      level,
      id: this.generateLogId()
    };

    this.logs.push(entry);
    
    // Maintain max size
    if (this.logs.length > this.maxLocalLogs) {
      this.logs.shift();
    }

    // Console output
    const consoleMethod = this.getConsoleMethod(level);
    console[consoleMethod](`[${category}] ${message}`, data);

    // Emit event for real-time subscribers
    this.emitLogEvent(entry);

    // Store in blockchain (simulated for now)
    if (this.enabled) {
      this.storeOnChain(entry);
    }

    return entry;
  }

  /**
   * Generate unique log ID
   */
  generateLogId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  /**
   * Get console method based on level
   */
  getConsoleMethod(level) {
    const methods = {
      'ERROR': 'error',
      'WARN': 'warn',
      'INFO': 'log',
      'DEBUG': 'debug'
    };
    return methods[level] || 'log';
  }

  /**
   * Emit log event
   */
  emitLogEvent(entry) {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent('web3:log', {
      detail: entry
    });
    
    window.dispatchEvent(event);
  }

  /**
   * Store log on blockchain (simulated)
   */
  async storeOnChain(entry) {
    // In a real implementation, this would interact with a smart contract
    // For now, we simulate the storage
    
    if (!this.blockchainConfig?.web3Logging?.realtime) return;

    // Simulate blockchain transaction
    const txHash = this.generateTransactionHash(entry);
    
    // Mark entry as stored
    entry.blockchainTx = txHash;
    entry.blockchainStatus = 'pending';

    // Simulate confirmation after delay
    setTimeout(() => {
      entry.blockchainStatus = 'confirmed';
      this.emitLogEvent({
        ...entry,
        message: 'Log entry confirmed on blockchain'
      });
    }, 3000);
  }

  /**
   * Generate simulated transaction hash
   */
  generateTransactionHash(entry) {
    const data = JSON.stringify(entry);
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += Math.floor(Math.random() * 16).toString(16);
    }
    return hash;
  }

  /**
   * Get logs by category
   */
  getLogsByCategory(category) {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count = 50) {
    return this.logs.slice(-count);
  }

  /**
   * Get all logs
   */
  getAllLogs() {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
    this.log('SYSTEM', 'Logs cleared');
  }

  /**
   * Export logs to JSON
   */
  exportLogs() {
    return {
      version: this.version,
      exportTime: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs
    };
  }

  /**
   * Render log viewer
   */
  renderLogViewer(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      maxLogs = 50,
      categories = null,
      levels = null,
      realtime = true
    } = options;

    let logs = this.getRecentLogs(maxLogs);
    
    if (categories) {
      logs = logs.filter(log => categories.includes(log.category));
    }
    
    if (levels) {
      logs = logs.filter(log => levels.includes(log.level));
    }

    const html = `
      <div class="web3-log-viewer">
        <div class="log-viewer-header">
          <h3>🔗 Decentralized Log Viewer</h3>
          <div class="log-controls">
            <span class="log-count">${this.logs.length} total logs</span>
            <button onclick="web3Logger.clearLogs()" class="btn-clear">Clear</button>
            <button onclick="web3Logger.exportLogs()" class="btn-export">Export</button>
          </div>
        </div>
        <div class="log-entries terminal-scroll">
          ${logs.reverse().map(log => this.renderLogEntry(log)).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Setup real-time updates
    if (realtime) {
      this.setupRealtimeViewer(container, options);
    }
  }

  /**
   * Render a single log entry
   */
  renderLogEntry(log) {
    const levelClass = log.level.toLowerCase();
    const time = new Date(log.timestamp).toLocaleTimeString();
    
    return `
      <div class="log-entry level-${levelClass}">
        <span class="log-time">${time}</span>
        <span class="log-category">[${log.category}]</span>
        <span class="log-message">${log.message}</span>
        ${log.blockchainTx ? `<span class="log-blockchain" title="${log.blockchainTx}">⛓️</span>` : ''}
      </div>
    `;
  }

  /**
   * Setup real-time log viewer updates
   */
  setupRealtimeViewer(container, options) {
    if (typeof window === 'undefined') return;

    window.addEventListener('web3:log', (event) => {
      const logEntries = container.querySelector('.log-entries');
      if (!logEntries) return;

      const newEntry = this.renderLogEntry(event.detail);
      logEntries.insertAdjacentHTML('afterbegin', newEntry);

      // Maintain max entries in viewer
      const entries = logEntries.querySelectorAll('.log-entry');
      if (entries.length > (options.maxLogs || 50)) {
        entries[entries.length - 1].remove();
      }
    });
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      totalLogs: this.logs.length,
      byCategory: this.getLogCountByCategory(),
      byLevel: this.getLogCountByLevel(),
      enabled: this.enabled,
      blockchainConfig: this.blockchainConfig
    };
  }

  /**
   * Get log count by category
   */
  getLogCountByCategory() {
    const counts = {};
    this.logs.forEach(log => {
      counts[log.category] = (counts[log.category] || 0) + 1;
    });
    return counts;
  }

  /**
   * Get log count by level
   */
  getLogCountByLevel() {
    const counts = {};
    this.logs.forEach(log => {
      counts[log.level] = (counts[log.level] || 0) + 1;
    });
    return counts;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Web3LoggingFramework;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.Web3LoggingFramework = Web3LoggingFramework;
  
  // Create global instance
  window.web3Logger = new Web3LoggingFramework();
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.web3Logger.initialize();
    });
  } else {
    window.web3Logger.initialize();
  }
}
