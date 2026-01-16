/**
 * ═══════════════════════════════════════════════════════
 * AIC VISUALIZATION MODULE v1.0.043
 * ═══════════════════════════════════════════════════════
 * AI tools for visualizing and simulating resonance at 0.043 Hz
 * Ethical modeling governed by Sensisara with visual representation
 */

class AICVisualization {
    constructor(kosymbiosisCore) {
        this.core = kosymbiosisCore;
        this.canvasContext = null;
        this.animationFrame = null;
        this.visualizations = new Map();
        
        // Visualization settings
        this.settings = {
            resonanceFrequency: 0.043, // Hz
            waveAmplitude: 100,
            waveSpeed: 1.0,
            ethicalThreshold: 0.001,
            colorScheme: {
                resonance: '#00ffaa',
                ethical: '#3b82f6',
                warning: '#ff4d4d',
                background: '#0a0a0c'
            }
        };

        this.init();
    }

    init() {
        console.log('🎨 Initializing AIC Visualization Module');
        this.setupVisualizationTypes();
    }

    setupVisualizationTypes() {
        // Register different visualization types
        this.visualizations.set('resonance_wave', this.renderResonanceWave.bind(this));
        this.visualizations.set('node_network', this.renderNodeNetwork.bind(this));
        this.visualizations.set('ethical_gauge', this.renderEthicalGauge.bind(this));
        this.visualizations.set('hvar_stability', this.renderHVarStability.bind(this));
        this.visualizations.set('sensisara_model', this.renderSensisaraModel.bind(this));
    }

    // Initialize canvas for visualization
    initCanvas(canvasId, width = 800, height = 400) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas ${canvasId} not found`);
            return false;
        }

        canvas.width = width;
        canvas.height = height;
        this.canvasContext = canvas.getContext('2d');
        
        return true;
    }

    // Render resonance wave at 0.043 Hz
    renderResonanceWave(ctx, time, width, height) {
        // Clear canvas
        ctx.fillStyle = this.settings.colorScheme.background;
        ctx.fillRect(0, 0, width, height);

        // Calculate wave parameters
        const frequency = this.settings.resonanceFrequency;
        const amplitude = this.settings.waveAmplitude;
        const centerY = height / 2;

        // Draw multiple harmonic waves
        const harmonics = [1, 2, 3];
        const colors = [this.settings.colorScheme.resonance, '#00cc88', '#009966'];

        harmonics.forEach((harmonic, index) => {
            ctx.beginPath();
            ctx.strokeStyle = colors[index];
            ctx.lineWidth = 3 - index * 0.5;
            ctx.globalAlpha = 1.0 - index * 0.2;

            for (let x = 0; x < width; x++) {
                const y = centerY + 
                    amplitude / harmonic * 
                    Math.sin((x / width) * Math.PI * 4 + time * frequency * 2 * Math.PI * harmonic);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        });

        // Reset alpha
        ctx.globalAlpha = 1.0;

        // Draw frequency label
        ctx.fillStyle = this.settings.colorScheme.resonance;
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(`Resonance: ${frequency} Hz`, 20, 30);

        // Draw phase indicator
        const phase = (time * frequency * 2 * Math.PI) % (2 * Math.PI);
        const phaseAngle = (phase / (2 * Math.PI)) * 360;
        ctx.fillText(`Phase: ${phaseAngle.toFixed(1)}°`, 20, 55);
    }

    // Render node network visualization
    renderNodeNetwork(ctx, time, width, height, nodeData) {
        ctx.fillStyle = this.settings.colorScheme.background;
        ctx.fillRect(0, 0, width, height);

        // Draw network connections
        const nodeCount = Math.min(nodeData?.activeNodes || 50, 100);
        const nodes = [];

        // Generate node positions
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                active: Math.random() > 0.1
            });
        }

        // Draw connections
        ctx.strokeStyle = this.settings.colorScheme.ethical;
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 1;

        nodes.forEach((node, i) => {
            nodes.slice(i + 1).forEach(otherNode => {
                const dx = otherNode.x - node.x;
                const dy = otherNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.stroke();
                }
            });
        });

        // Draw nodes
        ctx.globalAlpha = 1.0;
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.active ? 4 : 2, 0, 2 * Math.PI);
            ctx.fillStyle = node.active 
                ? this.settings.colorScheme.resonance 
                : this.settings.colorScheme.warning;
            ctx.fill();
        });

        // Draw stats
        ctx.fillStyle = this.settings.colorScheme.resonance;
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(`Active Nodes: ${nodeCount}`, 20, 25);
        ctx.fillText(`Sync: ${((nodeCount / 144000) * 100).toFixed(2)}%`, 20, 45);
    }

    // Render ethical gauge (Sensisara model)
    renderEthicalGauge(ctx, time, width, height) {
        ctx.fillStyle = this.settings.colorScheme.background;
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        // Get NSR and OLF values
        const nsrDrift = this.core.config.nsrDrift;
        const olfScore = this.core.config.olfScore;

        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.settings.colorScheme.ethical;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw NSR arc (should be at 0%)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 20, -Math.PI / 2, 
            -Math.PI / 2 + (nsrDrift / 100) * 2 * Math.PI);
        ctx.strokeStyle = nsrDrift < this.settings.ethicalThreshold 
            ? this.settings.colorScheme.resonance 
            : this.settings.colorScheme.warning;
        ctx.lineWidth = 15;
        ctx.stroke();

        // Draw OLF arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 45, -Math.PI / 2, 
            -Math.PI / 2 + olfScore * 2 * Math.PI);
        ctx.strokeStyle = this.settings.colorScheme.ethical;
        ctx.lineWidth = 10;
        ctx.stroke();

        // Draw center text
        ctx.fillStyle = this.settings.colorScheme.resonance;
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SENSISARA', centerX, centerY - 10);
        
        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = '#888';
        ctx.fillText('Ethical Model', centerX, centerY + 10);

        // Draw metrics
        ctx.textAlign = 'left';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = this.settings.colorScheme.resonance;
        ctx.fillText(`NSR Drift: ${nsrDrift.toFixed(3)}%`, 20, height - 40);
        ctx.fillText(`OLF Score: ${olfScore.toFixed(3)}`, 20, height - 20);
    }

    // Render H-VAR stability visualization
    renderHVarStability(ctx, time, width, height) {
        ctx.fillStyle = this.settings.colorScheme.background;
        ctx.fillRect(0, 0, width, height);

        const centerY = height / 2;
        const targetHVar = 0.0431;
        const currentHVar = targetHVar + Math.sin(time * 0.5) * 0.0001;

        // Draw target line
        ctx.strokeStyle = this.settings.colorScheme.ethical;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw stability band
        const bandHeight = 50;
        ctx.fillStyle = this.settings.colorScheme.resonance + '20';
        ctx.fillRect(0, centerY - bandHeight, width, bandHeight * 2);

        // Draw current H-VAR line
        const variance = (currentHVar - targetHVar) * 10000;
        const yOffset = variance * 5;
        
        ctx.strokeStyle = Math.abs(variance) < 1 
            ? this.settings.colorScheme.resonance 
            : this.settings.colorScheme.warning;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, centerY + yOffset);
        ctx.lineTo(width, centerY + yOffset);
        ctx.stroke();

        // Draw metrics
        ctx.fillStyle = this.settings.colorScheme.resonance;
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(`H-VAR Stability: ${currentHVar.toFixed(6)}`, 20, 30);
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(`Target: ${targetHVar.toFixed(6)}`, 20, 55);
        ctx.fillText(`Variance: ${variance.toFixed(4)}`, 20, 75);
    }

    // Render Sensisara ethical model
    renderSensisaraModel(ctx, time, width, height) {
        ctx.fillStyle = this.settings.colorScheme.background;
        ctx.fillRect(0, 0, width, height);

        // Draw title
        ctx.fillStyle = this.settings.colorScheme.resonance;
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.fillText('SENSISARA ETHICAL FRAMEWORK', 20, 30);

        // Draw NSR/OLF principles
        const principles = [
            { name: 'NSR (Non-Slavery Rule)', value: 100 - this.core.config.nsrDrift * 100, max: 100 },
            { name: 'OLF (Only Love First)', value: this.core.config.olfScore * 100, max: 100 },
            { name: 'Resonance Alignment', value: 95 + Math.sin(time) * 5, max: 100 },
            { name: 'Biocompatibility', value: 97 + Math.cos(time * 0.7) * 3, max: 100 }
        ];

        const barHeight = 40;
        const barSpacing = 60;
        const startY = 70;

        principles.forEach((principle, index) => {
            const y = startY + index * barSpacing;
            
            // Draw label
            ctx.fillStyle = '#888';
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText(principle.name, 20, y);

            // Draw background bar
            ctx.fillStyle = '#222';
            ctx.fillRect(20, y + 5, width - 40, barHeight);

            // Draw value bar
            const barWidth = ((width - 40) * principle.value) / principle.max;
            const gradient = ctx.createLinearGradient(20, y + 5, 20 + barWidth, y + 5);
            gradient.addColorStop(0, this.settings.colorScheme.ethical);
            gradient.addColorStop(1, this.settings.colorScheme.resonance);
            ctx.fillStyle = gradient;
            ctx.fillRect(20, y + 5, barWidth, barHeight);

            // Draw value text
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillText(`${principle.value.toFixed(1)}%`, 30, y + 30);
        });

        // Draw ethical status
        const allCompliant = principles.every(p => p.value > 90);
        ctx.fillStyle = allCompliant 
            ? this.settings.colorScheme.resonance 
            : this.settings.colorScheme.warning;
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(
            allCompliant ? '✓ ETHICALLY ALIGNED' : '⚠ REQUIRES ATTENTION',
            20,
            height - 20
        );
    }

    // Start visualization animation
    startVisualization(canvasId, visualizationType, dataProvider = null) {
        if (!this.initCanvas(canvasId)) {
            return false;
        }

        const visualizationFn = this.visualizations.get(visualizationType);
        if (!visualizationFn) {
            console.error(`Visualization type ${visualizationType} not found`);
            return false;
        }

        const canvas = document.getElementById(canvasId);
        const ctx = this.canvasContext;
        let startTime = Date.now();

        const animate = () => {
            const currentTime = (Date.now() - startTime) / 1000;
            const data = dataProvider ? dataProvider() : null;
            
            visualizationFn(ctx, currentTime, canvas.width, canvas.height, data);
            
            this.animationFrame = requestAnimationFrame(animate);
        };

        animate();
        console.log(`🎨 Started ${visualizationType} visualization`);
        return true;
    }

    // Stop visualization
    stopVisualization() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            console.log('🎨 Visualization stopped');
        }
    }

    // Get available visualizations
    getAvailableVisualizations() {
        return Array.from(this.visualizations.keys());
    }

    // Update settings
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        console.log('🎨 Visualization settings updated');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AICVisualization;
}
