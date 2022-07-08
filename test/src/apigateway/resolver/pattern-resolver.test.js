const {assert} = require('chai');
const PatternResolver = require('../../../../src/apigateway/resolver/pattern-resolver');
const {Request} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test PatternResolver Resovler: src/apigateway/resolver/pattern-resolver', () => {
    describe('test suffix pattern routing', () => {
        const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
        const basePath = 'unit-test/v1';
        const resolver = new PatternResolver({handlerPattern, basePath});
        it('should find the file with mvc structure', () => {
            const mock = mockData.getApiGateWayRoute();
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should find the file with mvvm structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('mvvm');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.patch === 'function');
        });
        it('should find the file with nested mvc structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('nested-1/nested-2/basic');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the file with nested mvvm structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('nested-1/nested-2/nested-3');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.delete === 'function');
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
        it('should throw error for same direcotry & file', () => {
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
    });
    describe('test prefix pattern routing', () => {
        const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
        const basePath = 'unit-test/v1';
        const resolver = new PatternResolver({handlerPattern, basePath});
        it('should find the file with mvc structure', () => {
            const mock = mockData.getApiGateWayRoute();
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should find the file with mvvm structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('mvvm');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.patch === 'function');
        });
        it('should find the file with nested mvc structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('nested-1/nested-2/basic');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the file with nested mvvm structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('nested-1/nested-2/nested-3');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.delete === 'function');
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
    });
    describe('test exact pattern routing', () => {
        const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
        const basePath = 'unit-test/v1';
        const resolver = new PatternResolver({handlerPattern, basePath});
        it('should find the file with mvvm structure', () => {
            const mock = mockData.getApiGateWayRoute();
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the file with nested mvvm structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('nested-1/nested-2/nested-3');
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
    });
    describe('test suffix pattern routing with path parameters', () => {
        const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
        const basePath = 'unit-test/v1';
        const resolver = new PatternResolver({handlerPattern, basePath});
        it('should find the file with mvc structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should find the file with mvvm structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters-mvvm/1', 'put');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.put === 'function');
        });
        it('should find the nested file with mvc structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'post');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the nested file with mvvm structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters-mvvm/1', 'patch');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.patch === 'function');
        });
        it('should find the nested file with mvc structure with trailing and middle parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.delete === 'function');
        });
        it('should find the nested file with mvvm structure with trailing and middle parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters-mvvm/1', 'put');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.put === 'function');
        });
    });
    describe('test prefix pattern routing with path parameters', () => {
        const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
        const basePath = 'unit-test/v1';
        const resolver = new PatternResolver({handlerPattern, basePath});
        it('should find the file with mvc structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should find the file with mvvm structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters-mvvm/1', 'put');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.put === 'function');
        });
        it('should find the nested file with mvc structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'post');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the nested file with mvvm structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters-mvvm/1', 'patch');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.patch === 'function');
        });
        it('should find the nested file with mvc structure with trailing and middle parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.delete === 'function');
        });
        it('should find the nested file with mvvm structure with trailing and middle parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters-mvvm/1', 'put');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.put === 'function');
        });
    });
    describe('test exact pattern routing with path parameters', () => {
        const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
        const basePath = 'unit-test/v1';
        const resolver = new PatternResolver({handlerPattern, basePath});
        it('should find the file with mvvm structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should find the nested file with mvvm structure with trailing parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'patch');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.patch === 'function');
        });
        it('should find the nested file with mvvm structure with trailing and middle parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'put');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.put === 'function');
        });
    });
    describe('test strict routing with mvc structure', () => {
        const handlerPattern = 'test/mocks/apigateway/mock-strict-pattern-handlers/mvc/**/*.controller.js';
        const basePath = 'unit-test/v1';
        const strictRouting = true;
        const resolver = new PatternResolver({handlerPattern, basePath, strictRouting});
        it('should find the file with path parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('base/1', 'get');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should find the file without path param', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('params/test', 'post');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the nested file', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('params/some-param/1', 'delete');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.delete === 'function');
        });
        it('should find the double nested file', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('params/some-param/nested/2', 'put');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.put === 'function');
        });
        it('should not find the file', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('not/found/1', 'get');
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
        it('should throw error for multiple params in same directory', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('multiple-params/1', 'get');
            const request = new Request(mock);
            try {
                const result = resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 500);
                assert.equal(error.key, 'router-config');
                assert.equal(error.message, 'cant have path parameter file & directory in the same directory');
            }
        });
    });
    describe('test strict routing with mvvm structure', () => {
        const handlerPattern = 'test/mocks/apigateway/mock-strict-pattern-handlers/mvvm/**/*.controller.js';
        const basePath = 'unit-test/v1';
        const strictRouting = true;
        const resolver = new PatternResolver({handlerPattern, basePath, strictRouting});
        it('should find the file with path parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('base/1', 'get');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.get === 'function');
        });
        it('should find the file without path param', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('params/test', 'post');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the nested file', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('params/some-param/1', 'delete');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.delete === 'function');
        });
        it('should find the double nested file', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('params/some-param/nested/2', 'put');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            assert.isTrue(typeof result.put === 'function');
        });
        it('should not find the file', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('not/found/1', 'get');
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
        it('should throw error for multiple params in same directory', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('multiple-params/1', 'get');
            const request = new Request(mock);
            try {
                const result = resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 500);
                assert.equal(error.key, 'router-config');
                assert.equal(error.message, 'cant have path parameter file & directory in the same directory');
            }
        });
    });
});
