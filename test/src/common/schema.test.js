const {assert} = require('chai');
const Schema = require('../../../src/common/schema');
const mockData = require('../../mocks/apigateway/mock-data');

describe('Test Schema: src/common/schema', () => {
    describe('test initializing Schemea', () => {
        it('should initialize from file path and pass', async () => {
            const schema = Schema.fromFilePath('test/mocks/openapi.yml');
            const errors = await schema.validate('v1-response-result', {id: 'true'});
            assert.equal(errors, null);
        });
        it('should initialize from file path and fail', async () => {
            const schema = Schema.fromFilePath('test/mocks/openapi.yml');
            const errors = await schema.validate('v1-response-result', {id: 1});
            assert.deepEqual(errors, [
                {
                    instancePath: '/id',
                    schemaPath: '#/properties/id/type',
                    keyword: 'type',
                    params: {type: 'string'},
                    message: 'must be string'
                }
            ]);
        });
        it('should throw an error for reference that doesnt exist', async () => {
            const schema = Schema.fromFilePath('test/mocks/openapi.yml');
            try {
                const errors = await schema.validate('v1-not-exist', {id: 1});
            } catch (error) {
                assert.equal(error.message.includes('is not found'), true);
            }
        });
        it('should initialize from inline schema and pass', async () => {
            const componant = {
                type: 'object',
                required: ['id'],
                properties: {
                    id: {
                        type: 'string'
                    }
                }
            };
            const schema = Schema.fromInlineSchema(componant);
            const errors = await schema.validate('', {id: 'true'});
            assert.equal(errors, null);
        });
        it('should initialize from inline schema and fail', async () => {
            const componant = {
                type: 'object',
                required: ['id'],
                properties: {
                    id: {
                        type: 'string'
                    }
                }
            };
            const schema = Schema.fromInlineSchema(componant);
            const errors = await schema.validate('', {id: 1});
            assert.deepEqual(errors, [
                {
                    instancePath: '/id',
                    schemaPath: '#/properties/id/type',
                    keyword: 'type',
                    params: {type: 'string'},
                    message: 'must be string'
                }
            ]);
        });
    });
});
