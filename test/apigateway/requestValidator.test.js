const {assert} = require('chai');
const RequestClient = require('../../src').apigateway.Request;
const ResponseClient = require('../../src').apigateway.Response;
const RequestValidator = require('../../src').apigateway.Validator;
const mockData = require('./mock-data');

describe('Test Validator Client', () => {
    const eventClient = new RequestClient(mockData.getValidBodyData());
    const responseClient = new ResponseClient();
    const requestValidator = new RequestValidator(eventClient, responseClient);
    describe('test constructor', () => {
        it('client took other clients', () => {
            requestValidator.should.have.property('_eventClient');
            requestValidator.should.have.property('_responseClient');
            requestValidator.should.have.property('_requiredPairings');
        });
    });
    describe('test validateRequest', () => {
        it('valid request', () => {
            requestValidator.validateRequest(
                {
                    requiredHeaders: ['x-api-key'],
                    requiredQueryStringParameters: ['name'],
                    requiredBody: 'v1-test-request'
                },
                () => {}
            );
            assert.equal(responseClient.hasErrors, false);
        });
        it('invalid header request', () => {
            requestValidator.validateRequest(
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
                        message: 'Please provide x-api-key-fail'
                    }
                ]
            });
        });
        it('invalid query string params request', () => {
            responseClient._body = {};
            requestValidator.validateRequest(
                {
                    requiredQueryStringParameters: ['name', 'failing-param']
                },
                () => {}
            );
            assert.equal(responseClient.hasErrors, true);
            assert.deepEqual(responseClient._body, {
                errors: [
                    {
                        key_path: 'queryStringParameters',
                        message: 'Please provide failing-param'
                    }
                ]
            });
        });
        it('invalid json body request: full request empty', (callback) => {
            responseClient._body = {};
            requestValidator.validateRequest(
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
                                message: "should have required property 'fail_id'"
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
            const requestValidator2 = new RequestValidator(eventClient2, responseClient2);
            responseClient2._body = {};
            requestValidator2.validateRequest(
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
                                message: 'should NOT have additional properties'
                            },
                            {
                                key_path: 'root',
                                message: "should have required property 'fail_id'"
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
});
