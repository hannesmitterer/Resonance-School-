/**
 * Basic Unit Tests (no external dependencies required)
 * Tests core functionality without needing IPFS or network access
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import SchemaValidator from '../utils/validator.js';
import config from '../config/index.js';

describe('Configuration Module', () => {
  it('should have valid configuration', () => {
    assert.ok(config);
    assert.ok(config.ipfs);
    assert.ok(config.apiDiscovery);
    assert.ok(config.streaming);
    assert.ok(config.queue);
    assert.ok(config.recovery);
    assert.ok(config.monitoring);
  });

  it('should have correct default values', () => {
    assert.strictEqual(config.ipfs.host, '127.0.0.1');
    assert.strictEqual(config.ipfs.port, 5001);
    assert.strictEqual(config.queue.maxSize, 10000);
    assert.strictEqual(config.monitoring.dashboardPort, 3000);
  });
});

describe('Schema Validator', () => {
  let validator;

  before(() => {
    validator = new SchemaValidator();
  });

  it('should create validator instance', () => {
    assert.ok(validator);
  });

  it('should register a schema', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' }
      },
      required: ['name']
    };
    
    const result = validator.registerSchema('test-schema', schema);
    assert.strictEqual(result, true);
  });

  it('should validate data against schema', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' }
      },
      required: ['name']
    };
    
    validator.registerSchema('person-schema', schema);
    
    const validData = { name: 'John', age: 30 };
    const result = validator.validate('person-schema', validData);
    
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it('should detect invalid data', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' }
      },
      required: ['name']
    };
    
    validator.registerSchema('strict-schema', schema);
    
    const invalidData = { age: 30 }; // Missing required 'name'
    const result = validator.validate('strict-schema', invalidData);
    
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.length > 0);
  });

  it('should infer schema from data', () => {
    const sampleData = {
      name: 'Test',
      count: 42,
      active: true,
      tags: ['a', 'b']
    };
    
    const schema = validator.inferSchema(sampleData);
    
    assert.strictEqual(schema.type, 'object');
    assert.ok(schema.properties);
    assert.strictEqual(schema.properties.name.type, 'string');
    assert.strictEqual(schema.properties.count.type, 'number');
    assert.strictEqual(schema.properties.active.type, 'boolean');
    assert.strictEqual(schema.properties.tags.type, 'array');
  });

  it('should get registered schemas', () => {
    const schemas = validator.getRegisteredSchemas();
    assert.ok(Array.isArray(schemas));
    assert.ok(schemas.length > 0);
  });

  it('should get specific schema', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'number' }
      }
    };
    
    validator.registerSchema('get-test', schema);
    const retrieved = validator.getSchema('get-test');
    
    assert.ok(retrieved);
    assert.strictEqual(retrieved.type, 'object');
  });

  it('should remove schema', () => {
    const schema = {
      type: 'object',
      properties: {
        temp: { type: 'string' }
      }
    };
    
    validator.registerSchema('remove-test', schema);
    validator.removeSchema('remove-test');
    
    const retrieved = validator.getSchema('remove-test');
    assert.strictEqual(retrieved, null);
  });
});

describe('Data Structure Validation', () => {
  let validator;

  before(() => {
    validator = new SchemaValidator();
  });

  it('should validate nested objects', () => {
    const schema = {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' }
          },
          required: ['name', 'email']
        }
      },
      required: ['user']
    };
    
    validator.registerSchema('nested-schema', schema);
    
    const validData = {
      user: {
        name: 'Alice',
        email: 'alice@example.com'
      }
    };
    
    const result = validator.validate('nested-schema', validData);
    assert.strictEqual(result.valid, true);
  });

  it('should validate arrays', () => {
    const schema = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'number' }
        }
      }
    };
    
    validator.registerSchema('array-schema', schema);
    
    const validData = {
      items: [1, 2, 3, 4, 5]
    };
    
    const result = validator.validate('array-schema', validData);
    assert.strictEqual(result.valid, true);
  });

  it('should detect type mismatches', () => {
    const schema = {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    };
    
    validator.registerSchema('type-check', schema);
    
    const invalidData = {
      count: 'not a number'
    };
    
    const result = validator.validate('type-check', invalidData);
    assert.strictEqual(result.valid, false);
  });
});

console.log('✅ All core unit tests can be run without external dependencies');
