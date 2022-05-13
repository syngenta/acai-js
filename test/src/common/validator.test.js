const {assert, expect, use} = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {Request, Response} = require('../../../src').apigateway;
const Validator = require('../../../src/common/validator');
const Schema = require('../../../src/common/schema');
const mockData = require('../../mocks/apigateway/mock-data');

use(chaiAsPromised);

describe('Test Validator', () => {
    const request = new Request(mockData.getValidBodyData());
    const schema = Schema.fromFilePath('test/mocks/openapi.yml');
    const validator = new Validator(schema);
    describe('test request', () => {
        it('should validate valid request', async () => {
            const response = new Response();
            const requirements = {
                requiredHeaders: ['x-api-key'],
                requiredParams: ['name'],
                requiredBody: 'v1-test-request'
            };
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, false);
        });
        it('should see request as invalid becuase of missing required headers', async () => {
            const response = new Response();
            const requirements = {requiredHeaders: ['x-api-key-fail']};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'headers',
                        message: 'Please provide x-api-key-fail for headers'
                    }
                ]
            });
        });
        it('should see request as invalid becuase of not available headers', async () => {
            const response = new Response();
            const requirements = {availableHeaders: ['x-api-key-fail']};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'headers',
                        message: 'x-api-key is not an available headers'
                    },
                    {
                        key_path: 'headers',
                        message: 'content-type is not an available headers'
                    }
                ]
            });
        });
        it('should see request as valid with correct required headers', async () => {
            const response = new Response();
            const requirements = {availableHeaders: ['x-api-key', 'content-type']};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, false);
        });
        it('should see request as valid with correct available headers', async () => {
            const response = new Response();
            const requirements = {requiredParams: ['name', 'failing-param']};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'query',
                        message: 'Please provide failing-param for query'
                    }
                ]
            });
        });
        it('should see request as invalid because request body is empty', async () => {
            const response = new Response();
            const requirements = {requiredBody: 'v1-test-fail-request'};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'root',
                        message: "must have required property 'fail_id'"
                    }
                ]
            });
        });
        it('should see request as invalid because request body has extra keys', async () => {
            const request = new Request(mockData.getInvalidBodyData());
            const response = new Response();
            const requirements = {requiredBody: 'v1-test-fail-request'};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'root',
                        message: "must have required property 'fail_id'"
                    },
                    {
                        key_path: 'root',
                        message: 'must NOT have additional properties'
                    }
                ]
            });
        });
    });
    describe('test response', () => {
        it('should return that response is valid', async () => {
            const response = new Response();
            response.body = {
                pageNumber: 0,
                data: {
                    id: 'string'
                }
            };
            const requirements = {responseBody: 'v1-required-response'};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, false);
        });
        it('should return that response is invalid because it doesnt schema', async () => {
            const response = new Response();
            const requirements = {responseBody: 'v1-required-response'};
            await validator.isValid(request, response, requirements, 'response');
            assert.isTrue(response.hasErrors);
        });
        it('should return that response is invalid because response isnt an object', async () => {
            const response = new Response();
            response.body = '';
            const requirements = {responseBody: 'v1-required-response'};
            await validator.isValid(request, response, requirements, 'response');
            assert.equal(response.hasErrors, true);
        });
        it('should return that response is invalid with proper error message', async () => {
            const response = new Response();
            response.body = {};
            const requirements = {responseBody: 'v1-response-test-all-of'};
            await validator.isValid(request, response, requirements, 'response');
            assert.deepEqual(response.rawBody, {
                errors: [
                    {key_path: 'root', message: "must have required property 'data'"},
                    {key_path: 'root', message: "must have required property 'pageNumber'"}
                ]
            });
        });
        it('should throw an error when error is not found', () => {
            const response = new Response();
            const requirements = {responseBody: 'random-string-$$$'};
            const checkFn = async () => await validator.isValid(request, response, requirements, 'response');
            expect(checkFn()).to.be.rejectedWith('');
        });
    });
    describe('test improper json', () => {
        it('should return invalid as json is not proper with nullable field', async () => {
            const request = new Request(mockData.getBodyDataWithNullableField());
            const response = new Response();
            const requirements = {requiredBody: 'v1-test-nullable-field'};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: '/non_nullable_field',
                        message: 'must be string'
                    }
                ]
            });
        });
        it('should be able to handle complex schema import', async () => {
            const request = new Request(mockData.getBodyDataWithComplexObject());
            const response = new Response();
            const requirements = {requiredBody: 'v1-response-test-all-of'};
            await validator.isValid(request, response, requirements);
            assert.isFalse(response.hasErrors);
        });
        it('should be able to handle complex schema import and provide an error', async () => {
            const request = new Request(mockData.getBodyDataWithInvalidComplexObject());
            const response = new Response();
            const requirements = {requiredBody: 'v1-response-test-all-of'};
            await validator.isValid(request, response, requirements);
            assert.isTrue(response.hasErrors);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'root',
                        message: "must have required property 'data'"
                    }
                ]
            });
        });
    });
});
