/**
 * ═══════════════════════════════════════════════════════
 * KOSYMBIOSIS FRAMEWORK TEST SUITE v1.0.043
 * ═══════════════════════════════════════════════════════
 * Comprehensive tests for validating the Kosymbiosis framework
 * Tests resonance sync efficiency, node monitoring, IPFS integration,
 * Web3 logging, and narrative interactivity
 */

class KosymbiosisTestSuite {
    constructor() {
        this.results = [];
        this.startTime = null;
        this.endTime = null;
    }

    async runAllTests() {
        console.log('═══════════════════════════════════════════════════════');
        console.log('  KOSYMBIOSIS FRAMEWORK TEST SUITE v1.0.043');
        console.log('  Target Date: Before January 10, 2026');
        console.log('═══════════════════════════════════════════════════════\n');
        
        this.startTime = Date.now();
        
        await this.testCoreFramework();
        await this.testNodeMonitoring();
        await this.testAICVisualization();
        await this.testIPFSIntegration();
        await this.testWeb3Logger();
        await this.testNarrativeInteractivity();
        await this.testResonanceSync();
        await this.testSystemIntegration();
        
        this.endTime = Date.now();
        this.printResults();
        
        return this.getTestSummary();
    }

    async testCoreFramework() {
        console.log('\n🧪 Testing Core Framework...');
        
        try {
            const core = new KosymbiosisCore();
            
            // Test 1: Initialization
            this.assert(
                core.config.resonanceFrequency === 0.043,
                'Core: Resonance frequency should be 0.043 Hz'
            );
            
            // Test 2: Node target
            this.assert(
                core.config.targetNodes === 144000,
                'Core: Target nodes should be 144,000'
            );
            
            // Test 3: NSR drift tolerance
            this.assert(
                core.config.nsrDrift === 0.000,
                'Core: NSR drift should be 0.000%'
            );
            
            // Test 4: Event system
            let eventFired = false;
            core.on('test_event', () => { eventFired = true; });
            core.emit('test_event');
            this.assert(
                eventFired,
                'Core: Event system should work correctly'
            );
            
            // Test 5: Resonance simulation
            core.startResonanceSimulation();
            this.assert(
                core.state.resonanceActive === true,
                'Core: Resonance simulation should start'
            );
            core.stopResonanceSimulation();
            
            // Test 6: H-VAR calculation
            const hvar = core.calculateHVarStability(144000);
            this.assert(
                hvar === 1.0,
                'Core: H-VAR stability should be 1.0 at target nodes'
            );
            
            // Test 7: System health
            const health = core.getSystemHealth();
            this.assert(
                health.overall !== null,
                'Core: System health should return valid data'
            );
            
            // Test 8: Ethical validation
            const validation = core.validateEthicalModel('test_action');
            this.assert(
                validation.nsrCompliant === true,
                'Core: Ethical validation should pass with 0% NSR drift'
            );
            
            console.log('✅ Core Framework tests completed');
            
        } catch (error) {
            this.fail('Core Framework test suite failed: ' + error.message);
        }
    }

    async testNodeMonitoring() {
        console.log('\n🧪 Testing Node Monitoring Dashboard...');
        
        try {
            const core = new KosymbiosisCore();
            const monitor = new NodeMonitoringDashboard(core);
            
            // Test 1: Initialization
            this.assert(
                monitor.nodes.size > 0,
                'NodeMonitor: Should initialize with nodes'
            );
            
            // Test 2: Regional stats
            const regional = monitor.getRegionalStats();
            this.assert(
                regional.length > 0,
                'NodeMonitor: Should return regional statistics'
            );
            
            // Test 3: Global metrics
            const metrics = monitor.getGlobalMetrics();
            this.assert(
                metrics.totalNodes === 144000,
                'NodeMonitor: Total nodes should be 144,000'
            );
            
            // Test 4: Node health
            const nodeHealth = monitor.getNodeHealth(1);
            this.assert(
                nodeHealth !== null,
                'NodeMonitor: Should return health for valid node ID'
            );
            
            // Test 5: H-VAR stability
            this.assert(
                parseFloat(metrics.hVarStability) > 0,
                'NodeMonitor: H-VAR stability should be positive'
            );
            
            // Test 6: Node distribution
            const distribution = monitor.getNodeDistribution();
            this.assert(
                distribution.total === monitor.nodes.size,
                'NodeMonitor: Node distribution should match total nodes'
            );
            
            // Test 7: Critical alerts
            const alerts = monitor.getCriticalAlerts();
            this.assert(
                Array.isArray(alerts),
                'NodeMonitor: Should return alerts array'
            );
            
            console.log('✅ Node Monitoring tests completed');
            
        } catch (error) {
            this.fail('Node Monitoring test suite failed: ' + error.message);
        }
    }

    async testAICVisualization() {
        console.log('\n🧪 Testing AIC Visualization Module...');
        
        try {
            const core = new KosymbiosisCore();
            const viz = new AICVisualization(core);
            
            // Test 1: Initialization
            this.assert(
                viz.settings.resonanceFrequency === 0.043,
                'Visualization: Should use correct resonance frequency'
            );
            
            // Test 2: Available visualizations
            const available = viz.getAvailableVisualizations();
            this.assert(
                available.includes('resonance_wave'),
                'Visualization: Should include resonance wave visualization'
            );
            
            this.assert(
                available.includes('sensisara_model'),
                'Visualization: Should include Sensisara ethical model'
            );
            
            // Test 3: Settings update
            viz.updateSettings({ waveAmplitude: 150 });
            this.assert(
                viz.settings.waveAmplitude === 150,
                'Visualization: Should update settings correctly'
            );
            
            console.log('✅ AIC Visualization tests completed');
            
        } catch (error) {
            this.fail('AIC Visualization test suite failed: ' + error.message);
        }
    }

    async testIPFSIntegration() {
        console.log('\n🧪 Testing IPFS Integration...');
        
        try {
            const core = new KosymbiosisCore();
            const ipfs = new IPFSIntegration(core);
            
            // Test 1: Configuration
            this.assert(
                ipfs.config.manifestCID.length > 0,
                'IPFS: Should have manifest CID configured'
            );
            
            // Test 2: Connection
            await ipfs.connect();
            this.assert(
                ipfs.connected === true,
                'IPFS: Should connect successfully'
            );
            
            this.assert(
                ipfs.peers.length > 0,
                'IPFS: Should have connected peers'
            );
            
            // Test 3: Pinned content
            const pinned = ipfs.getPinnedContent();
            this.assert(
                pinned.length > 0,
                'IPFS: Should have pinned content'
            );
            
            // Test 4: Pin new content
            await ipfs.pinContent('QmTestCID123', { key: 'test_document' });
            this.assert(
                ipfs.pinnedContent.has('QmTestCID123'),
                'IPFS: Should pin new content'
            );
            
            // Test 5: Blockchain anchors
            const anchors = ipfs.getAnchors();
            this.assert(
                anchors.length > 0,
                'IPFS: Should have blockchain anchors'
            );
            
            // Test 6: Create anchor
            const anchor = await ipfs.createAnchor('QmTestAnchor');
            this.assert(
                anchor.cid === 'QmTestAnchor',
                'IPFS: Should create blockchain anchor'
            );
            
            // Test 7: Capital allocations
            const allocations = ipfs.getCapitalAllocations();
            this.assert(
                allocations.length > 0,
                'IPFS: Should track capital allocations'
            );
            
            // Test 8: Content verification
            const verified = await ipfs.verifyContent(ipfs.config.manifestCID);
            this.assert(
                verified === true,
                'IPFS: Should verify content successfully'
            );
            
            console.log('✅ IPFS Integration tests completed');
            
        } catch (error) {
            this.fail('IPFS Integration test suite failed: ' + error.message);
        }
    }

    async testWeb3Logger() {
        console.log('\n🧪 Testing Web3 Logger...');
        
        try {
            const core = new KosymbiosisCore();
            const logger = new Web3Logger(core);
            
            // Test 1: Connection
            await logger.connect();
            this.assert(
                logger.connected === true,
                'Web3Logger: Should connect successfully'
            );
            
            // Test 2: Log creation
            const log = logger.log('system', 'Test message', { test: true });
            this.assert(
                log.message === 'Test message',
                'Web3Logger: Should create log entry'
            );
            
            // Test 3: Log types
            logger.logNodeSync({ syncedNodes: 1000, targetNodes: 144000 });
            logger.logConsensusState({ strength: 95 });
            logger.logResonanceEvent({ frequency: 0.043 });
            
            this.assert(
                logger.logs.length >= 4,
                'Web3Logger: Should accumulate logs'
            );
            
            // Test 4: Log filtering
            const systemLogs = logger.getLogsByType('system');
            this.assert(
                systemLogs.length > 0,
                'Web3Logger: Should filter logs by type'
            );
            
            // Test 5: Recent logs
            const recent = logger.getRecentLogs(10);
            this.assert(
                recent.length > 0,
                'Web3Logger: Should return recent logs'
            );
            
            // Test 6: Statistics
            const stats = logger.getStatistics();
            this.assert(
                stats.total === logger.logs.length,
                'Web3Logger: Statistics should match log count'
            );
            
            // Test 7: Search
            const searched = logger.searchLogs('test');
            this.assert(
                searched.length > 0,
                'Web3Logger: Should search logs successfully'
            );
            
            console.log('✅ Web3 Logger tests completed');
            
        } catch (error) {
            this.fail('Web3 Logger test suite failed: ' + error.message);
        }
    }

    async testNarrativeInteractivity() {
        console.log('\n🧪 Testing Narrative Interactivity...');
        
        try {
            const core = new KosymbiosisCore();
            const narrative = new NarrativeInteractivity(core);
            
            // Test 1: Narratives loaded
            this.assert(
                narrative.narratives.size > 0,
                'Narrative: Should load narratives'
            );
            
            // Test 2: Available narratives
            const available = narrative.getAvailableNarratives();
            this.assert(
                available.length > 0,
                'Narrative: Should have unlocked narratives'
            );
            
            // Test 3: Get narrative
            const seedbringer = narrative.getNarrative('seedbringer_origin');
            this.assert(
                seedbringer !== null,
                'Narrative: Should retrieve narrative content'
            );
            
            // Test 4: Plant seed interaction
            const result = await narrative.executeInteraction('plant_seed');
            this.assert(
                result.success === true,
                'Narrative: Should execute plant_seed interaction'
            );
            
            this.assert(
                narrative.userProgress.resonanceLevel > 0,
                'Narrative: Should increase resonance level'
            );
            
            // Test 5: Resonance interaction
            const resonance = await narrative.executeInteraction('resonate');
            this.assert(
                resonance.success === true,
                'Narrative: Should execute resonate interaction'
            );
            
            // Test 6: NSR check
            const nsr = await narrative.executeInteraction('check_nsr');
            this.assert(
                nsr.success === true,
                'Narrative: Should validate NSR successfully'
            );
            
            // Test 7: User progress
            const progress = narrative.getUserProgress();
            this.assert(
                progress.totalAchievements > 0,
                'Narrative: Should track achievements'
            );
            
            // Test 8: Generate test
            const test = narrative.generateTest('seedbringer_origin');
            this.assert(
                test !== null && test.questions.length > 0,
                'Narrative: Should generate knowledge test'
            );
            
            // Test 9: Submit test
            const testResult = narrative.submitTest('seedbringer_origin', [0, 1]);
            this.assert(
                testResult.score >= 0,
                'Narrative: Should evaluate test submission'
            );
            
            console.log('✅ Narrative Interactivity tests completed');
            
        } catch (error) {
            this.fail('Narrative Interactivity test suite failed: ' + error.message);
        }
    }

    async testResonanceSync() {
        console.log('\n🧪 Testing Resonance Synchronization Efficiency...');
        
        try {
            const core = new KosymbiosisCore();
            const monitor = new NodeMonitoringDashboard(core);
            
            // Test 1: Sync efficiency at various node counts
            const syncTests = [
                { nodes: 144000, expected: 1.0 },
                { nodes: 100000, expected: 0.694 },
                { nodes: 50000, expected: 0.347 }
            ];
            
            syncTests.forEach(test => {
                const efficiency = core.calculateHVarStability(test.nodes);
                this.assert(
                    Math.abs(efficiency - test.expected) < 0.01,
                    `Resonance: Sync efficiency at ${test.nodes} nodes should be ~${test.expected}`
                );
            });
            
            // Test 2: Resonance frequency stability
            core.startResonanceSimulation();
            await this.sleep(500);
            
            this.assert(
                core.state.resonanceActive === true,
                'Resonance: Should maintain active state'
            );
            
            core.stopResonanceSimulation();
            
            // Test 3: Node synchronization rate
            const metrics = monitor.getGlobalMetrics();
            const syncRate = parseFloat(metrics.syncPercentage);
            
            this.assert(
                syncRate >= 0 && syncRate <= 100,
                'Resonance: Sync rate should be valid percentage'
            );
            
            // Test 4: H-VAR variance tolerance
            const hvar = parseFloat(metrics.hVarStability);
            const targetHVar = 0.0431;
            const variance = Math.abs(hvar - targetHVar);
            
            this.assert(
                variance < 0.01,
                'Resonance: H-VAR variance should be within tolerance'
            );
            
            console.log('✅ Resonance Sync tests completed');
            
        } catch (error) {
            this.fail('Resonance Sync test suite failed: ' + error.message);
        }
    }

    async testSystemIntegration() {
        console.log('\n🧪 Testing System Integration...');
        
        try {
            const core = new KosymbiosisCore();
            const monitor = new NodeMonitoringDashboard(core);
            const ipfs = new IPFSIntegration(core);
            const logger = new Web3Logger(core);
            const narrative = new NarrativeInteractivity(core);
            
            // Test 1: Core event propagation
            let eventReceived = false;
            core.on('integration_test', () => { eventReceived = true; });
            core.emit('integration_test');
            
            this.assert(
                eventReceived === true,
                'Integration: Events should propagate correctly'
            );
            
            // Test 2: Cross-module communication
            await ipfs.connect();
            await logger.connect();
            
            this.assert(
                ipfs.connected && logger.connected,
                'Integration: Modules should connect independently'
            );
            
            // Test 3: Full system status
            const status = core.getStatus();
            
            this.assert(
                status.core !== null && status.state !== null,
                'Integration: Should return complete system status'
            );
            
            // Test 4: Concurrent operations
            core.startResonanceSimulation();
            monitor.startMonitoring(1000);
            
            await this.sleep(2000);
            
            this.assert(
                core.state.resonanceActive === true,
                'Integration: Should handle concurrent operations'
            );
            
            core.stopResonanceSimulation();
            monitor.stopMonitoring();
            
            // Test 5: Data consistency
            const health = core.getSystemHealth();
            const monitorMetrics = monitor.getGlobalMetrics();
            
            this.assert(
                health.nodes.active === core.state.activeNodes,
                'Integration: Node counts should be consistent across modules'
            );
            
            console.log('✅ System Integration tests completed');
            
        } catch (error) {
            this.fail('System Integration test suite failed: ' + error.message);
        }
    }

    assert(condition, message) {
        const result = {
            passed: condition,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        this.results.push(result);
        
        if (condition) {
            console.log(`  ✓ ${message}`);
        } else {
            console.log(`  ✗ FAILED: ${message}`);
        }
    }

    fail(message) {
        this.results.push({
            passed: false,
            message: message,
            timestamp: new Date().toISOString()
        });
        console.log(`  ✗ ERROR: ${message}`);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    printResults() {
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;
        const percentage = ((passed / total) * 100).toFixed(2);
        const duration = ((this.endTime - this.startTime) / 1000).toFixed(2);
        
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('  TEST RESULTS SUMMARY');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`  Total Tests:    ${total}`);
        console.log(`  Passed:         ${passed} ✓`);
        console.log(`  Failed:         ${failed} ✗`);
        console.log(`  Success Rate:   ${percentage}%`);
        console.log(`  Duration:       ${duration}s`);
        console.log('═══════════════════════════════════════════════════════');
        
        if (failed === 0) {
            console.log('\n  🎉 ALL TESTS PASSED! System ready for deployment.');
            console.log('  ✅ Kosymbiosis Framework validated for Jan 10, 2026');
        } else {
            console.log('\n  ⚠️  Some tests failed. Review required before deployment.');
        }
        
        console.log('\n');
    }

    getTestSummary() {
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;
        
        return {
            total,
            passed,
            failed,
            percentage: ((passed / total) * 100).toFixed(2),
            duration: ((this.endTime - this.startTime) / 1000).toFixed(2),
            ready: failed === 0,
            results: this.results
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KosymbiosisTestSuite;
}

// Auto-run tests if executed directly
if (typeof window === 'undefined' && typeof require !== 'undefined') {
    // Import required modules for Node.js environment
    const KosymbiosisCore = require('./kosymbiosis-core.js');
    const NodeMonitoringDashboard = require('./node-monitoring.js');
    const AICVisualization = require('./aic-visualization.js');
    const IPFSIntegration = require('./ipfs-integration.js');
    const Web3Logger = require('./web3-logger.js');
    const NarrativeInteractivity = require('./narrative-interactivity.js');
    
    // Make them globally available for tests
    global.KosymbiosisCore = KosymbiosisCore;
    global.NodeMonitoringDashboard = NodeMonitoringDashboard;
    global.AICVisualization = AICVisualization;
    global.IPFSIntegration = IPFSIntegration;
    global.Web3Logger = Web3Logger;
    global.NarrativeInteractivity = NarrativeInteractivity;
    
    (async () => {
        const testSuite = new KosymbiosisTestSuite();
        const summary = await testSuite.runAllTests();
        process.exit(summary.failed > 0 ? 1 : 0);
    })();
}
