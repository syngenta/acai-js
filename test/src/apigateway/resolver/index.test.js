const {assert} = require('chai');
const RouteResolver = require('../../../../src/apigateway/resolver');
const DirectoryResolver = require('../../../../src/apigateway/resolver/directory-resolver');
const PatternResolver = require('../../../../src/apigateway/resolver/pattern-resolver');
const ListResolver = require('../../../../src/apigateway/resolver/list-resolver');
const ImportManager = require('../../../../src/apigateway/resolver/import-manager');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Resolver: src/apigateway/resolver/index.js', () => {
    describe('test top level methods', () => {
        it('should return an instance of DirectoryResolver', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}, importer).getResolver();
            assert.isTrue(resolver instanceof DirectoryResolver);
        });
        it('should return an instance of PatternResolver', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'pattern';
            const handlerPattern = 'test/mocks/apigateway/mock-directory-handlers/**/*.controller.js';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer).getResolver();
            assert.isTrue(resolver instanceof PatternResolver);
        });
        it('should return an instance of ListResolver', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'list';
            const handlerList = [];
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerList}, importer).getResolver();
            assert.isTrue(resolver instanceof ListResolver);
        });
    });
    describe('test directory resolver with path parameters', () => {
        it('should resolve endpoint with trailing path parameter', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/path-parameters/{id}');
        });
        it('should not resolve endpoint with path parameter but wrong path requiredPath', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('bad-path-parameters/1', 'post');
            const request = new Request(mock);
            try {
                resolver.getEndpoint(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.message, 'endpoint not found');
            }
        });
        it('should not resolve endpoint with trailing path parameter but missing requiredPath', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('bad-path-parameters/1', 'delete');
            const request = new Request(mock);
            try {
                resolver.getEndpoint(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.message, 'endpoint not found');
            }
        });
        it('should find the nested file with trailing path parameter', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/nested-2/path-parameters/1', 'patch');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/nested-1/nested-2/path-parameters/{id}');
        });
        it('should find the nested file with middle and trailing path parameter', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1', org: 'syngenta'});
            assert.equal(request.route, '/unit-test/v1/nested-1/{org}/path-parameters/{id}');
        });
        it('should find file with multiple trailing path parameters', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('multi-trailing/some-key/some-value', 'get');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {key: 'some-key', value: 'some-value'});
            assert.equal(request.route, '/unit-test/v1/multi-trailing/{key}/{value}');
        });
    });
    describe('test suffix pattern resolver with path parameters', () => {
        it('should resolve endpoint with trailing path parameter and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/path-parameters/{id}');
        });
        it('should resolve endpoint with nested file and trailing path parameter and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'post');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/nested-1/path-parameters/{id}');
        });
        it('should resolve endpoint with nested file, middle & trailing path parameters and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1', org: 'syngenta'});
            assert.equal(request.route, '/unit-test/v1/nested-1/{org}/path-parameters/{id}');
        });
        it('should not resolve endpoint with nested file, with bad path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1/2', 'delete');
            const request = new Request(mock);
            try {
                resolver.getEndpoint(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.message, 'endpoint not found');
            }
        });
    });
    describe('test prefix pattern resolver with path parameters', () => {
        it('should resolve endpoint with trailing path parameter and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/path-parameters/{id}');
        });
        it('should resolve endpoint with nested file and trailing path parameter and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'post');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/nested-1/path-parameters/{id}');
        });
        it('should resolve endpoint with nested file, middle & trailing path parameters and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1', org: 'syngenta'});
            assert.equal(request.route, '/unit-test/v1/nested-1/{org}/path-parameters/{id}');
        });
        it('should not resolve endpoint with nested file, with bad path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1/2', 'delete');
            const request = new Request(mock);
            try {
                resolver.getEndpoint(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.message, 'endpoint not found');
            }
        });
    });
    describe('test exact pattern resolver with path parameters', () => {
        it('should resolve endpoint with trailing path parameter and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
        });
        it('should resolve endpoint with nested file and trailing path parameter and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'patch');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
        });
        it('should resolve endpoint with nested file, middle & trailing path parameters and have path params', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'put');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1', org: 'syngenta'});
            assert.equal(request.route, '/unit-test/v1/nested-1/{org}/path-parameters/{id}');
        });
        it('should not resolve endpoint with nested file, with bad path params and bad method', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
            const routingMode = 'pattern';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1/2', 'delete');
            const request = new Request(mock);
            try {
                resolver.getEndpoint(request);
                assert.isFalse(true);
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.message, 'endpoint not found');
            }
        });
    });
    describe('test list resolver with path parameters', () => {
        const handlerList = {
            'POST::basic/{id}': 'test/mocks/apigateway/mock-list-handlers/basic.js',
            'PUT::n1/n2/basic/{id}': 'test/mocks/apigateway/mock-list-handlers/n1/n2/basic.js',
            'PATCH::n1/n2/{nested}/basic/{id}': 'test/mocks/apigateway/mock-list-handlers/n1/n2/basic.js'
        };
        it('should resolve endpoint with trailing path parameter', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'list';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerList}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('basic/1', 'post');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/basic/{id}');
        });
        it('should find the nested file with trailing path parameter', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'list';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerList}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('n1/n2/basic/1', 'put');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/n1/n2/basic/{id}');
        });
        it('should find the nested file with middle and trailing path parameter', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'list';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerList}, importer);
            const mock = mockData.getApiGateWayCustomRouteWithParams('n1/n2/syngenta/basic/1', 'patch');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1', nested: 'syngenta'});
            assert.equal(request.route, '/unit-test/v1/n1/n2/{nested}/basic/{id}');
        });
    });
    describe('test resolver cache', () => {
        it('should not have any cache misses', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const mock = mockData.getData();
            const request = new Request(mock);
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}, importer);
            resolver.getEndpoint(request);
            resolver.getEndpoint(request);
            resolver.getEndpoint(request);
            resolver.getEndpoint(request);
            assert.equal(resolver.cacheMisses, 1);
        });
        it('should have any 4 cache misses', () => {
            const basePath = 'unit-test/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const mock = mockData.getData();
            const cacheSize = 0;
            const request = new Request(mock);
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, routingMode, handlerPath, cacheSize}, importer);
            resolver.getEndpoint(request);
            resolver.getEndpoint(request);
            resolver.getEndpoint(request);
            resolver.getEndpoint(request);
            assert.equal(resolver.cacheMisses, 4);
        });
    });
});
