/**
 * Basic Integration Tests
 * Tests core functionality of the data integration system
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import DataIntegrationSystem from '../integration-system.js';
import IPFSClient from '../ipfs/client.js';
import SchemaValidator from '../utils/validator.js';

describe('Data Integration System', () => {
  let system;

  before(async () => {
    system = new DataIntegrationSystem();
  });

  after(async () => {
    if (system && system.initialized) {
      await system.shutdown();
    }
  });

  it('should create system instance', () => {
    assert.ok(system);
    assert.strictEqual(system.initialized, false);
  });

  it('should have all required components', () => {
    assert.ok(system.ipfsClient);
    assert.ok(system.apiDiscovery);
    assert.ok(system.dataQueue);
    assert.ok(system.metricsCollector);
  });
});

describe('Schema Validator', () => {
  let validator;

  before(() => {
    validator = new SchemaValidator();
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
});

describe('IPFS Client', () => {
  let ipfsClient;

  before(() => {
    ipfsClient = new IPFSClient();
  });

  it('should create IPFS client instance', () => {
    assert.ok(ipfsClient);
    assert.strictEqual(ipfsClient.initialized, false);
  });

  it('should have CID tracking capabilities', () => {
    const history = ipfsClient.getCIDHistory('test-source');
    assert.ok(Array.isArray(history));
    assert.strictEqual(history.length, 0);
  });

  it('should get status', () => {
    const status = ipfsClient.getStatus();
    assert.ok(status);
    assert.strictEqual(typeof status.initialized, 'boolean');
    assert.strictEqual(typeof status.trackedSources, 'number');
  });
});
