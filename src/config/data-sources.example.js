/**
 * Example Configuration for Data Sources
 * 
 * This file provides examples of how to configure different types of data sources
 * for the Resonance School Data Integration System
 */

export const exampleDataSources = [
  // REST API with OpenAPI specification
  {
    id: 'github-api',
    type: 'rest',
    url: 'https://api.github.com/repos/hannesmitterer/Resonance-School-',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Resonance-School-Integration'
    },
    interval: 60000, // Poll every 60 seconds
    openApiUrl: 'https://api.github.com/openapi.json',
    autoInferSchema: true
  },

  // REST API with schema inference
  {
    id: 'crypto-price-feed',
    type: 'rest',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    method: 'GET',
    interval: 30000, // Poll every 30 seconds
    autoInferSchema: true
  },

  // WebSocket data stream
  {
    id: 'websocket-stream',
    type: 'websocket',
    wsUrl: 'wss://stream.example.com/data',
    wsOptions: {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN'
      }
    },
    url: 'https://api.example.com/data', // For health checks
    autoInferSchema: true
  },

  // Custom API with predefined schema
  {
    id: 'custom-api',
    type: 'rest',
    url: 'https://api.custom.com/v1/data',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'YOUR_API_KEY'
    },
    interval: 15000,
    schema: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        value: { type: 'number' },
        status: { type: 'string', enum: ['active', 'inactive'] }
      },
      required: ['timestamp', 'value']
    }
  }
];

/**
 * Usage example:
 * 
 * import DataIntegrationSystem from './src/integration-system.js';
 * import { exampleDataSources } from './src/config/data-sources.example.js';
 * 
 * const system = new DataIntegrationSystem();
 * await system.initialize();
 * await system.start();
 * 
 * // Register data sources
 * for (const source of exampleDataSources) {
 *   await system.registerDataSource(source.id, source);
 * }
 */
