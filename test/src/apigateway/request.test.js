const {assert} = require('chai');
const Request = require('../../../src').apigateway.Request;
const mockData = require('../../mocks/apigateway/mock-data');

describe('Test Request Client', () => {
    describe('test basic client', () => {
        const request = new Request(mockData.getData());
        it('method is GET', () => {
            assert.equal(request.method, 'GET');
        });
        it('resource is proxy', () => {
            assert.equal(request.resource, '/{proxy+}');
        });
        it('authorizer is an object', () => {
            assert.deepEqual(request.authorizer, {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            });
        });
        it('headers is an object', () => {
            assert.deepEqual(request.headers, {
                'x-api-key': 'SOME-KEY',
                'content-type': 'application/json'
            });
        });
        it('params is an object', () => {
            assert.deepEqual(request.params, {
                name: 'me'
            });
        });
        it('path is an object', () => {
            assert.deepEqual(request.path, {
                proxy: 'hello'
            });
        });
        it('body is an object', () => {
            assert.deepEqual(request.body, {body_key: 'body_value'});
        });
        it('body is an object from Json', () => {
            assert.deepEqual(request.request, {
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
                route: `unittest/v1/basic`
            });
        });
    });
    describe('test assignable context', () => {
        it('context default is null', () => {
            const request = new Request(mockData.getData());
            assert.equal(request.context, null);
        });
        it('context is assignable', () => {
            const request = new Request(mockData.getData());
            request.context = {context: true};
            assert.deepEqual(request.context, {context: true});
        });
        it('context is nullable', () => {
            const request = new Request(mockData.getData());
            request.context = {nullable: true};
            assert.deepEqual(request.context, {nullable: true});
            request.context = null;
            assert.equal(request.context, null);
        });
        it('context is mutatable', () => {
            const request = new Request(mockData.getData());
            request.context = {key1: 'value1'};
            assert.deepEqual(request.context, {key1: 'value1'});
            request.context.key2 = 'value2';
            assert.deepEqual(request.context, {key1: 'value1', key2: 'value2'});
        });
    });
    describe('test no-headers', () => {
        const request = new Request(mockData.getDataNoHeaders());
        it('defaults content-type to application json', () => {
            assert.deepEqual(request.headers, {'content-type': 'application/json'});
        });
    });
    describe('test offline authorizer headers', () => {
        const request = new Request(mockData.getDataOffline());
        it('headers is an object', () => {
            assert.deepEqual(request.authorizer, {
                'x-api-key': 'SOME-KEY',
                'content-type': 'application/json'
            });
        });
    });
    describe('test no params', () => {
        const request = new Request(mockData.getDataNoParams());
        it('params is an object', () => {
            assert.deepEqual(request.params, {});
        });
    });
    describe('test bad body', () => {
        const request = new Request(mockData.getBadData());
        it('body is an object', () => {
            assert.equal(request.body, '{body_key: "body_value"},#');
        });
    });
    describe('test request xml body', () => {
        it('body is an object from XML', () => {
            const request = new Request(mockData.getDataXml());
            assert.deepEqual(request.body, {
                root: {
                    someobject: ['1', '2'],
                    test: 'test2'
                }
            });
        });
        it('body is an string from bad XML', () => {
            const request = new Request(mockData.getBadDataXml());
            assert.equal(request.body, '<root><test>test2</test></root');
        });
    });
    describe('test request raw body', () => {
        const request = new Request(mockData.getDataRaw());
        it('body is raw from raw data', () => {
            assert.equal(
                request.body,
                '----------------------------430661979790652055785011 Content-Disposition: form-data; name="test"'
            );
        });
    });
});
