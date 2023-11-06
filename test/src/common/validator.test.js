const {assert, expect, use} = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {Request, Response} = require('../../../src').apigateway;
const Validator = require('../../../src/common/validator');
const Schema = require('../../../src/common/schema');
const mockData = require('../../mocks/apigateway/mock-data');

use(chaiAsPromised);

describe('Test Validator', () => {
    const mock = mockData.getValidBodyData();
    const request = new Request(mock);
    const schema = Schema.fromFilePath('test/mocks/openapi.yml', {strictValidation: true});
    const validator = new Validator(schema);
    describe('test request', () => {
        it('should validate valid request', async () => {
            const response = new Response();
            const requirements = {
                requiredHeaders: ['x-api-key'],
                requiredQuery: ['name'],
                requiredBody: 'v1-test-request'
            };
            await validator.validateWithRequirements(request, response, requirements);
            assert.equal(response.hasErrors, false);
        });
        it('should see request as invalid becuase of missing required headers', async () => {
            const response = new Response();
            const requirements = {requiredHeaders: ['x-api-key-fail']};
            await validator.validateWithRequirements(request, response, requirements);
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
            await validator.validateWithRequirements(request, response, requirements);
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
            await validator.validateWithRequirements(request, response, requirements);
            assert.equal(response.hasErrors, false);
        });
        it('should see request as valid with correct available headers', async () => {
            const response = new Response();
            const requirements = {requiredQuery: ['name', 'failing-param']};
            await validator.validateWithRequirements(request, response, requirements);
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'queryParams',
                        message: 'Please provide failing-param for queryParams'
                    }
                ]
            });
        });
        it('should see request as invalid because request body is empty', async () => {
            const response = new Response();
            const requirements = {requiredBody: 'v1-test-fail-request'};
            await validator.validateWithRequirements(request, response, requirements);
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
            const mock = mockData.getInvalidBodyData();
            const request = new Request(mock);
            const response = new Response();
            const requirements = {requiredBody: 'v1-test-fail-request'};
            await validator.validateWithRequirements(request, response, requirements);
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
    describe('test improper json', () => {
        it('should return invalid as json is not proper with nullable field', async () => {
            const mock = mockData.getBodyDataWithNullableField();
            const request = new Request(mock);
            const response = new Response();
            const requirements = {requiredBody: 'v1-test-nullable-field'};
            await validator.validateWithRequirements(request, response, requirements);
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
            const mock = mockData.getBodyDataWithComplexObject();
            const request = new Request(mock);
            const response = new Response();
            const requirements = {requiredBody: 'v1-response-test-all-of'};
            await validator.validateWithRequirements(request, response, requirements);
            assert.isFalse(response.hasErrors);
        });
        it('should be able to handle complex schema import and provide an error', async () => {
            const mock = mockData.getBodyDataWithInvalidComplexObject();
            const request = new Request(mock);
            const response = new Response();
            const requirements = {requiredBody: 'v1-response-test-all-of'};
            await validator.validateWithRequirements(request, response, requirements);
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
    describe('test request against openapi validation', () => {
        it('should have errors', async () => {
            const route = '/unit-test/v1/schema';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, 'get');
            const request = new Request(mock);
            request.route = route;
            const response = new Response();
            await validator.validateWithOpenAPI(request, response);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'query',
                        message: "request.query must have required property 'unit_id'"
                    },
                    {
                        key_path: 'query',
                        message: "'name' property is not expected to be here"
                    }
                ]
            });
        });
        it('should not have errors', async () => {
            const route = '/unit-test/v1/schema/{test_id}';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, 'put');
            const request = new Request(mock);
            request.route = route;
            const response = new Response();
            await validator.validateWithOpenAPI(request, response);
            assert.equal(response.hasErrors, false);
        });
        it('should throw error when cant find operation schema bad method', async () => {
            const route = '/unit-test/v1/schema/{test_id}';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, 'get');
            const request = new Request(mock);
            request.route = route;
            const response = new Response();
            try {
                await validator.validateWithOpenAPI(request, response);
                assert.equal(true, false);
            } catch (error) {
                assert.equal(error.message, 'problem with importing your schema for get::/unit-test/v1/schema/{test_id}: Error');
            }
        });
        it('should throw error when cant find operation schema bad route', async () => {
            const route = '/fail/v1/schema/{fail}';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, 'get');
            const request = new Request(mock);
            request.route = route;
            const response = new Response();
            try {
                await validator.validateWithOpenAPI(request, response);
                assert.equal(true, false);
            } catch (error) {
                assert.equal(true, error.message.includes('problem with importing your schema for get::/fail/v1/schema/{fail}'));
            }
        });
    });
});
