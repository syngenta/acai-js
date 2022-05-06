const {assert, expect, use} = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {Request, Response} = require('../../../src').apigateway;
const Validator = require('../../../src/common/validator');
const Schema = require('../../../src/common/schema');
const mockData = require('../../mocks/apigateway/mock-data');

use(chaiAsPromised);

describe('Test Validator', () => {
    describe('test request', () => {
        const request = new Request(mockData.getValidBodyData());
        const response = new Response();
        const schema = Schema.fromFilePath('test/mocks/openapi.yml');
        const validator = new Validator(request, response, schema);
        it('valid request', () => {
            validator.isValid(
                {
                    requiredHeaders: ['x-api-key'],
                    requiredParams: ['name'],
                    requiredBody: 'v1-test-request'
                },
                () => {}
            );
            assert.equal(response.hasErrors, false);
        });
        it('invalid header request', () => {
            validator.isValid(
                {
                    requiredHeaders: ['x-api-key-fail']
                },
                () => {}
            );
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response._body, {
                errors: [
                    {
                        key_path: 'headers',
                        message: 'Please provide x-api-key-fail for headers'
                    }
                ]
            });
        });
        it('invalid query string params request', () => {
            response._body = {};
            validator.isValid(
                {
                    requiredParams: ['name', 'failing-param']
                },
                () => {}
            );
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response._body, {
                errors: [
                    {
                        key_path: 'params',
                        message: 'Please provide failing-param for params'
                    }
                ]
            });
        });
        it('invalid json body request: full request empty', async () => {
            response._body = {};
            await validator.isValid(
                {
                    requiredBody: 'v1-test-fail-request'
                },
                () => {}
            );
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response._body, {
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
            const schema = Schema.fromFilePath('test/mocks/openapi.yml');
            const validator2 = new Validator(request, response, schema);
            response._body = {};
            await validator2.isValid(
                {
                    requiredBody: 'v1-test-fail-request'
                },
                () => {}
            );
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response._body, {
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
        const request = new Request(mockData.getValidBodyData());
        const response = new Response();
        const schema = Schema.fromFilePath('test/mocks/openapi.yml');
        const validator = new Validator(request, response, schema);
        it('response is valid', async () => {
            response.body = {
                pageNumber: 0,
                data: {
                    id: 'string'
                }
            };
            await validator.isValid({responseBody: 'v1-required-response'});
            assert.equal(response.hasErrors, false);
        });
        it('response is invalid', async () => {
            response.body = {};
            await validator.isValid({responseBody: 'v1-required-response'});
            assert.isTrue(response.hasErrors);
        });
        it('response is invalid: not object', async () => {
            response.body = '';
            await validator.isValid({responseBody: 'v1-required-response'});
            assert.equal(response.hasErrors, true);
        });
        it('response is invalid: proper error message', async () => {
            response.body = {};
            await validator.isValid({responseBody: 'v1-response-test-all-of'});
            assert.deepEqual(response.rawBody, {
                errors: [
                    {key_path: 'root', message: "must have required property 'data'"},
                    {key_path: 'root', message: "must have required property 'pageNumber'"}
                ]
            });
        });
        it('throw error when entity not found', () => {
            response.body = {};
            const checkFn = async () => await validator.isValid({responseBody: 'random-string-$$$'});
            expect(checkFn()).to.be.rejectedWith('');
        });
    });
    describe('test improper json', () => {
        const request = new Request(mockData.getValidBodyData());
        const response = new Response();
        const schema = Schema.fromFilePath('test/mocks/openapi.yml');
        const validator = new Validator(request, response, schema);
        it('invalid json: nullable field', async () => {
            const request = new Request(mockData.getBodyDataWithNullableField());
            const response = new Response();
            const schema = Schema.fromFilePath('test/mocks/openapi.yml');
            const validator2 = new Validator(request, response, schema);
            response._body = {};
            await validator2.isValid(
                {
                    requiredBody: 'v1-test-nullable-field'
                },
                () => {}
            );
            assert.equal(response.hasErrors, true);
            assert.deepEqual(response._body, {
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
            const schema = Schema.fromFilePath('test/mocks/openapi.yml');
            const validator2 = new Validator(request, response, schema);
            response._body = {};
            await validator2.isValid(
                {
                    requiredBody: 'v1-response-test-all-of'
                },
                () => {}
            );
            assert.isFalse(response.hasErrors);
        });
        it('invalid json: complex schema with allOfs', async () => {
            const request = new Request(mockData.getBodyDataWithInvalidComplexObject());
            const response = new Response();
            const schema = Schema.fromFilePath('test/mocks/openapi.yml');
            const validator2 = new Validator(request, response, schema);
            response._body = {};
            await validator2.isValid(
                {
                    requiredBody: 'v1-response-test-all-of'
                },
                () => {}
            );
            assert.isTrue(response.hasErrors);
            assert.deepEqual(response._body, {
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
