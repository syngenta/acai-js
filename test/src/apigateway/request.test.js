const {assert} = require('chai');
const Request = require('../../../src').apigateway.Request;
const mockData = require('../../mocks/apigateway/mock-data');

describe('Test Request Client', () => {
    describe('test basic client', () => {
        const request = new Request(mockData.getData());
        it('should have a method of GET', () => {
            assert.equal(request.method, 'GET');
        });
        it('should be a resource of proxy', () => {
            assert.equal(request.resource, '/{proxy+}');
        });
        it('should have authorizer as an object', () => {
            assert.deepEqual(request.authorizer, {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            });
        });
        it('should have headers as an object', () => {
            assert.deepEqual(request.headers, {
                'x-api-key': 'SOME-KEY',
                'content-type': 'application/json'
            });
        });
        it('should have params as an object', () => {
            assert.deepEqual(request.params, {query: {name: 'me'}, path: {}});
        });
        it('should have query as an object', () => {
            assert.deepEqual(request.query, {
                name: 'me'
            });
        });
        it('should have path as an object', () => {
            assert.deepEqual(request.path, {});
        });
        it('should have body as an object', () => {
            assert.deepEqual(request.body, {body_key: 'body_value'});
        });
        it('should body as an object from JSON', () => {
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
                query: {name: 'me'},
                path: {},
                params: {query: {name: 'me'}, path: {}},
                body: {body_key: 'body_value'},
                context: null,
                route: `unittest/v1/basic`
            });
        });
        it('should have query as an empty object with no params', () => {
            const request = new Request(mockData.getDataNoParams());
            assert.deepEqual(request.query, {});
        });
        it('should body as a string when its JSON string', () => {
            const request = new Request(mockData.getBadData());
            assert.equal(request.body, '{body_key: "body_value"},#');
        });
        it('should be an object from XML', () => {
            const request = new Request(mockData.getDataXml());
            assert.deepEqual(request.body, {
                root: {
                    someobject: ['1', '2'],
                    test: 'test2'
                }
            });
        });
        it('should be a string from bad XML', () => {
            const request = new Request(mockData.getBadDataXml());
            assert.equal(request.body, '<root><test>test2</test></root');
        });
        it('should be exactly what was sent when body is raw data', () => {
            const request = new Request(mockData.getDataRaw());
            assert.equal(
                request.body,
                '----------------------------430661979790652055785011 Content-Disposition: form-data; name="test"'
            );
        });
        it('should have headers as an object form offline data', () => {
            const request = new Request(mockData.getDataOffline());
            assert.deepEqual(request.authorizer, {
                'x-api-key': 'SOME-KEY',
                'content-type': 'application/json'
            });
        });
        it('should default content-type to application json', () => {
            const request = new Request(mockData.getDataNoHeaders());
            assert.deepEqual(request.headers, {'content-type': 'application/json'});
        });
        it('should have path as an empty object with no params', () => {
            const request = new Request(mockData.getDataNoParams());
            assert.deepEqual(request.path, {});
        });
        it('should be able to set request path from key/value object', () => {
            const request = new Request(mockData.getData());
            const key = 'key';
            const value = 'value';
            request.path = {key, value};
            assert.deepEqual(request.path, {key: 'value'});
        });
    });
    describe('test assignable context', () => {
        it('should have context default as null', () => {
            const request = new Request(mockData.getData());
            assert.equal(request.context, null);
        });
        it('should have context as assignable', () => {
            const request = new Request(mockData.getData());
            request.context = {context: true};
            assert.deepEqual(request.context, {context: true});
        });
        it('should have context as nullable', () => {
            const request = new Request(mockData.getData());
            request.context = {nullable: true};
            assert.deepEqual(request.context, {nullable: true});
            request.context = null;
            assert.equal(request.context, null);
        });
        it('should have context as mutatable', () => {
            const request = new Request(mockData.getData());
            request.context = {key1: 'value1'};
            assert.deepEqual(request.context, {key1: 'value1'});
            request.context.key2 = 'value2';
            assert.deepEqual(request.context, {key1: 'value1', key2: 'value2'});
        });
    });
    describe('test assignable paramPath', () => {
        it('should have paramPath default as emptu string', () => {
            const request = new Request(mockData.getData());
            assert.equal(request.paramPath, '');
        });
        it('should have paramPath as assignable', () => {
            const request = new Request(mockData.getData());
            request.paramPath = '/grower/:id';
            assert.equal(request.paramPath, '/grower/:id');
        });
    });
});
