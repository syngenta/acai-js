const {assert} = require('chai');
const Request = require('../../../src').apigateway.Request;
const mockData = require('../../mocks/apigateway/mock-data');

describe('Test Request Client', () => {
    describe('test basic client', () => {
        const mock = mockData.getData();
        const request = new Request(mock);
        it('should have a method of GET', () => {
            assert.equal(request.method, 'get');
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
            assert.deepEqual(request.queryParams, {
                name: 'me'
            });
        });
        it('should have path as an object', () => {
            assert.deepEqual(request.pathParams, {});
        });
        it('should have body as an object', () => {
            assert.deepEqual(request.body, {body_key: 'body_value'});
        });
        it('should body as an object from JSON', () => {
            assert.deepEqual(request.request, {
                method: 'get',
                resource: '/{proxy+}',
                authorizer: {
                    apiKey: 'SOME KEY',
                    userId: 'x-1-3-4',
                    correlationId: 'abc12312',
                    principalId: '9de3f415a97e410386dbef146e88744e',
                    integrationLatency: 572
                },
                headers: {'x-api-key': 'SOME-KEY', 'content-type': 'application/json'},
                queryParams: {name: 'me'},
                pathParams: {},
                params: {query: {name: 'me'}, path: {}},
                body: {body_key: 'body_value'},
                context: null,
                route: `unit-test/v1/basic`
            });
        });
        it('should have query as an empty object with no params', () => {
            const mock = mockData.getDataNoParams();
            const request = new Request(mock);
            assert.deepEqual(request.queryParams, {});
        });
        it('should body as a string when its JSON string', () => {
            const mock = mockData.getBadData();
            const request = new Request(mock);
            assert.equal(request.body, '{body_key: "body_value"},#');
        });
        it('should be an object from XML', () => {
            const mock = mockData.getDataXml();
            const request = new Request(mock);
            assert.deepEqual(request.body, {
                root: {
                    someobject: ['1', '2'],
                    test: 'test2'
                }
            });
        });
        it('should be a string from bad XML', () => {
            const mock = mockData.getBadDataXml();
            const request = new Request(mock);
            assert.equal(request.body, '<root><test>test2</test></root');
        });
        it('should be exactly what was sent when body is raw data', () => {
            const mock = mockData.getDataRaw();
            const request = new Request(mock);
            assert.equal(
                request.body,
                '----------------------------430661979790652055785011 Content-Disposition: form-data; name="test"'
            );
        });
        it('should handle graphql request', () => {
            const mock = mockData.getGraphQLData();
            const request = new Request(mock);
            assert.deepEqual(request.graphql, mock.body);
        });
        it('should handle full event', () => {
            const mock = mockData.getGraphQLData();
            const request = new Request(mock);
            assert.deepEqual(request.event, mock);
        });
        it('should have headers as an object form offline data', () => {
            const mock = mockData.getDataOffline();
            const request = new Request(mock);
            assert.deepEqual(request.authorizer, {
                'x-api-key': 'SOME-KEY',
                'content-type': 'application/json'
            });
        });
        it('should default content-type to application json', () => {
            const mock = mockData.getDataNoHeaders();
            const request = new Request(mock);
            assert.deepEqual(request.headers, {'content-type': 'application/json'});
        });
        it('should have path as an empty object with no params', () => {
            const mock = mockData.getDataNoParams();
            const request = new Request(mock);
            assert.deepEqual(request.pathParams, {});
        });
        it('should be able to set request path from key/value object', () => {
            const mock = mockData.getData();
            const request = new Request(mock);
            const key = 'key';
            const value = 'value';
            request.pathParams = {key, value};
            assert.deepEqual(request.pathParams, {key: 'value'});
        });
    });
    describe('test assignable context', () => {
        it('should have context default as null', () => {
            const mock = mockData.getData();
            const request = new Request(mock);
            assert.equal(request.context, null);
        });
        it('should have context as assignable', () => {
            const mock = mockData.getData();
            const request = new Request(mock);
            request.context = {context: true};
            assert.deepEqual(request.context, {context: true});
        });
        it('should have context as nullable', () => {
            const mock = mockData.getData();
            const request = new Request(mock);
            request.context = {nullable: true};
            assert.deepEqual(request.context, {nullable: true});
            request.context = null;
            assert.equal(request.context, null);
        });
        it('should have context as mutatable', () => {
            const mock = mockData.getData();
            const request = new Request(mock);
            request.context = {key1: 'value1'};
            assert.deepEqual(request.context, {key1: 'value1'});
            request.context.key2 = 'value2';
            assert.deepEqual(request.context, {key1: 'value1', key2: 'value2'});
        });
    });
    describe('test assignable paramPath', () => {
        it('should have paramPath default as emptu string', () => {
            const mock = mockData.getData();
            const request = new Request(mock);
            assert.equal(request.route, mockData.getData().path);
        });
        it('should have paramPath as assignable', () => {
            const mock = mockData.getData();
            const request = new Request(mock);
            request.route = '/grower/{id}';
            assert.equal(request.route, '/grower/{id}');
        });
    });
});
