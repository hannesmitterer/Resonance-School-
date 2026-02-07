/**
 * ═══════════════════════════════════════════════════════
 * IVBS DASHBOARD - Phase 8 Visualization
 * ═══════════════════════════════════════════════════════
 * 
 * Integrated Vital Biological System Dashboard
 * Real-time visualization of bio-digital synthesis
 */

class IVBSDashboard {
  constructor() {
    this.bioSynthesis = null;
    this.updateInterval = 2000;
    this.updateTimer = null;
    this.historyLength = 30;
    this.dataHistory = {
      biological: [],
      digital: [],
      synthesis: []
    };
  }

  /**
   * Initialize IVBS Dashboard
   */
  async initialize(containerId, bioSynthesisInstance) {
    console.log('📊 Initializing IVBS Dashboard');
    
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Container not found: ' + containerId);
      return;
    }

    this.bioSynthesis = bioSynthesisInstance || window.bioSynthesis;
    
    if (!this.bioSynthesis) {
      console.error('Bio-Digital Synthesis instance not found');
      return;
    }

    this.render();
    this.setupEventListeners();
    this.startAutoUpdate();
    
    console.log('✅ IVBS Dashboard initialized');
  }

  /**
   * Render the dashboard
   */
  render() {
    if (!this.container) return;

    const status = this.bioSynthesis.getStatus();
    const ivbsHealth = status.ivbsHealth;
    const biological = status.biologicalMetrics;
    const signal = status.signalIntegrity;
    const socialROI = status.socialROI;

    const html = `
      <div class="ivbs-dashboard">
        <div class="dashboard-header-ivbs">
          <h2>🌱 IVBS - Integrated Vital Biological System</h2>
          <div class="phase-badge">Phase 8: Bio-Digital Synthesis</div>
        </div>

        <!-- IVBS Health Overview -->
        <div class="ivbs-health-panel">
          <h3>Overall IVBS Health</h3>
          <div class="health-gauge">
            <div class="gauge-container">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E5E5E0" stroke-width="20"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="${this.getHealthColor(ivbsHealth.overall)}" 
                  stroke-width="20" stroke-dasharray="${2 * Math.PI * 80}" 
                  stroke-dashoffset="${2 * Math.PI * 80 * (1 - ivbsHealth.overall / 100)}"
                  transform="rotate(-90 100 100)" stroke-linecap="round"/>
                <text x="100" y="100" text-anchor="middle" dy=".3em" font-size="36" font-weight="bold" fill="#2D2D2D">
                  ${ivbsHealth.overall}%
                </text>
                <text x="100" y="130" text-anchor="middle" font-size="14" fill="#666">
                  ${ivbsHealth.status}
                </text>
              </svg>
            </div>
            <div class="health-breakdown">
              <div class="health-component">
                <span class="component-label">🌿 Biological</span>
                <div class="component-bar">
                  <div class="bar-fill" style="width: ${ivbsHealth.biological}%; background: #27ae60;"></div>
                </div>
                <span class="component-value">${ivbsHealth.biological}%</span>
              </div>
              <div class="health-component">
                <span class="component-label">📡 Digital</span>
                <div class="component-bar">
                  <div class="bar-fill" style="width: ${ivbsHealth.digital}%; background: #3498db;"></div>
                </div>
                <span class="component-value">${ivbsHealth.digital}%</span>
              </div>
              <div class="health-component">
                <span class="component-label">✨ Synthesis</span>
                <div class="component-bar">
                  <div class="bar-fill" style="width: ${ivbsHealth.synthesis}%; background: #C5A059;"></div>
                </div>
                <span class="component-value">${ivbsHealth.synthesis}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Living Signal Calibration -->
        <div class="living-signal-panel">
          <h3>📊 Living Signal Calibration</h3>
          <div class="signal-metrics">
            <div class="metric-card bio">
              <h4>Soil Moisture</h4>
              <div class="metric-value">${biological.soilMoisture.level.toFixed(1)}%</div>
              <div class="metric-trend ${biological.soilMoisture.trend}">${biological.soilMoisture.trend}</div>
            </div>
            <div class="metric-card bio">
              <h4>Mycelium Vitality</h4>
              <div class="metric-value">${biological.myceliumHealth.networkVitality.toFixed(0)}%</div>
              <div class="metric-detail">${biological.myceliumHealth.nodeConnections.toLocaleString()} nodes</div>
            </div>
            <div class="metric-card bio">
              <h4>Bio-Resonance</h4>
              <div class="metric-value">${biological.bioResonance.coherence}%</div>
              <div class="metric-detail">@ ${biological.bioResonance.frequency} Hz</div>
            </div>
            <div class="metric-card digital">
              <h4>GPS Integrity</h4>
              <div class="metric-value">${signal.gpsStatus.accuracy.toFixed(1)}m</div>
              <div class="metric-status ${signal.gpsStatus.spoofingDetected ? 'alert' : 'ok'}">
                ${signal.gpsStatus.spoofingDetected ? '⚠️ SPOOFING' : '✅ CLEAN'}
              </div>
            </div>
            <div class="metric-card digital">
              <h4>Frequency Shield</h4>
              <div class="metric-value">${100 - signal.frequencyShield.dissonanceLevel}%</div>
              <div class="metric-detail">Dissonance: ${signal.frequencyShield.dissonanceLevel.toFixed(0)}%</div>
            </div>
            <div class="metric-card digital">
              <h4>Jamming Attempts</h4>
              <div class="metric-value">${signal.frequencyShield.jammingAttempts}</div>
              <div class="metric-detail">IFPS Active</div>
            </div>
          </div>
          <canvas id="livingSignalChart" width="800" height="200"></canvas>
        </div>

        <!-- S-ROI (Social Return on Investment) -->
        <div class="sroi-panel">
          <h3>💚 S-ROI - Social Return on Investment</h3>
          <div class="sroi-radar">
            <canvas id="sroiRadar" width="400" height="400"></canvas>
          </div>
          <div class="sroi-metrics">
            <div class="sroi-metric">
              <span class="sroi-label">Resonance Fertility</span>
              <span class="sroi-value">${socialROI.resonanceFertility}%</span>
            </div>
            <div class="sroi-metric">
              <span class="sroi-label">NSR Compliance</span>
              <span class="sroi-value">${socialROI.nsrCompliance}%</span>
            </div>
            <div class="sroi-metric">
              <span class="sroi-label">OLF Alignment</span>
              <span class="sroi-value">${socialROI.olfAlignment}%</span>
            </div>
            <div class="sroi-metric">
              <span class="sroi-label">Community Coherence</span>
              <span class="sroi-value">${socialROI.communityCoherence}%</span>
            </div>
            <div class="sroi-metric">
              <span class="sroi-label">Bio-Digital Synthesis</span>
              <span class="sroi-value">${socialROI.bioDigitalSynthesis}%</span>
            </div>
          </div>
        </div>

        <!-- UIFS Classification Stream -->
        <div class="uifs-panel">
          <h3>🔍 UIFS - Signal Classification</h3>
          <div class="uifs-legend">
            <span class="legend-item"><span class="dot living"></span> Living Data</span>
            <span class="legend-item"><span class="dot dead"></span> Dead Data</span>
            <span class="legend-item"><span class="dot unknown"></span> Uncategorized</span>
          </div>
          <div id="uifsStream" class="uifs-stream">
            ${this.renderUIFSStream(status.recentClassifications)}
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.initializeVisualizations();
  }

  /**
   * Get health color based on percentage
   */
  getHealthColor(percentage) {
    if (percentage >= 85) return '#27ae60';
    if (percentage >= 70) return '#C5A059';
    if (percentage >= 50) return '#f39c12';
    return '#e74c3c';
  }

  /**
   * Render UIFS stream
   */
  renderUIFSStream(classifications) {
    if (!classifications || classifications.length === 0) {
      return '<p class="no-data">No signals classified yet...</p>';
    }

    return classifications.reverse().map(item => {
      const typeClass = item.type.replace('_', '-');
      const time = new Date(item.timestamp).toLocaleTimeString();
      
      return `
        <div class="uifs-item ${typeClass}">
          <span class="uifs-time">${time}</span>
          <span class="uifs-id">${item.id}</span>
          <span class="uifs-type ${typeClass}">${item.type}</span>
          <span class="uifs-status">${item.nsrCompliant ? '✅' : '⚠️'} ${item.olfAligned ? '💚' : '⚡'}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Initialize visualizations
   */
  initializeVisualizations() {
    this.drawLivingSignalChart();
    this.drawSROIRadar();
  }

  /**
   * Draw living signal chart
   */
  drawLivingSignalChart() {
    const canvas = document.getElementById('livingSignalChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#F9F8F4';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#E5E5E0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Lato';
    ctx.textAlign = 'left';
    ctx.fillText('100%', 5, 15);
    ctx.fillText('50%', 5, height / 2);
    ctx.fillText('0%', 5, height - 5);

    // Title
    ctx.fillStyle = '#2D2D2D';
    ctx.font = 'bold 14px Lato';
    ctx.textAlign = 'center';
    ctx.fillText('Biological-Digital Correlation (Real-Time)', width / 2, 20);

    // Placeholder message (data history builds over time)
    ctx.fillStyle = '#999';
    ctx.font = '12px Lato';
    ctx.fillText('Data stream active - history building...', width / 2, height / 2);
  }

  /**
   * Draw S-ROI radar chart
   */
  drawSROIRadar() {
    const canvas = document.getElementById('sroiRadar');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    const socialROI = this.bioSynthesis.getSocialROI();
    const metrics = [
      { label: 'Resonance\nFertility', value: socialROI.resonanceFertility },
      { label: 'NSR\nCompliance', value: socialROI.nsrCompliance },
      { label: 'OLF\nAlignment', value: socialROI.olfAlignment },
      { label: 'Community\nCoherence', value: socialROI.communityCoherence },
      { label: 'Bio-Digital\nSynthesis', value: socialROI.bioDigitalSynthesis }
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw concentric circles
    ctx.strokeStyle = '#E5E5E0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw axes
    const angleStep = (2 * Math.PI) / metrics.length;
    metrics.forEach((metric, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Axis line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#2D2D2D';
      ctx.font = '12px Lato';
      ctx.textAlign = 'center';
      const labelX = centerX + Math.cos(angle) * (radius + 30);
      const labelY = centerY + Math.sin(angle) * (radius + 30);
      
      const lines = metric.label.split('\n');
      lines.forEach((line, j) => {
        ctx.fillText(line, labelX, labelY + (j * 14));
      });
    });

    // Draw data polygon
    ctx.beginPath();
    ctx.strokeStyle = '#C5A059';
    ctx.fillStyle = 'rgba(197, 160, 89, 0.3)';
    ctx.lineWidth = 2;

    metrics.forEach((metric, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const distance = (metric.value / 100) * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw data points
    metrics.forEach((metric, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const distance = (metric.value / 100) * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#C5A059';
      ctx.fill();
      ctx.strokeStyle = '#2D2D2D';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (typeof window === 'undefined') return;

    // Listen for bio-synthesis updates
    window.addEventListener('bio-synthesis:update', () => {
      this.render();
    });

    // Listen for spoofing detection
    window.addEventListener('bio-synthesis:spoofing-detected', (event) => {
      console.warn('🛡️ IFPS activated - spoofing detected:', event.detail);
      this.render();
    });
  }

  /**
   * Start auto-update
   */
  startAutoUpdate() {
    this.updateTimer = setInterval(() => {
      this.render();
    }, this.updateInterval);
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
  module.exports = IVBSDashboard;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.IVBSDashboard = IVBSDashboard;
}
