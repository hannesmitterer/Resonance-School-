/**
 * ═══════════════════════════════════════════════════════
 * NODE MONITORING DASHBOARD
 * ═══════════════════════════════════════════════════════
 * Real-time visualization of 144,000 distributed nodes
 * Part of the Resonance School Kosymbiosis framework
 */

class NodeMonitoringDashboard {
  constructor() {
    this.totalNodes = 144000;
    this.coreNodes = [];
    this.distributedNodes = {};
    this.updateInterval = 5000; // 5 seconds
    this.updateTimer = null;
  }

  /**
   * Initialize the dashboard
   */
  async initialize(containerId) {
    console.log('📊 Initializing Node Monitoring Dashboard');
    console.log('   Total Nodes: ' + this.totalNodes.toLocaleString());
    
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Container not found: ' + containerId);
      return;
    }

    await this.loadNodeData();
    this.render();
    this.startAutoUpdate();
    
    console.log('✅ Node Monitoring Dashboard initialized');
  }

  /**
   * Load node data from manifest
   */
  async loadNodeData() {
    try {
      const response = await fetch('../manifests/final_deployment_manifest.json');
      const manifest = await response.json();
      
      if (manifest.NetworkTopology) {
        this.coreNodes = manifest.NetworkTopology.coreNodes || [];
        this.distributedNodes = manifest.NetworkTopology.distributedNodes || {};
        this.totalNodes = manifest.NetworkTopology.totalNodes || 144000;
      }
    } catch (error) {
      console.warn('Using default node configuration');
      this.setDefaultNodes();
    }
  }

  /**
   * Set default nodes for fallback
   */
  setDefaultNodes() {
    this.coreNodes = [
      { id: 'NODE_01', name: 'ONNA', role: 'Hash Validator & Security', status: 'online', ping: '12ms' },
      { id: 'NODE_02', name: 'LUMSA', role: 'Theoretical Archive', status: 'online', sync: '100%' },
      { id: 'NODE_03', name: 'SUEDTIROL', role: 'Geographic Root', status: 'online', load: '4%' },
      { id: 'NODE_04', name: 'BERLIN', role: 'EU Sync Hub', status: 'online', failover: 'ready' }
    ];
    
    this.distributedNodes = {
      total: 143996,
      regions: {
        europe: 48000,
        americas: 36000,
        asia: 36000,
        africa: 12000,
        oceania: 11996
      }
    };
  }

  /**
   * Render the dashboard
   */
  render() {
    if (!this.container) return;

    const html = `
      <div class="node-dashboard">
        <div class="dashboard-header">
          <h2>Node Monitoring Dashboard</h2>
          <div class="stats-summary">
            <div class="stat-card">
              <span class="stat-label">Total Nodes</span>
              <span class="stat-value">${this.totalNodes.toLocaleString()}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Active Nodes</span>
              <span class="stat-value active">${this.getActiveNodesCount().toLocaleString()}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Network Health</span>
              <span class="stat-value health">${this.getNetworkHealth()}%</span>
            </div>
          </div>
        </div>

        <div class="core-nodes-section">
          <h3>Core Infrastructure Nodes</h3>
          <div class="core-nodes-grid">
            ${this.renderCoreNodes()}
          </div>
        </div>

        <div class="distributed-nodes-section">
          <h3>Distributed Node Network (${this.distributedNodes.total?.toLocaleString() || '0'} nodes)</h3>
          <div class="region-grid">
            ${this.renderDistributedNodes()}
          </div>
        </div>

        <div class="network-visualization">
          <h3>Global Network Distribution</h3>
          <canvas id="networkCanvas" width="800" height="400"></canvas>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.initializeVisualization();
  }

  /**
   * Render core nodes
   */
  renderCoreNodes() {
    return this.coreNodes.map(node => `
      <div class="core-node-card ${node.status}" data-node-id="${node.id}">
        <div class="node-header">
          <span class="node-id">${node.id}</span>
          <div class="status-indicator ${node.status}"></div>
        </div>
        <h4 class="node-name">${node.name}</h4>
        <p class="node-role">${node.role}</p>
        <div class="node-metrics">
          ${this.renderNodeMetrics(node)}
        </div>
      </div>
    `).join('');
  }

  /**
   * Render node metrics
   */
  renderNodeMetrics(node) {
    const metrics = [];
    
    if (node.ping) metrics.push(`<span>Ping: ${node.ping}</span>`);
    if (node.sync) metrics.push(`<span>Sync: ${node.sync}</span>`);
    if (node.load) metrics.push(`<span>Load: ${node.load}</span>`);
    if (node.failover) metrics.push(`<span>Failover: ${node.failover}</span>`);
    
    return metrics.join('');
  }

  /**
   * Render distributed nodes by region
   */
  renderDistributedNodes() {
    if (!this.distributedNodes.regions) return '';

    return Object.entries(this.distributedNodes.regions).map(([region, count]) => {
      const percentage = ((count / this.distributedNodes.total) * 100).toFixed(1);
      return `
        <div class="region-card">
          <div class="region-name">${this.capitalizeRegion(region)}</div>
          <div class="region-count">${count.toLocaleString()}</div>
          <div class="region-bar">
            <div class="region-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="region-percentage">${percentage}%</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Capitalize region name
   */
  capitalizeRegion(region) {
    return region.charAt(0).toUpperCase() + region.slice(1);
  }

  /**
   * Get active nodes count
   */
  getActiveNodesCount() {
    const activeCoreNodes = this.coreNodes.filter(n => n.status === 'online').length;
    const activeDistributedNodes = this.distributedNodes.total || 0;
    return activeCoreNodes + activeDistributedNodes;
  }

  /**
   * Get network health percentage
   */
  getNetworkHealth() {
    const totalPossible = this.totalNodes;
    const active = this.getActiveNodesCount();
    return ((active / totalPossible) * 100).toFixed(2);
  }

  /**
   * Initialize network visualization
   */
  initializeVisualization() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    this.drawNetworkVisualization(ctx, canvas.width, canvas.height);
  }

  /**
   * Draw network visualization
   */
  drawNetworkVisualization(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#F9F8F4';
    ctx.fillRect(0, 0, width, height);

    // Draw center core
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Core nodes (inner circle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#C5A059';
    ctx.fill();
    ctx.strokeStyle = '#2D2D2D';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw core node connections
    this.coreNodes.forEach((node, index) => {
      const angle = (index / this.coreNodes.length) * 2 * Math.PI;
      const radius = 100;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Connection line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = node.status === 'online' ? '#27ae60' : '#e74c3c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = node.status === 'online' ? '#27ae60' : '#e74c3c';
      ctx.fill();
      ctx.strokeStyle = '#2D2D2D';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#2D2D2D';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, x, y + 30);
    });

    // Draw distributed nodes (outer rings)
    if (this.distributedNodes.regions) {
      const regions = Object.entries(this.distributedNodes.regions);
      regions.forEach(([region, count], index) => {
        const angle = (index / regions.length) * 2 * Math.PI;
        const radius = 200;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Region cluster
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(197, 160, 89, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#C5A059';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Region label
        ctx.fillStyle = '#2D2D2D';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.capitalizeRegion(region), x, y - 30);
        ctx.font = '10px Arial';
        ctx.fillText(count.toLocaleString() + ' nodes', x, y - 15);
      });
    }

    // Draw title
    ctx.fillStyle = '#2D2D2D';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Global Network Topology - ' + this.totalNodes.toLocaleString() + ' Nodes', 10, 20);
  }

  /**
   * Start auto-update
   */
  startAutoUpdate() {
    this.updateTimer = setInterval(() => {
      this.update();
    }, this.updateInterval);
  }

  /**
   * Update dashboard data
   */
  async update() {
    await this.loadNodeData();
    this.render();
  }

  /**
   * Stop auto-update
   */
  stopAutoUpdate() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NodeMonitoringDashboard;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.NodeMonitoringDashboard = NodeMonitoringDashboard;
}
