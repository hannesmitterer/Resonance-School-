/**
 * Monitoring Dashboard
 * Provides real-time visualization and monitoring interface
 */
import express from 'express';
import config from '../config/index.js';
import logger from '../utils/logger.js';

class MonitoringDashboard {
  constructor(metricsCollector, ipfsClient, apiDiscovery, recoveryService) {
    this.app = express();
    this.metricsCollector = metricsCollector;
    this.ipfsClient = ipfsClient;
    this.apiDiscovery = apiDiscovery;
    this.recoveryService = recoveryService;
    this.server = null;
  }

  /**
   * Start the dashboard server
   */
  start() {
    if (!config.monitoring.metricsEnabled) {
      logger.info('Monitoring dashboard is disabled');
      return;
    }

    this.setupRoutes();
    
    const port = config.monitoring.dashboardPort;
    this.server = this.app.listen(port, () => {
      logger.info(`Monitoring dashboard started on port ${port}`);
      logger.info(`Metrics available at http://localhost:${port}/metrics`);
      logger.info(`Dashboard at http://localhost:${port}/dashboard`);
    });
  }

  /**
   * Setup Express routes
   */
  setupRoutes() {
    // Health endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Prometheus metrics endpoint
    this.app.get('/metrics', async (req, res) => {
      try {
        res.set('Content-Type', this.metricsCollector.getRegistry().contentType);
        const metrics = await this.metricsCollector.getMetrics();
        res.send(metrics);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Dashboard status endpoint
    this.app.get('/api/status', async (req, res) => {
      try {
        const status = await this.getSystemStatus();
        res.json(status);
      } catch (error) {
        logger.error('Error getting system status', { error: error.message });
        res.status(500).json({ error: error.message });
      }
    });

    // IPFS status endpoint
    this.app.get('/api/ipfs', (req, res) => {
      try {
        const status = this.ipfsClient.getStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // API discovery status endpoint
    this.app.get('/api/apis', (req, res) => {
      try {
        const apis = this.apiDiscovery.getRegisteredAPIs();
        res.json(apis);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Recovery status endpoint
    this.app.get('/api/recovery', (req, res) => {
      try {
        const status = this.recoveryService.getStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // HTML Dashboard
    this.app.get('/dashboard', (req, res) => {
      res.send(this.getDashboardHTML());
    });
  }

  /**
   * Get comprehensive system status
   */
  async getSystemStatus() {
    const ipfsStatus = this.ipfsClient.getStatus();
    const apis = this.apiDiscovery.getRegisteredAPIs();
    const recoveryStatus = this.recoveryService.getStatus();

    return {
      timestamp: new Date().toISOString(),
      ipfs: ipfsStatus,
      apis: {
        total: apis.length,
        active: apis.filter(api => api.status === 'active').length,
        unhealthy: apis.filter(api => api.status === 'unhealthy').length
      },
      recovery: recoveryStatus,
      resonance: {
        treasury: config.resonance.seedbringerTreasury
      }
    };
  }

  /**
   * Generate dashboard HTML
   */
  getDashboardHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resonance School - Data Integration Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Lato', sans-serif; background-color: #F9F8F4; }
        .accent-gold { color: #C5A059; }
        .bg-gold { background-color: #C5A059; }
        .card-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .status-healthy { background-color: #10B981; color: white; }
        .status-unhealthy { background-color: #EF4444; color: white; }
        .status-active { background-color: #3B82F6; color: white; }
    </style>
</head>
<body class="antialiased min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-8">
        <header class="mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                Resonance School
                <span class="accent-gold">Data Integration</span>
            </h1>
            <p class="text-gray-600">Live System Monitoring Dashboard</p>
        </header>

        <div id="status-container" class="space-y-6">
            <div class="bg-white rounded-lg p-6 card-shadow">
                <h2 class="text-xl font-bold mb-4">System Status</h2>
                <div id="system-status">Loading...</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg p-6 card-shadow">
                    <h3 class="text-lg font-bold mb-4">IPFS Storage</h3>
                    <div id="ipfs-status">Loading...</div>
                </div>

                <div class="bg-white rounded-lg p-6 card-shadow">
                    <h3 class="text-lg font-bold mb-4">API Discovery</h3>
                    <div id="api-status">Loading...</div>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 card-shadow">
                <h3 class="text-lg font-bold mb-4">Registered APIs</h3>
                <div id="api-list">Loading...</div>
            </div>

            <div class="bg-white rounded-lg p-6 card-shadow">
                <h3 class="text-lg font-bold mb-4">Recovery Service</h3>
                <div id="recovery-status">Loading...</div>
            </div>
        </div>
    </div>

    <script>
        async function fetchStatus() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                updateDashboard(data);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        }

        async function fetchAPIs() {
            try {
                const response = await fetch('/api/apis');
                const apis = await response.json();
                updateAPIList(apis);
            } catch (error) {
                console.error('Error fetching APIs:', error);
            }
        }

        function updateDashboard(data) {
            // System Status
            document.getElementById('system-status').innerHTML = \`
                <div class="space-y-2">
                    <p><strong>Timestamp:</strong> \${data.timestamp}</p>
                    <p><strong>Treasury:</strong> \${data.resonance.treasury}</p>
                </div>
            \`;

            // IPFS Status
            document.getElementById('ipfs-status').innerHTML = \`
                <div class="space-y-2">
                    <p>
                        <strong>Status:</strong> 
                        <span class="status-badge \${data.ipfs.initialized ? 'status-healthy' : 'status-unhealthy'}">
                            \${data.ipfs.initialized ? 'Connected' : 'Disconnected'}
                        </span>
                    </p>
                    <p><strong>Tracked Sources:</strong> \${data.ipfs.trackedSources}</p>
                    <p><strong>Total Versions:</strong> \${data.ipfs.totalVersions}</p>
                </div>
            \`;

            // API Status
            document.getElementById('api-status').innerHTML = \`
                <div class="space-y-2">
                    <p><strong>Total APIs:</strong> \${data.apis.total}</p>
                    <p><strong>Active:</strong> \${data.apis.active}</p>
                    <p><strong>Unhealthy:</strong> \${data.apis.unhealthy}</p>
                </div>
            \`;

            // Recovery Status
            document.getElementById('recovery-status').innerHTML = \`
                <div class="space-y-2">
                    <p>
                        <strong>Auto-Recovery:</strong> 
                        <span class="status-badge \${data.recovery.autoRecoveryEnabled ? 'status-active' : 'status-unhealthy'}">
                            \${data.recovery.autoRecoveryEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </p>
                    <p><strong>Health Check Interval:</strong> \${data.recovery.healthCheckInterval}ms</p>
                    <p><strong>Active Recoveries:</strong> \${data.recovery.activeRecoveries.length}</p>
                </div>
            \`;
        }

        function updateAPIList(apis) {
            if (apis.length === 0) {
                document.getElementById('api-list').innerHTML = '<p class="text-gray-500">No APIs registered yet.</p>';
                return;
            }

            const html = apis.map(api => {
                // Escape HTML to prevent XSS
                const escapeHtml = (str) => {
                    const div = document.createElement('div');
                    div.textContent = str;
                    return div.innerHTML;
                };
                
                const apiId = escapeHtml(api.id);
                const apiUrl = escapeHtml(api.url);
                const apiMethod = escapeHtml(api.method);
                const apiStatus = escapeHtml(api.status);
                const lastChecked = api.lastChecked ? escapeHtml(api.lastChecked) : 'Never';
                const borderClass = api.status === 'active' ? 'border-green-500' : 'border-red-500';
                const statusClass = api.status === 'active' ? 'status-healthy' : 'status-unhealthy';
                
                return \`
                <div class="border-l-4 \${borderClass} pl-4 py-2 mb-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-semibold">\${apiId}</p>
                            <p class="text-sm text-gray-600">\${apiUrl}</p>
                            <p class="text-xs text-gray-500">Method: \${apiMethod}</p>
                        </div>
                        <span class="status-badge \${statusClass}">
                            \${apiStatus}
                        </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Last checked: \${lastChecked}</p>
                </div>
            \`;
            }).join('');

            document.getElementById('api-list').innerHTML = html;
        }

        // Initial load
        fetchStatus();
        fetchAPIs();

        // Refresh every 5 seconds
        setInterval(fetchStatus, 5000);
        setInterval(fetchAPIs, 10000);
    </script>
</body>
</html>
    `;
  }

  /**
   * Stop the dashboard server
   */
  stop() {
    if (this.server) {
      this.server.close(() => {
        logger.info('Monitoring dashboard stopped');
      });
    }
  }
}

export default MonitoringDashboard;
