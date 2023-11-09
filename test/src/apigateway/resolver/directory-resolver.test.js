const {assert} = require('chai');
const DirectoryResolver = require('../../../../src/apigateway/resolver/directory-resolver');
const ImportManager = require('../../../../src/apigateway/import-manager');
const {Request} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Directory Resovler: src/apigateway/resolver/directory-resolver.js', () => {
    describe('test basic routing: no path parameters', () => {
        const basePath = 'unit-test/v1';
        const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
        const importer = new ImportManager();
        const resolver = new DirectoryResolver({basePath, handlerPath}, importer);
        it('should find the file', () => {
            const mock = mockData.getApiGateWayRoute();
            const request = new Request(mock);
            const result = resolver.resolve(request);
            resolver.reset();
            assert.isTrue(typeof result.post === 'function');
        });
        it('should find the file with nested structure', () => {
            const mock = mockData.getApiGateWayCustomRoute('nested-1/nested-2/basic');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            resolver.reset();
            assert.isTrue(typeof result.post === 'function');
        });
        it('should not find the file', () => {
            const mock = mockData.getApiGateWayRoute('-fail');
            const request = new Request(mock);
            try {
                resolver.resolve(request);
                assert.isFalse(true);
            } catch (error) {
                resolver.reset();
                assert.equal(error.code, 404);
                assert.equal(error.key, 'url');
                assert.equal(error.message, 'endpoint not found');
            }
        });
        it('should fall back to index.js when route ends as a directory', async () => {
            const mock = mockData.getApiGateWayCustomRoute('directory');
            const request = new Request(mock);
            const result = resolver.resolve(request);
            resolver.reset();
            assert.isTrue(typeof result.get === 'function');
        });
    });
    describe('test basic routing: detects improper project structure', () => {
        it('should throw an error about multiple dynamic files in one directory', () => {
            const basePath = 'unit-test/v1';
            const handlerPath = 'test/mocks/apigateway/mock-bad-multi-dynamic';
            const importer = new ImportManager();
            const resolver = new DirectoryResolver({basePath, handlerPath}, importer);
            const mock = mockData.getApiGateWayRoute();
            const request = new Request(mock);
            try {
                resolver.resolve(request);
                assert.isTrue(false);
            } catch (error) {
                resolver.reset();
                assert.isTrue(error.message.includes('Cannot have two dynamic files or directories in the same directory.'));
            }
        });
        it('should throw an error about directory and files sharing the same name', () => {
            const basePath = 'unit-test/v1';
            const handlerPath = 'test/mocks/apigateway/mock-bad-same-file-dir';
            const importer = new ImportManager();
            const resolver = new DirectoryResolver({basePath, handlerPath}, importer);
            const mock = mockData.getApiGateWayRoute();
            const request = new Request(mock);
            try {
                resolver.resolve(request);
                assert.isTrue(false);
            } catch (error) {
                resolver.reset();
                assert.isTrue(error.message.includes('Cannot have file and directory share same name.'));
            }
        });
    });
    // describe('test routing: with path parameters', () => {
    //     const basePath = 'unit-test/v1';
    //     const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
    //     const resolver = new DirectoryResolver({basePath, handlerPath}, importer);
    //     it('should find the file', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
    //         const request = new Request(mock);
    //         const result = resolver.resolve(request);
    //         assert.isTrue(typeof result.get === 'function');
    //     });
    //     it('should find the nested file with trailing path parameter', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/nested-2/path-parameters/1', 'patch');
    //         const request = new Request(mock);
    //         const result = resolver.resolve(request);
    //         assert.isTrue(typeof result.patch === 'function');
    //     });
    //     it('should find the nested file with middle and trailing path parameter', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
    //         const request = new Request(mock);
    //         const result = resolver.resolve(request);
    //         assert.isTrue(typeof result.delete === 'function');
    //     });
    // });
    // describe('test routing: with path parameters and strict mode', () => {
    //     const basePath = 'unit-test/v1';
    //     const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
    //     const strictRouting = true;
    //     const resolver = new DirectoryResolver({basePath, handlerPath, strictRouting}, importer);
    //     it('should find the file without param', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('params/test', 'post');
    //         const request = new Request(mock);
    //         const result = resolver.resolve(request);
    //         assert.isTrue(typeof result.post === 'function');
    //     });
    //     it('should find the file with param', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('base/1', 'get');
    //         const request = new Request(mock);
    //         const result = resolver.resolve(request);
    //         assert.isTrue(typeof result.get === 'function');
    //     });
    //     it('should find the nested file', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('params/some-param/1', 'delete');
    //         const request = new Request(mock);
    //         const result = resolver.resolve(request);
    //         assert.isTrue(typeof result.delete === 'function');
    //     });
    //     it('should find the double nested file', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('params/some-param/nested/2', 'put');
    //         const request = new Request(mock);
    //         const result = resolver.resolve(request);
    //         assert.isTrue(typeof result.put === 'function');
    //     });
    //     it('should not find the file', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('not/found/1', 'get');
    //         const request = new Request(mock);
    //         try {
    //             const result = resolver.resolve(request);
    //             assert.isFalse(true);
    //         } catch (error) {
    //             assert.equal(error.code, 404);
    //             assert.equal(error.key, 'url');
    //             assert.equal(error.message, 'endpoint not found');
    //         }
    //     });
    //     it('should throw error for multiple params in same directory', () => {
    //         const mock = mockData.getApiGateWayCustomRouteWithParams('multiple-params/1', 'get');
    //         const request = new Request(mock);
    //         try {
    //             const result = resolver.resolve(request);
    //             assert.isFalse(true);
    //         } catch (error) {
    //             assert.equal(error.code, 500);
    //             assert.equal(error.key, 'router-config');
    //             assert.equal(error.message, 'can not have path parameter file & directory in the same directory');
    //         }
    //     });
    // });
});
