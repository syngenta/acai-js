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
        it('valid request', () => {
            const response = new Response();
            const requirements = {
                requiredHeaders: ['x-api-key'],
                requiredParams: ['name'],
                requiredBody: 'v1-test-request'
            };
            validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, false);
        });
        it('invalid header request', () => {
            const response = new Response();
            const requirements = {requiredHeaders: ['x-api-key-fail']};
            validator.isValid(request, response, requirements);
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
        it('invalid available header request', () => {
            const response = new Response();
            const requirements = {availableHeaders: ['x-api-key-fail']};
            validator.isValid(request, response, requirements);
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
        it('valid available header request', () => {
            const response = new Response();
            const requirements = {availableHeaders: ['x-api-key', 'content-type']};
            validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, false);
        });
        it('invalid query string params request', () => {
            const response = new Response();
            const requirements = {requiredParams: ['name', 'failing-param']};
            validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {
                        key_path: 'params',
                        message: 'Please provide failing-param for params'
                    }
                ]
            });
        });
        it('invalid json body request: full request empty', async () => {
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
        it('invalid json body request: extra params', async () => {
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
        it('response is valid', async () => {
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
        it('response is invalid', async () => {
            const response = new Response();
            const requirements = {responseBody: 'v1-required-response'};
            await validator.isValid(request, response, requirements);
            assert.isTrue(response.hasErrors);
        });
        it('response is invalid: not object', async () => {
            const response = new Response();
            response.body = '';
            const requirements = {responseBody: 'v1-required-response'};
            await validator.isValid(request, response, requirements);
            assert.equal(response.hasErrors, true);
        });
        it('response is invalid: proper error message', async () => {
            const response = new Response();
            response.body = {};
            const requirements = {responseBody: 'v1-response-test-all-of'};
            await validator.isValid(request, response, requirements);
            assert.deepEqual(response.rawBody, {
                errors: [
                    {key_path: 'root', message: "must have required property 'data'"},
                    {key_path: 'root', message: "must have required property 'pageNumber'"}
                ]
            });
        });
        it('throw error when entity not found', () => {
            const response = new Response();
            const requirements = {responseBody: 'random-string-$$$'};
            const checkFn = async () => await validator.isValid(request, response, requirements);
            expect(checkFn()).to.be.rejectedWith('');
        });
    });
    describe('test improper json', () => {
        it('invalid json: nullable field', async () => {
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
        it('valid json: complex schema with allOfs', async () => {
            const request = new Request(mockData.getBodyDataWithComplexObject());
            const response = new Response();
            const requirements = {requiredBody: 'v1-response-test-all-of'};
            await validator.isValid(request, response, requirements);
            assert.isFalse(response.hasErrors);
        });
        it('invalid json: complex schema with allOfs', async () => {
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
