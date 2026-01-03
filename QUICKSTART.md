# 🌊 Kosymbiosis Framework - Quick Start Guide

## Get Started in 3 Minutes

### Option 1: View Dashboard Locally

```bash
# 1. Clone the repository
git clone https://github.com/hannesmitterer/Resonance-School-.git
cd Resonance-School-

# 2. Start a simple web server
python3 -m http.server 8000
# Or: npx http-server -p 8000

# 3. Open in your browser
# Navigate to: http://localhost:8000/kosymbiosis-dashboard.html
```

### Option 2: Run Tests

```bash
# Navigate to scripts directory
cd scripts

# Run the comprehensive test suite
node test-suite.js

# Expected: 56/56 tests passed ✅
```

### Option 3: View Online (After Deployment)

```
# IPFS Gateway
https://ipfs.io/ipfs/<CID>/kosymbiosis-dashboard.html

# GitHub Pages
https://hannesmitterer.github.io/Resonance-School-/kosymbiosis-dashboard.html
```

---

## 🎯 What's Inside

### 1. Main Dashboard
Navigate to **kosymbiosis-dashboard.html** for the complete experience:

- **Overview Tab**: System metrics and quick actions
- **Node Monitor**: 144,000 distributed nodes tracking
- **Visualizations**: Real-time resonance at 0.043 Hz
- **IPFS & Blockchain**: Decentralized data and anchoring
- **Web3 Logs**: Real-time event streaming
- **Narratives**: Interactive Seedbringer stories

### 2. Quick Actions

Once the dashboard loads:

1. **Start Resonance** - Begin 0.043 Hz simulation
2. **Connect IPFS** - Join decentralized network
3. **Connect Web3** - Enable blockchain logging
4. **Run Simulation** - Activate full system demo

### 3. Explore Narratives

Click the **Narratives** tab to:
- Read the Seedbringer origin story
- Take the Sentinel oath
- Meditate on the 0.043 Hz frequency
- Complete knowledge tests
- Earn achievements and increase resonance level

---

## 📊 Key Metrics to Watch

| Metric | Target | Description |
|--------|--------|-------------|
| **Active Nodes** | 144,000 | Distributed network nodes |
| **H-VAR Stability** | 0.0431 | Harmonic variance measure |
| **NSR Drift** | 0.000% | Non-Slavery Rule compliance |
| **OLF Score** | 0.870+ | Only Love First index |
| **Resonance Freq** | 0.043 Hz | The peace frequency |

---

## 🎨 Visualizations Explained

### Resonance Wave (0.043 Hz)
- **What**: Real-time sine wave at peace frequency
- **Why**: Demonstrates harmonic alignment
- **Harmonics**: Shows 3 wave harmonics overlaid

### Node Network
- **What**: Visual graph of distributed nodes
- **Why**: Shows decentralized architecture
- **Features**: Real-time connection updates

### Sensisara Ethical Model
- **What**: NSR/OLF compliance gauge
- **Why**: Validates ethical framework
- **Metrics**: Displays 4 ethical dimensions

### H-VAR Stability
- **What**: Harmonic variance timeline
- **Why**: Monitors system stability
- **Target**: ±0.0001 variance tolerance

---

## 🔧 Troubleshooting

### Dashboard Not Loading?
```bash
# Check if files exist
ls -la kosymbiosis-dashboard.html scripts/

# Verify HTTP server is running
curl http://localhost:8000
```

### Tests Failing?
```bash
# Ensure Node.js is installed
node --version  # Should be v14+

# Run tests with verbose output
node scripts/test-suite.js 2>&1 | tee test-output.log
```

### Visualizations Not Rendering?
- Enable JavaScript in your browser
- Check browser console (F12) for errors
- Try a modern browser (Chrome, Firefox, Safari, Edge)

---

## 📱 Mobile Support

The dashboard is responsive and works on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1280px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

---

## 🚀 Next Steps

1. **Explore**: Click through all tabs
2. **Interact**: Try narrative missions
3. **Monitor**: Watch real-time metrics
4. **Learn**: Complete knowledge tests
5. **Share**: Invite others to join

---

## 🌟 Advanced Usage

### Customize Settings

Edit `scripts/kosymbiosis-core.js`:
```javascript
this.config = {
    resonanceFrequency: 0.043,  // Adjust frequency
    targetNodes: 144000,        // Change node target
    // ... more settings
};
```

### Add Custom Narratives

Edit `scripts/narrative-interactivity.js`:
```javascript
this.narratives.set('my_narrative', {
    title: 'My Story',
    symbol: '🌟',
    content: 'Your narrative content...',
    // ... more config
});
```

### Export Logs

```javascript
// In browser console
const logs = web3Logger.exportLogs('json');
console.log(logs);
// Or: web3Logger.exportLogs('csv')
```

---

## 📚 Additional Resources

- **Main Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Original Concept**: [Resonance School.txt](Resonance%20School.txt)
- **Smart Contract**: [SPDX smart contract V1.1](SPDX%20smart%20contract%20V1.1)

---

## 🙋 FAQ

**Q: What is the 0.043 Hz frequency?**  
A: It represents the harmonic frequency of peace and collective wellbeing in the Kosymbiosis framework.

**Q: What are the 144,000 nodes?**  
A: Distributed network nodes representing global participation in the Resonance School.

**Q: What is NSR/OLF?**  
A: Non-Slavery Rule (NSR) and Only Love First (OLF) are the ethical principles governing all interactions.

**Q: When is Coronation Day?**  
A: January 10, 2026 - The official launch and timelock release date.

**Q: How can I contribute?**  
A: Join the Matrix room, explore the code, suggest improvements via GitHub issues.

---

## 📞 Get Help

- **Matrix**: #resonance-school-log:matrix.org
- **GitHub**: Open an issue
- **Email**: Check repository profile

---

**Happy Exploring! 🌊**

*"Nothing is final, but the structure is Eternal."*

---

**Status**: Ready ✅  
**Version**: 1.0.043  
**Tests**: 56/56 Passed  
**Next**: Deployment to IPFS/Web3
