const {assert} = require('chai');
const RouteResolver = require('../../../../src/apigateway/resolver');
const PatternResolver = require('../../../../src/apigateway/resolver/pattern-resolver');
const ImportManager = require('../../../../src/apigateway/resolver/import-manager');
const {Request} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Resolver: src/apigateway/resolver/index.js', () => {
    describe('resolver instantiation', () => {
        it('should return a pattern resolver when handlerPattern provided', () => {
            const basePath = 'unit-test/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const importer = new ImportManager();
            const resolver = new RouteResolver({basePath, handlerPattern}, importer).getResolver();
            assert.instanceOf(resolver, PatternResolver);
        });

        it('should expand handlerPath into glob pattern', () => {
            const basePath = 'unit-test/v1';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const importer = new ImportManager();
            const params = {basePath, handlerPath};
            const routeResolver = new RouteResolver(params, importer);
            const resolver = routeResolver.getResolver();
            assert.instanceOf(resolver, PatternResolver);
            assert.equal(params.handlerPattern, 'test/mocks/apigateway/mock-directory-handlers/**/*.js');
        });
    });

    describe('directory-style routing via handlerPath', () => {
        const basePath = 'unit-test/v1';
        const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
        const importer = new ImportManager();
        const resolver = new RouteResolver({basePath, handlerPath}, importer);

        it('should resolve endpoint with trailing path parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/path-parameters/{id}');
        });

        it('should reject unresolved path parameters when requiredPath missing', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('bad-path-parameters/1', 'delete');
            const request = new Request(mock);
            try {
                resolver.getEndpoint(request);
                assert.fail('expected resolver to throw');
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.message, 'endpoint not found');
            }
        });

        it('should resolve nested path parameters', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {org: 'syngenta', id: '1'});
            assert.equal(request.route, '/unit-test/v1/nested-1/{org}/path-parameters/{id}');
        });
    });

    describe('pattern routing using explicit glob', () => {
        const basePath = 'unit-test/v1';
        const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
        const importer = new ImportManager();
        const resolver = new RouteResolver({basePath, handlerPattern}, importer);

        it('should resolve endpoint with trailing path parameter', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/path-parameters/{id}');
        });

        it('should resolve nested endpoint with dynamic segments', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'post');
            const request = new Request(mock);
            resolver.getEndpoint(request);
            assert.deepEqual(request.pathParams, {id: '1'});
            assert.equal(request.route, '/unit-test/v1/nested-1/path-parameters/{id}');
        });

        it('should reject routes without matching dynamic segments', () => {
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters', 'post');
            const request = new Request(mock);
            try {
                resolver.getEndpoint(request);
                assert.fail('expected resolver to throw');
            } catch (error) {
                assert.equal(error.code, 404);
                assert.equal(error.message, 'endpoint not found');
            }
        });
    });
});
