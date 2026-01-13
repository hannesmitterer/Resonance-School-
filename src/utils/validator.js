/**
 * Schema Validator
 * Validates data against JSON schemas for data integrity
 */
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import logger from '../utils/logger.js';

class SchemaValidator {
  constructor() {
    this.ajv = new Ajv({ 
      allErrors: true,
      strict: false 
    });
    addFormats(this.ajv);
    this.schemas = new Map();
  }

  /**
   * Register a schema for validation
   * @param {string} schemaId - Unique identifier for the schema
   * @param {Object} schema - JSON Schema object
   */
  registerSchema(schemaId, schema) {
    try {
      this.ajv.addSchema(schema, schemaId);
      this.schemas.set(schemaId, schema);
      logger.info('Schema registered', { schemaId });
      return true;
    } catch (error) {
      logger.error('Failed to register schema', { 
        schemaId, 
        error: error.message 
      });
      return false;
    }
  }

  /**
   * Validate data against a registered schema
   * @param {string} schemaId - Schema identifier
   * @param {Object} data - Data to validate
   * @returns {Object} - Validation result
   */
  validate(schemaId, data) {
    const validate = this.ajv.getSchema(schemaId);
    
    if (!validate) {
      logger.warn('Schema not found', { schemaId });
      return {
        valid: false,
        errors: [`Schema ${schemaId} not found`]
      };
    }

    const valid = validate(data);
    
    if (!valid) {
      logger.debug('Validation failed', { 
        schemaId, 
        errors: validate.errors 
      });
      
      return {
        valid: false,
        errors: validate.errors.map(err => ({
          path: err.instancePath,
          message: err.message,
          params: err.params
        }))
      };
    }

    logger.debug('Validation successful', { schemaId });
    return { valid: true, errors: [] };
  }

  /**
   * Infer schema from sample data
   * @param {Object} data - Sample data
   * @param {Object} options - Inference options
   * @param {boolean} options.allRequired - Mark all properties as required (default: false)
   * @returns {Object} - Inferred JSON schema
   */
  inferSchema(data, options = {}) {
    const { allRequired = false } = options;
    
    const inferType = (value) => {
      if (value === null) return 'null';
      if (Array.isArray(value)) return 'array';
      return typeof value;
    };

    const buildSchema = (obj) => {
      const type = inferType(obj);
      
      if (type === 'object') {
        const properties = {};
        const required = [];
        
        for (const [key, value] of Object.entries(obj)) {
          properties[key] = buildSchema(value);
          // Only mark as required if explicitly requested
          if (allRequired) {
            required.push(key);
          }
        }
        
        const schema = {
          type: 'object',
          properties
        };
        
        // Only add required field if there are required properties
        if (required.length > 0) {
          schema.required = required;
        }
        
        return schema;
      }
      
      if (type === 'array' && obj.length > 0) {
        // Note: This only analyzes the first element for simplicity
        // For complex schemas, provide explicit schema instead
        return {
          type: 'array',
          items: buildSchema(obj[0])
        };
      }
      
      return { type };
    };

    const schema = buildSchema(data);
    logger.info('Schema inferred from data', { allRequired });
    return schema;
  }

  /**
   * Get all registered schemas
   * @returns {Array} - Array of schema IDs
   */
  getRegisteredSchemas() {
    return Array.from(this.schemas.keys());
  }

  /**
   * Get a specific schema
   * @param {string} schemaId - Schema identifier
   * @returns {Object|null} - Schema object or null
   */
  getSchema(schemaId) {
    return this.schemas.get(schemaId) || null;
  }

  /**
   * Remove a schema
   * @param {string} schemaId - Schema identifier
   */
  removeSchema(schemaId) {
    this.ajv.removeSchema(schemaId);
    this.schemas.delete(schemaId);
    logger.info('Schema removed', { schemaId });
  }
}

export default SchemaValidator;
