const {assert} = require('chai');
const RequestClient = require('../../src').apigateway.Request;
const mockData = require('./mock-data');

describe('Test Request Client', () => {
    const requestClient = new RequestClient(mockData.getData());
    const requestClientNoParams = new RequestClient(mockData.getDataNoParams());
    const requestClientXML = new RequestClient(mockData.getDataXml());
    const requestClientRaw = new RequestClient(mockData.getDataRaw());
    const requestClientNoHeaders = new RequestClient(mockData.getDataNoHeaders());
    describe('test constructor', () => {
        it('client took event', () => {
            requestClient.should.have.property('_event');
        });
    });
    describe('tes method', () => {
        it('method is GET', () => {
            assert.equal(requestClient.method, 'GET');
        });
    });
    describe('test resource', () => {
        it('resource is proxy', () => {
            assert.equal(requestClient.resource, '/{proxy+}');
        });
    });
    describe('test no-headers', () => {
        it('defaults content-type to application json', () => {
            assert.deepEqual(requestClientNoHeaders.headers, {'content-type': 'application/json'});
        });
    });
    describe('test authorizer', () => {
        it('authorizer is an object', () => {
            assert.deepEqual(requestClient.authorizer, {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            });
        });
    });
    describe('test headers', () => {
        it('headers is an object', () => {
            assert.deepEqual(requestClient.headers, {
                'x-api-key': 'SOME-KEY',
                'content-type': 'application/json'
            });
        });
    });
    describe('test params()', () => {
        it('params is an object', () => {
            assert.deepEqual(requestClient.params, {
                name: 'me'
            });
        });
    });
    describe('test params()', () => {
        it('params is an object', () => {
            assert.deepEqual(requestClientNoParams.params, {});
        });
    });
    describe('test path', () => {
        it('path is an object', () => {
            assert.deepEqual(requestClient.path, {
                proxy: 'hello'
            });
        });
    });
    describe('test body', () => {
        it('body is an object', () => {
            assert.deepEqual(requestClient.body, {body_key: 'body_value'});
        });
    });
    describe('test request', () => {
        it('body is an object from Json', () => {
            assert.deepEqual(requestClient.request, {
                method: 'GET',
                resource: '/{proxy+}',
                authorizer: {
                    apiKey: 'SOME KEY',
                    userId: 'x-1-3-4',
                    correlationId: 'abc12312',
                    principalId: '9de3f415a97e410386dbef146e88744e',
                    integrationLatency: 572
                },
                headers: {'x-api-key': 'SOME-KEY', 'content-type': 'application/json'},
                params: {name: 'me'},
                path: {proxy: 'hello'},
                body: {body_key: 'body_value'}
            });
        });
        it('body is an object from XML', () => {
            assert.deepEqual(requestClientXML.request, {
                method: 'POST',
                resource: '/{proxy+}',
                authorizer: {
                    apiKey: 'SOME KEY',
                    userId: 'x-1-3-4',
                    correlationId: 'abc12312',
                    principalId: '9de3f415a97e410386dbef146e88744e',
                    integrationLatency: 572
                },
                headers: {'x-api-key': 'SOME-KEY', 'content-type': 'application/xml'},
                params: {name: 'me'},
                path: {proxy: 'hello'},
                body: {
                    root: {
                        someobject: ['1', '2'],
                        test: 'test2'
                    }
                }
            });
        });
        it('body is raw from raw data', () => {
            assert.deepEqual(requestClientRaw.request, {
                method: 'POST',
                resource: '/{proxy+}',
                authorizer: {
                    apiKey: 'SOME KEY',
                    userId: 'x-1-3-4',
                    correlationId: 'abc12312',
                    principalId: '9de3f415a97e410386dbef146e88744e',
                    integrationLatency: 572
                },
                headers: {
                    'x-api-key': 'SOME-KEY',
                    'content-type': 'multipart/form-data; boundary=430661979790652055785011'
                },
                params: {name: 'me'},
                path: {proxy: 'hello'},
                body: '----------------------------430661979790652055785011 Content-Disposition: form-data; name="test"'
            });
        });
    });
});
