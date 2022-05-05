const {assert} = require('chai');
const RequestClient = require('../../../src').apigateway.Request;
const mockData = require('../../mocks/apigateway/mock-data');

describe('Test Request Client', () => {
    const requestClient = new RequestClient(mockData.getData());
    const requestClientBad = new RequestClient(mockData.getBadData());
    const requestClientNoParams = new RequestClient(mockData.getDataNoParams());
    const requestClientXML = new RequestClient(mockData.getDataXml());
    const requestClientRaw = new RequestClient(mockData.getDataRaw());
    const requestClientNoHeaders = new RequestClient(mockData.getDataNoHeaders());
    const requestClientOffline = new RequestClient(mockData.getDataOffline());
    describe('test constructor', () => {
        it('client took event', () => {
            assert.equal(true, '__event' in requestClient);
        });
    });
    describe('test method', () => {
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
    describe('test offline authorizer headers', () => {
        it('headers is an object', () => {
            assert.deepEqual(requestClientOffline.authorizer, {
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
    describe('test context', () => {
        it('context default is null', () => {
            assert.equal(requestClient.context, null);
        });
        it('context is assignable', () => {
            const assignableContextClient = new RequestClient(mockData.getData());
            assignableContextClient.context = {context: true};
            assert.deepEqual(assignableContextClient.context, {context: true});
        });
        it('context is nullable', () => {
            const nullableContextClient = new RequestClient(mockData.getData());
            nullableContextClient.context = {nullable: true};
            assert.deepEqual(nullableContextClient.context, {nullable: true});
            nullableContextClient.context = null;
            assert.equal(nullableContextClient.context, null);
        });
        it('context is mutatable', () => {
            const mutatableContextClient = new RequestClient(mockData.getData());
            mutatableContextClient.context = {key1: 'value1'};
            assert.deepEqual(mutatableContextClient.context, {key1: 'value1'});
            mutatableContextClient.context.key2 = 'value2';
            assert.deepEqual(mutatableContextClient.context, {key1: 'value1', key2: 'value2'});
        });
    });
    describe('test bad body', () => {
        it('body is an object', () => {
            assert.equal(requestClientBad.body, '{body_key: "body_value"},#');
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
                body: {body_key: 'body_value'},
                context: null,
                route: `unittest/v1/mock-handler`
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
                },
                context: null,
                route: `unittest/v1/mock-handler`
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
                route: `unittest/v1/mock-handler`,
                body:
                    '----------------------------430661979790652055785011 Content-Disposition: form-data; name="test"',
                context: null
            });
        });
    });
});
