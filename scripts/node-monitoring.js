/**
 * ═══════════════════════════════════════════════════════
 * NODE MONITORING DASHBOARD v1.0.043
 * ═══════════════════════════════════════════════════════
 * Real-time monitoring interface for 144,000 distributed nodes
 * Tracks H-VAR stability, synchronization, and consensus
 */

class NodeMonitoringDashboard {
    constructor(kosymbiosisCore) {
        this.core = kosymbiosisCore;
        this.nodes = new Map();
        this.metrics = {
            hVarStability: 0.0431,
            avgLatency: 0,
            consensusStrength: 0,
            syncRate: 0
        };
        
        // Initialize with some seed data
        this.initializeNodes();
    }

    initializeNodes() {
        // Create initial node structure
        const regions = [
            'EU-Central', 'EU-North', 'EU-South', 'EU-West',
            'NA-East', 'NA-West', 'NA-Central',
            'ASIA-East', 'ASIA-South', 'ASIA-Central',
            'SA-North', 'SA-South',
            'AFRICA-North', 'AFRICA-South',
            'OCEANIA'
        ];

        let nodeId = 1;
        regions.forEach(region => {
            const nodesInRegion = Math.floor(this.core.config.targetNodes / regions.length);
            for (let i = 0; i < Math.min(nodesInRegion, 100); i++) { // Limit to 100 per region for display
                this.nodes.set(nodeId, {
                    id: nodeId,
                    region,
                    status: Math.random() > 0.05 ? 'active' : 'syncing',
                    latency: Math.floor(Math.random() * 100) + 10,
                    lastSync: new Date(Date.now() - Math.random() * 60000).toISOString(),
                    hVar: 0.043 + (Math.random() * 0.0002 - 0.0001)
                });
                nodeId++;
            }
        });

        this.updateMetrics();
    }

    updateMetrics() {
        const activeNodes = Array.from(this.nodes.values()).filter(n => n.status === 'active');
        const syncingNodes = Array.from(this.nodes.values()).filter(n => n.status === 'syncing');
        
        this.metrics.avgLatency = activeNodes.reduce((sum, n) => sum + n.latency, 0) / activeNodes.length || 0;
        this.metrics.consensusStrength = (activeNodes.length / this.nodes.size);
        this.metrics.syncRate = (activeNodes.length / this.core.config.targetNodes);
        
        // Calculate average H-VAR stability
        const totalHVar = activeNodes.reduce((sum, n) => sum + n.hVar, 0);
        this.metrics.hVarStability = totalHVar / activeNodes.length || 0.0431;

        // Update core with node counts
        this.core.updateNodeStatus(activeNodes.length, activeNodes.length);
    }

    getNodesByRegion() {
        const regions = new Map();
        this.nodes.forEach(node => {
            if (!regions.has(node.region)) {
                regions.set(node.region, []);
            }
            regions.get(node.region).push(node);
        });
        return regions;
    }

    getNodeHealth(nodeId) {
        const node = this.nodes.get(nodeId);
        if (!node) return null;

        return {
            id: node.id,
            region: node.region,
            status: node.status,
            health: node.latency < 50 ? 'excellent' : node.latency < 100 ? 'good' : 'degraded',
            latency: node.latency,
            lastSync: node.lastSync,
            hVar: node.hVar.toFixed(6)
        };
    }

    getRegionalStats() {
        const regionMap = this.getNodesByRegion();
        const stats = [];

        regionMap.forEach((nodes, region) => {
            const active = nodes.filter(n => n.status === 'active').length;
            const avgLatency = nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length;
            const avgHVar = nodes.reduce((sum, n) => sum + n.hVar, 0) / nodes.length;

            stats.push({
                region,
                totalNodes: nodes.length,
                activeNodes: active,
                syncPercentage: (active / nodes.length * 100).toFixed(2),
                avgLatency: avgLatency.toFixed(2),
                avgHVar: avgHVar.toFixed(6),
                status: active / nodes.length > 0.95 ? 'optimal' : active / nodes.length > 0.80 ? 'stable' : 'degraded'
            });
        });

        return stats.sort((a, b) => b.activeNodes - a.activeNodes);
    }

    getGlobalMetrics() {
        return {
            totalNodes: this.core.config.targetNodes,
            activeNodes: this.core.state.activeNodes,
            syncedNodes: this.core.state.syncedNodes,
            syncPercentage: ((this.core.state.syncedNodes / this.core.config.targetNodes) * 100).toFixed(4),
            hVarStability: this.metrics.hVarStability.toFixed(6),
            avgLatency: this.metrics.avgLatency.toFixed(2) + 'ms',
            consensusStrength: (this.metrics.consensusStrength * 100).toFixed(2) + '%',
            lastUpdate: this.core.state.lastUpdate
        };
    }

    simulateNodeActivity() {
        // Simulate some node changes for real-time effect
        const nodeIds = Array.from(this.nodes.keys());
        const randomNode = nodeIds[Math.floor(Math.random() * nodeIds.length)];
        const node = this.nodes.get(randomNode);
        
        if (node) {
            // Randomly update node status
            if (Math.random() > 0.9) {
                node.status = node.status === 'active' ? 'syncing' : 'active';
            }
            
            // Update latency with small variation
            node.latency = Math.max(10, node.latency + (Math.random() * 10 - 5));
            
            // Update last sync time
            node.lastSync = new Date().toISOString();
            
            // Small H-VAR fluctuation
            node.hVar = 0.043 + (Math.random() * 0.0002 - 0.0001);
            
            this.updateMetrics();
        }
    }

    startMonitoring(intervalMs = 2000) {
        console.log('📡 Starting node monitoring...');
        this.monitoringInterval = setInterval(() => {
            this.simulateNodeActivity();
            this.core.emit('nodeMetricsUpdate', this.getGlobalMetrics());
        }, intervalMs);
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            console.log('⏸️ Node monitoring stopped');
        }
    }

    getNodeDistribution() {
        const distribution = {
            byStatus: { active: 0, syncing: 0, offline: 0 },
            byHealth: { excellent: 0, good: 0, degraded: 0 },
            total: this.nodes.size
        };

        this.nodes.forEach(node => {
            distribution.byStatus[node.status]++;
            
            const health = node.latency < 50 ? 'excellent' : node.latency < 100 ? 'good' : 'degraded';
            distribution.byHealth[health]++;
        });

        return distribution;
    }

    // Get critical alerts
    getCriticalAlerts() {
        const alerts = [];
        const regionalStats = this.getRegionalStats();
        
        regionalStats.forEach(stat => {
            if (stat.status === 'degraded') {
                alerts.push({
                    severity: 'warning',
                    region: stat.region,
                    message: `Region ${stat.region} sync below threshold: ${stat.syncPercentage}%`,
                    timestamp: new Date().toISOString()
                });
            }
            
            if (parseFloat(stat.avgLatency) > 100) {
                alerts.push({
                    severity: 'warning',
                    region: stat.region,
                    message: `High latency detected in ${stat.region}: ${stat.avgLatency}ms`,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Check H-VAR stability
        if (Math.abs(this.metrics.hVarStability - 0.0431) > 0.001) {
            alerts.push({
                severity: 'critical',
                region: 'GLOBAL',
                message: `H-VAR stability deviation detected: ${this.metrics.hVarStability.toFixed(6)}`,
                timestamp: new Date().toISOString()
            });
        }

        return alerts;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NodeMonitoringDashboard;
}
