const {assert} = require('chai');
const RequestClient = require('../../src').apigateway.Request;
const ResponseClient = require('../../src').apigateway.Response;
const RequestValidator = require('../../src').apigateway.RequestValidator;
const Schema = require('../../src').apigateway.Schema;
const mockData = require('./mock-data');

describe('Test Validator Client', () => {
    const eventClient = new RequestClient(mockData.getValidBodyData());
    const responseClient = new ResponseClient();
    const requestValidator = new RequestValidator(eventClient, responseClient, Schema.fromFilePath('test/openapi.yml'));
    describe('test constructor', () => {
        it('client took other clients', () => {
            assert.equal(true, '_eventClient' in requestValidator);
            assert.equal(true, '_responseClient' in requestValidator);
            assert.equal(true, '_validationPairings' in requestValidator);
        });
    });
    describe('test _validateRequest', () => {
        it('valid request', () => {
            requestValidator._validateRequest(
                {
                    requiredHeaders: ['x-api-key'],
                    requiredParams: ['name'],
                    requiredBody: 'v1-test-request'
                },
                () => {}
            );
            assert.equal(responseClient.hasErrors, false);
        });
        it('invalid header request', () => {
            requestValidator._validateRequest(
                {
                    requiredHeaders: ['x-api-key-fail']
                },
                () => {}
            );
            assert.equal(responseClient.hasErrors, true);
            assert.deepEqual(responseClient._body, {
                errors: [
                    {
                        key_path: 'headers',
                        message: 'Please provide x-api-key-fail for headers'
                    }
                ]
            });
        });
        it('invalid query string params request', () => {
            responseClient._body = {};
            requestValidator._validateRequest(
                {
                    requiredParams: ['name', 'failing-param']
                },
                () => {}
            );
            assert.equal(responseClient.hasErrors, true);
            assert.deepEqual(responseClient._body, {
                errors: [
                    {
                        key_path: 'params',
                        message: 'Please provide failing-param for params'
                    }
                ]
            });
        });
        it('invalid json body request: full request empty', (callback) => {
            responseClient._body = {};
            requestValidator._validateRequest(
                {
                    requiredBody: 'v1-test-fail-request'
                },
                () => {}
            );
            setTimeout(() => {
                try {
                    assert.equal(responseClient.hasErrors, true);
                    assert.deepEqual(responseClient._body, {
                        errors: [
                            {
                                key_path: 'root',
                                message: "must have required property 'fail_id'"
                            }
                        ]
                    });
                    callback();
                } catch (error) {
                    callback(error);
                }
            }, 30);
        });
        it('invalid json body request: extra params', (callback) => {
            const eventClient2 = new RequestClient(mockData.getInvalidBodyData());
            const responseClient2 = new ResponseClient();
            const schema = Schema.fromFilePath('test/openapi.yml');
            const requestValidator2 = new RequestValidator(eventClient2, responseClient2, schema);
            responseClient2._body = {};
            requestValidator2._validateRequest(
                {
                    requiredBody: 'v1-test-fail-request'
                },
                () => {}
            );
            setTimeout(() => {
                try {
                    assert.equal(responseClient2.hasErrors, true);
                    assert.deepEqual(responseClient2._body, {
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
                    callback();
                } catch (error) {
                    callback(error);
                }
            }, 30);
        });
    });
    it('invalid json: nullable field', (callback) => {
        const eventClient2 = new RequestClient(mockData.getBodyDataWithNullableField());
        const responseClient2 = new ResponseClient();
        const schema = Schema.fromFilePath('test/openapi.yml');
        const requestValidator2 = new RequestValidator(eventClient2, responseClient2, schema);
        responseClient2._body = {};
        requestValidator2._validateRequest(
            {
                requiredBody: 'v1-test-nullable-field'
            },
            () => {}
        );
        setTimeout(() => {
            try {
                assert.equal(responseClient2.hasErrors, true);
                assert.deepEqual(responseClient2._body, {
                    errors: [
                        {
                            key_path: '/non_nullable_field',
                            message: 'must be string'
                        }
                    ]
                });
                callback();
            } catch (error) {
                callback(error);
            }
        }, 30);
    });
});
