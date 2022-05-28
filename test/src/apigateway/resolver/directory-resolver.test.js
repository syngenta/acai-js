const {assert} = require('chai');
const DirectoryResolver = require('../../../../src/apigateway/resolver/directory-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Directory Resovler: src/apigateway/resolver/directory-resolver.js', () => {
    describe('test basic routing: no path parameters', () => {
        const basePath = 'unit-test/v1';
        const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
        const resolver = new DirectoryResolver({basePath, handlerPath});
        const response = new Response();
        it('should find the file', () => {
            const mock = mockData.getApiGateWayRoute();
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the file with nested structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('nested-1/nested-2/basic');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should not find the file', () => {
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
        it('should fail when app has same with same file & directory', async () => {
            const mock = mockData.getApiGateWayCustomRoute('same-file-directory');
            const request = new Request(mock);
            try {
                resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 500);
                assert.equal(error.key, 'router-config');
                assert.equal(error.message, 'file & directory cant share name in the same directory');
            }
        });
        it('should fall back to index.js when route ends as a directory', async () => {
            const mock = mockData.getApiGateWayCustomRoute('directory');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
    });
    describe('test routing: with path parameters', () => {
        const basePath = 'unit-test/v1';
        const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
        const resolver = new DirectoryResolver({basePath, handlerPath});
        const response = new Response();
        it('should find the file', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should find the nested file with trailing path parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/nested-2/path-parameters/1', 'patch');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.patch === 'function');
        });
        it('should find the nested file with middle and trailing path parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.delete === 'function');
        });
    });
});
