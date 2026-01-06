# Resonance School - Automated Data Integration System

## Overview

The Resonance School Data Integration System is a fully automated solution for live data integration with existing backends, APIs, and IPFS. The system enables autodetection of data streams, real-time updates, validation, and redundant storage within a decentralized IPFS setup.

## Features

### 1. API Discovery & Autodetection
- Automatically identify and parse API structures using OpenAPI specifications
- Dynamic addition of new data sources with schema validation
- Support for REST and WebSocket APIs
- Automatic schema inference from sample data

### 2. Real-Time Streaming & Synchronization
- WebSocket connections for real-time data streaming
- REST polling mechanism as fallback
- Continuous data injection into backend queue
- Schema validation using JSON Schema (via AJV)

### 3. IPFS Redundancy & Storage
- Immutable data storage on IPFS
- Automatic CID version management
- Timestamp and metadata association
- Content pinning for persistence

### 4. Self-Healing & Recovery
- Automated health checks for all components
- Recovery workflows for broken data pipelines
- IPFS backup retrieval
- Exponential backoff retry mechanism

### 5. Monitoring & Visualization
- Prometheus metrics collection
- Real-time monitoring dashboard
- API latency tracking
- IPFS CID change monitoring
- Validation success tracking

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Data Sources                            │
│  (REST APIs, WebSocket Streams, External Services)      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│            API Discovery Service                         │
│  • OpenAPI Spec Parsing                                 │
│  • Schema Validation                                    │
│  • Health Checks                                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│         Real-Time Ingestion Pipeline                    │
│  ┌──────────────┐         ┌──────────────┐            │
│  │  WebSocket   │         │ REST Polling │            │
│  │   Client     │         │   Client     │            │
│  └──────┬───────┘         └──────┬───────┘            │
│         │                         │                     │
│         └────────┬────────────────┘                     │
│                  ▼                                      │
│         ┌────────────────┐                             │
│         │   Data Queue   │                             │
│         └────────┬───────┘                             │
└──────────────────┼─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              IPFS Storage Layer                         │
│  • Immutable Block Storage                             │
│  • CID Version Management                              │
│  • Metadata & Timestamps                               │
│  • Content Pinning                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│          Recovery & Self-Healing                        │
│  • Health Monitoring                                   │
│  • Auto-Recovery                                       │
│  • Backup Management                                   │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│        Monitoring & Visualization                       │
│  • Prometheus Metrics                                  │
│  • Real-time Dashboard                                 │
│  • System Status                                       │
└─────────────────────────────────────────────────────────┘
```

## Installation

### Prerequisites

- Node.js >= 18.0.0
- IPFS daemon running locally or accessible remotely
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/hannesmitterer/Resonance-School-.git
cd Resonance-School-
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
IPFS_HOST=127.0.0.1
IPFS_PORT=5001
IPFS_PROTOCOL=http

API_DISCOVERY_ENABLED=true
WEBSOCKET_ENABLED=true
REST_POLLING_ENABLED=true

METRICS_PORT=9090
DASHBOARD_PORT=3000
```

4. Start IPFS daemon (if not running):
```bash
ipfs daemon
```

## Usage

### Basic Usage

Start the system:
```bash
npm start
```

Access the monitoring dashboard:
```
http://localhost:3000/dashboard
```

Access Prometheus metrics:
```
http://localhost:3000/metrics
```

### Registering Data Sources

Create a configuration file or programmatically register sources:

```javascript
import DataIntegrationSystem from './src/integration-system.js';

const system = new DataIntegrationSystem();
await system.initialize();
await system.start();

// Register a REST API
await system.registerDataSource('my-api', {
  type: 'rest',
  url: 'https://api.example.com/data',
  method: 'GET',
  interval: 10000, // Poll every 10 seconds
  autoInferSchema: true
});

// Register a WebSocket stream
await system.registerDataSource('my-stream', {
  type: 'websocket',
  wsUrl: 'wss://stream.example.com/data',
  url: 'https://api.example.com/health',
  autoInferSchema: true
});
```

### Using OpenAPI Specifications

```javascript
await system.registerDataSource('openapi-service', {
  type: 'rest',
  url: 'https://api.example.com/v1/users',
  openApiUrl: 'https://api.example.com/openapi.json',
  method: 'GET',
  interval: 30000
});
```

### Custom Schema Validation

```javascript
await system.registerDataSource('validated-api', {
  type: 'rest',
  url: 'https://api.example.com/data',
  schema: {
    type: 'object',
    properties: {
      timestamp: { type: 'string', format: 'date-time' },
      value: { type: 'number' },
      status: { type: 'string' }
    },
    required: ['timestamp', 'value']
  }
});
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `IPFS_HOST` | IPFS daemon host | 127.0.0.1 |
| `IPFS_PORT` | IPFS API port | 5001 |
| `IPFS_PROTOCOL` | IPFS protocol | http |
| `API_DISCOVERY_ENABLED` | Enable API discovery | true |
| `WEBSOCKET_ENABLED` | Enable WebSocket streaming | true |
| `REST_POLLING_ENABLED` | Enable REST polling | true |
| `QUEUE_MAX_SIZE` | Maximum queue size | 10000 |
| `QUEUE_BATCH_SIZE` | Batch processing size | 100 |
| `HEALTH_CHECK_INTERVAL` | Health check interval (ms) | 30000 |
| `AUTO_RECOVERY_ENABLED` | Enable auto-recovery | true |
| `METRICS_PORT` | Metrics server port | 9090 |
| `DASHBOARD_PORT` | Dashboard server port | 3000 |

## Monitoring

### Dashboard

The web-based dashboard provides real-time monitoring of:
- System status
- IPFS storage statistics
- Registered APIs and their health
- Recovery service status
- Live data flows

### Prometheus Metrics

Available metrics:
- `api_requests_total` - Total API requests
- `api_latency_seconds` - API latency histogram
- `api_health_status` - API health status gauge
- `ipfs_stores_total` - Total IPFS store operations
- `ipfs_retrieves_total` - Total IPFS retrieve operations
- `ipfs_cid_versions` - CID versions per source
- `queue_size` - Current queue size
- `websocket_connections` - Active WebSocket connections
- `recovery_attempts_total` - Total recovery attempts

### Grafana Integration

Import the metrics endpoint into Grafana:
```
http://localhost:3000/metrics
```

## Self-Healing

The system automatically monitors and recovers from failures:

1. **IPFS Connection**: Automatically reconnects if connection is lost
2. **API Failures**: Retries with exponential backoff
3. **WebSocket Disconnections**: Auto-reconnect with configurable interval
4. **Data Pipeline Breaks**: Restores from IPFS backups

### Recovery Configuration

```env
HEALTH_CHECK_INTERVAL=30000
AUTO_RECOVERY_ENABLED=true
MAX_RETRY_ATTEMPTS=3
RETRY_BACKOFF_MS=1000
```

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

## API Reference

### DataIntegrationSystem

Main system class that orchestrates all components.

#### Methods

- `initialize()` - Initialize the system
- `start()` - Start all components
- `registerDataSource(sourceId, config)` - Register a new data source
- `getStatus()` - Get comprehensive system status
- `shutdown()` - Gracefully shutdown the system

### IPFS Client

Handles IPFS operations.

#### Methods

- `storeData(data, metadata)` - Store data on IPFS
- `retrieveData(cid)` - Retrieve data by CID
- `pinContent(cid)` - Pin content for persistence
- `getCIDHistory(source)` - Get CID history for source
- `createBackup(source)` - Create backup with all versions

### API Discovery Service

Manages API registration and validation.

#### Methods

- `registerAPI(apiId, config)` - Register an API
- `validateResponse(apiId, data)` - Validate API response
- `healthCheck()` - Check health of all APIs
- `getRegisteredAPIs()` - Get all registered APIs

## Troubleshooting

### IPFS Connection Issues

Ensure IPFS daemon is running:
```bash
ipfs daemon
```

Check IPFS configuration in `.env`:
```env
IPFS_HOST=127.0.0.1
IPFS_PORT=5001
```

### API Validation Failures

Disable strict validation temporarily:
```env
API_VALIDATION_STRICT=false
```

### High Memory Usage

Reduce queue size:
```env
QUEUE_MAX_SIZE=5000
QUEUE_BATCH_SIZE=50
```

## Contributing

Contributions are welcome! Please follow the existing code structure and conventions.

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please visit:
https://github.com/hannesmitterer/Resonance-School-/issues

---

**Resonance School** - "Nothing is final, but the structure is Eternal."

Treasury: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2`
