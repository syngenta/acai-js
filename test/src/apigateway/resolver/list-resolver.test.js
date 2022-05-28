const {assert} = require('chai');
const ListResolver = require('../../../../src/apigateway/resolver/list-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test List Resovler: src/apigateway/resolver/list-resolver.js', () => {
    describe('test basic list routing', () => {
        const basePath = 'unit-test/v1';
        const handlerList = {
            'GET::basic/no-file': 'test/mocks/apigateway/mock-list-handlers/no-file.js',
            'POST::basic': 'test/mocks/apigateway/mock-list-handlers/basic.js',
            'GET::n1/n2/basic': 'test/mocks/apigateway/mock-list-handlers/n1/n2/basic.js'
        };
        const resolver = new ListResolver({basePath, handlerList});
        const response = new Response();
        it('should resolve', () => {
            const mock = mockData.getApiGateWayRoute();
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should resolve with nested structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('n1/n2/basic');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should not resolve bad route', () => {
            const mock = mockData.getApiGateWayRoute('-fail');
            const request = new Request(mock);
            try {
                resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.key, 'url');
                assert.equal(error.message, 'endpoint not found');
            }
        });
        it('should not resolve bad file', () => {
            const mock = mockData.getApiGateWayCustomRoute('basic/no-file');
            const request = new Request(mock);
            try {
                resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 500);
                assert.equal(error.key, 'router-config');
                assert.isTrue(error.message.includes('file not found'));
            }
        });
    });
    describe('test list routing with params', () => {
        const basePath = 'unit-test/v1';
        const handlerList = {
            'POST::basic/:id': 'test/mocks/apigateway/mock-list-handlers/basic.js',
            'GET::n1/n2/:org/basic': 'test/mocks/apigateway/mock-list-handlers/n1/n2/basic.js',
            'PATCH::n1/n2/:org/basic/:id': 'test/mocks/apigateway/mock-list-handlers/n1/n2/basic.js',
            'POST::basic/:id/fake': 'test/mocks/apigateway/mock-list-handlers/fake.js'
        };
        const resolver = new ListResolver({basePath, handlerList});
        const response = new Response();
        it('should resolve', () => {
            const route = 'basic/1';
            const method = 'POST';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, method);
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should not resolve', () => {
            const route = 'basic/1/not/found';
            const method = 'POST';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, method);
            const request = new Request(mock);
            try {
                const result = resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.key, 'url');
                assert.equal(error.message, 'endpoint not found');
            }
        });
        it('should resolve with nested structure no end variable', () => {
            const route = 'n1/n2/org/basic';
            const method = 'GET';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, method);
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should resolve with nested structure and end variable', () => {
            const route = 'n1/n2/org/basic/1';
            const method = 'PATCH';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, method);
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.patch === 'function');
        });
    });
    describe('test list routing with params with bad route config', () => {
        const basePath = 'unit-test/v1';
        it('should throw error for duplicate routes', () => {
            const handlerList = {
                'POST::basic/:id': 'test/mocks/apigateway/mock-list-handlers/basic.js',
                'POST::basic/:org': 'test/mocks/apigateway/mock-list-handlers/fake.js',
                'DELETE::basic/:org': 'test/mocks/apigateway/mock-list-handlers/fake.js'
            };
            const resolver = new ListResolver({basePath, handlerList});
            const response = new Response();
            const route = 'basic/1';
            const method = 'POST';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, method);
            const request = new Request(mock);
            try {
                const result = resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 500);
                assert.equal(error.key, 'router-config');
                assert.isTrue(error.message.includes('found two conflicting routes:'));
            }
        });
        it('should throw error for route with bad pattern', () => {
            const handlerList = {
                'DELETE:basic/:bad': 'test/mocks/apigateway/mock-list-handlers/bad.js'
            };
            const resolver = new ListResolver({basePath, handlerList});
            const response = new Response();
            const route = 'basic/1';
            const method = 'POST';
            const mock = mockData.getApiGateWayCustomRouteWithParams(route, method);
            const request = new Request(mock);
            try {
                const result = resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 500);
                assert.equal(error.key, 'router-config');
                assert.isTrue(error.message.includes('route does not follow pattern <METHOD>::route'));
            }
        });
    });
});
