/**
 * API Discovery Service
 * Automatically detects, parses, and validates APIs
 */
import axios from 'axios';
import logger from '../utils/logger.js';
import SchemaValidator from '../utils/validator.js';
import config from '../config/index.js';

class APIDiscoveryService {
  constructor() {
    this.discoveredAPIs = new Map();
    this.validator = new SchemaValidator();
    this.discoveryInterval = null;
  }

  /**
   * Start automatic API discovery
   */
  start() {
    if (!config.apiDiscovery.enabled) {
      logger.info('API discovery is disabled');
      return;
    }

    logger.info('Starting API discovery service', {
      interval: config.apiDiscovery.interval
    });

    this.discoveryInterval = setInterval(
      () => this.runDiscovery(),
      config.apiDiscovery.interval
    );

    // Run initial discovery
    this.runDiscovery();
  }

  /**
   * Stop automatic API discovery
   */
  stop() {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
      logger.info('API discovery service stopped');
    }
  }

  /**
   * Run discovery cycle
   */
  async runDiscovery() {
    logger.info('Running API discovery cycle');
    // Discovery logic will be triggered by registered endpoints
  }

  /**
   * Register an API endpoint for monitoring
   * @param {string} apiId - Unique API identifier
   * @param {Object} config - API configuration
   */
  async registerAPI(apiId, apiConfig) {
    try {
      logger.info('Registering API', { apiId, url: apiConfig.url });

      const apiInfo = {
        id: apiId,
        url: apiConfig.url,
        method: apiConfig.method || 'GET',
        headers: apiConfig.headers || {},
        openApiSpec: null,
        schema: null,
        registered: new Date().toISOString(),
        lastChecked: null,
        status: 'pending'
      };

      // Try to fetch OpenAPI spec if available
      if (apiConfig.openApiUrl) {
        try {
          const spec = await this.fetchOpenAPISpec(apiConfig.openApiUrl);
          apiInfo.openApiSpec = spec;
          apiInfo.schema = this.extractSchemaFromOpenAPI(spec, apiConfig.path);
          logger.info('OpenAPI spec loaded', { apiId });
        } catch (error) {
          logger.warn('Failed to load OpenAPI spec', { 
            apiId, 
            error: error.message 
          });
        }
      }

      // If no schema from OpenAPI, try to infer from sample
      if (!apiInfo.schema && apiConfig.autoInferSchema) {
        try {
          const sample = await this.fetchSample(apiInfo);
          apiInfo.schema = this.validator.inferSchema(sample);
          logger.info('Schema inferred from sample data', { apiId });
        } catch (error) {
          logger.warn('Failed to infer schema', { 
            apiId, 
            error: error.message 
          });
        }
      }

      // Register schema if available
      if (apiInfo.schema) {
        this.validator.registerSchema(apiId, apiInfo.schema);
      }

      apiInfo.status = 'active';
      apiInfo.lastChecked = new Date().toISOString();
      this.discoveredAPIs.set(apiId, apiInfo);

      logger.info('API registered successfully', { apiId });
      return apiInfo;
    } catch (error) {
      logger.error('Failed to register API', { 
        apiId, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Fetch OpenAPI specification
   * @param {string} url - URL to OpenAPI spec
   * @returns {Object} - OpenAPI specification
   */
  async fetchOpenAPISpec(url) {
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * Extract schema from OpenAPI spec
   * @param {Object} spec - OpenAPI specification
   * @param {string} path - API path
   * @returns {Object} - JSON Schema
   */
  extractSchemaFromOpenAPI(spec, path) {
    try {
      // OpenAPI 3.0 format
      if (spec.openapi && spec.paths && spec.paths[path]) {
        const pathItem = spec.paths[path];
        const operation = pathItem.get || pathItem.post;
        
        if (operation && operation.responses) {
          const successResponse = operation.responses['200'] || 
                                  operation.responses['201'];
          
          if (successResponse && successResponse.content) {
            const jsonContent = successResponse.content['application/json'];
            if (jsonContent && jsonContent.schema) {
              return jsonContent.schema;
            }
          }
        }
      }

      // OpenAPI 2.0 (Swagger) format
      if (spec.swagger && spec.paths && spec.paths[path]) {
        const pathItem = spec.paths[path];
        const operation = pathItem.get || pathItem.post;
        
        if (operation && operation.responses) {
          const successResponse = operation.responses['200'] || 
                                  operation.responses['201'];
          if (successResponse && successResponse.schema) {
            return successResponse.schema;
          }
        }
      }

      return null;
    } catch (error) {
      logger.error('Failed to extract schema from OpenAPI', { 
        error: error.message 
      });
      return null;
    }
  }

  /**
   * Fetch sample data from API
   * @param {Object} apiInfo - API information
   * @returns {Object} - Sample data
   */
  async fetchSample(apiInfo) {
    const response = await axios({
      method: apiInfo.method,
      url: apiInfo.url,
      headers: apiInfo.headers,
      timeout: 10000
    });

    return response.data;
  }

  /**
   * Validate API response
   * @param {string} apiId - API identifier
   * @param {Object} data - Response data
   * @returns {Object} - Validation result
   */
  validateResponse(apiId, data) {
    const apiInfo = this.discoveredAPIs.get(apiId);
    
    if (!apiInfo) {
      return {
        valid: false,
        errors: [`API ${apiId} not registered`]
      };
    }

    if (!apiInfo.schema) {
      return {
        valid: true,
        errors: [],
        warning: 'No schema available for validation'
      };
    }

    return this.validator.validate(apiId, data);
  }

  /**
   * Health check for all registered APIs
   * @returns {Object} - Health status
   */
  async healthCheck() {
    const results = {
      timestamp: new Date().toISOString(),
      total: this.discoveredAPIs.size,
      healthy: 0,
      unhealthy: 0,
      apis: []
    };

    for (const [apiId, apiInfo] of this.discoveredAPIs) {
      try {
        const start = Date.now();
        await axios({
          method: apiInfo.method,
          url: apiInfo.url,
          headers: apiInfo.headers,
          timeout: 5000
        });
        const latency = Date.now() - start;

        apiInfo.lastChecked = new Date().toISOString();
        apiInfo.status = 'healthy';
        results.healthy++;
        
        results.apis.push({
          id: apiId,
          status: 'healthy',
          latency
        });
      } catch (error) {
        apiInfo.status = 'unhealthy';
        results.unhealthy++;
        
        results.apis.push({
          id: apiId,
          status: 'unhealthy',
          error: error.message
        });
      }
    }

    logger.info('Health check completed', {
      healthy: results.healthy,
      unhealthy: results.unhealthy
    });

    return results;
  }

  /**
   * Get all registered APIs
   * @returns {Array} - Array of API information
   */
  getRegisteredAPIs() {
    return Array.from(this.discoveredAPIs.values());
  }

  /**
   * Get specific API info
   * @param {string} apiId - API identifier
   * @returns {Object|null} - API information
   */
  getAPI(apiId) {
    return this.discoveredAPIs.get(apiId) || null;
  }

  /**
   * Remove API registration
   * @param {string} apiId - API identifier
   */
  removeAPI(apiId) {
    this.discoveredAPIs.delete(apiId);
    this.validator.removeSchema(apiId);
    logger.info('API removed', { apiId });
  }
}

export default APIDiscoveryService;
