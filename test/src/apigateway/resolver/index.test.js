const {assert} = require('chai');
const RouteResolver = require('../../../../src/apigateway/resolver');
const DirectoryResolver = require('../../../../src/apigateway/resolver/directory-resolver');
const PatternResolver = require('../../../../src/apigateway/resolver/pattern-resolver');
const ListResolver = require('../../../../src/apigateway/resolver/list-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Resolver: src/apigateway/resolver/index.js', () => {
    describe('test top level methods', () => {
        it('should return an instance of DirectoryResolver', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath}).getResolver();
            assert.isTrue(resolver instanceof DirectoryResolver);
        });
        it('should return an instance of PatternResolver', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'pattern';
            const handlerPattern = 'test/mocks/apigateway/mock-directory-handlers/**/*.controller.js';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern}).getResolver();
            assert.isTrue(resolver instanceof PatternResolver);
        });
        it('should return an instance of ListResolver', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'list';
            const handlerList = [];
            const resolver = new RouteResolver({basePath, routingMode, handlerList}).getResolver();
            assert.isTrue(resolver instanceof ListResolver);
        });
        it('should throw error for improper routingMode configuration', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'fail';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getApiGateWayRouteBadImport();
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
            assert.equal(
                response.body,
                '{"errors":[{"key_path":"router-config","message":"routingMode must be either directory, pattern or list"}]}'
            );
        });
        it('should throw error for improper directory configuration missing handlerPath', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const resolver = new RouteResolver({basePath, routingMode});
            const mock = mockData.getApiGateWayRouteBadImport();
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
            assert.equal(
                response.body,
                '{"errors":[{"key_path":"router-config","message":"handlerPath config is requied when routingMode is directory"}]}'
            );
        });
        it('should throw error for improper pattern configuration missing handlerPattern', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode});
            const mock = mockData.getApiGateWayRouteBadImport();
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
            assert.equal(
                response.body,
                '{"errors":[{"key_path":"router-config","message":"handlerPattern config is requied when routingMode is pattern"}]}'
            );
        });
        it('should throw error for improper list configuration missing handlerList', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'list';
            const resolver = new RouteResolver({basePath, routingMode});
            const mock = mockData.getApiGateWayRouteBadImport();
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
            assert.equal(
                response.body,
                '{"errors":[{"key_path":"router-config","message":"handlerList config is requied when routingMode is list"}]}'
            );
        });
        it('should not be able to find endpoint and throws unhandled error', async () => {
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getBadImportData();
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
        });
        it('should find file but throw an error because file has a problem', () => {
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getApiGateWayRouteBadImport();
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
        });
    });
    describe('test directory resolver with path parameters', () => {
        it('should resolve endpoint with trailing path parameter', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should not resolve endpoint with path parameter but wrong path requiredPath', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getApiGateWayCustomRouteWithParams('bad-path-parameters/1', 'post');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 404);
            assert.equal(response.hasErrors, true);
        });
        it('should not resolve endpoint with trailing path parameter but missing requiredPath', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getApiGateWayCustomRouteWithParams('bad-path-parameters/1', 'delete');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 404);
            assert.equal(response.hasErrors, true);
        });
        it('should find the nested file with trailing path parameter', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/nested-2/path-parameters/1', 'patch');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should find the nested file with middle and trailing path parameter', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1', org: 'syngenta'});
        });
        it('should resolve endpoint with trailing path parameter', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
    });
    describe('test suffix pattern resolver with path parameters', () => {
        it('should resolve endpoint with trailing path parameter and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should resolve endpoint with nested file and trailing path parameter and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'post');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should resolve endpoint with nested file, middle & trailing path parameters and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1', org: 'syngenta'});
        });
        it('should not resolve endpoint with nested file, with bad path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1/2', 'delete');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 404);
            assert.equal(response.hasErrors, true);
        });
    });
    describe('test prefix pattern resolve.*r with path parameters', () => {
        it('should resolve endpoint with trailing path parameter and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should resolve endpoint with nested file and trailing path parameter and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'post');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should resolve endpoint with nested file, middle & trailing path parameters and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'delete');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1', org: 'syngenta'});
        });
        it('should not resolve endpoint with nested file, with bad path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/prefix/**/controller.*.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1/2', 'delete');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 404);
            assert.equal(response.hasErrors, true);
        });
    });
    describe('test exact pattern resolver with path parameters', () => {
        it('should resolve endpoint with trailing path parameter and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('path-parameters/1', 'get');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should resolve endpoint with nested file and trailing path parameter and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/path-parameters/1', 'patch');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should resolve endpoint with nested file, middle & trailing path parameters and have path params', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1', 'put');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1', org: 'syngenta'});
        });
        it('should not resolve endpoint with nested file, with bad path params and bad method', () => {
            const basePath = 'unittest/v1';
            const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/exact/**/controller.js';
            const routingMode = 'pattern';
            const resolver = new RouteResolver({basePath, routingMode, handlerPattern});
            const mock = mockData.getApiGateWayCustomRouteWithParams('nested-1/syngenta/path-parameters/1/2', 'delete');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 404);
            assert.equal(response.hasErrors, true);
        });
    });
    describe('test list resolver with path parameters', () => {
        const basePath = 'unittest/v1';
        const handlerList = {
            'POST::basic/:id': 'test/mocks/apigateway/mock-list-handlers/basic.js',
            'PUT::n1/n2/basic/:id': 'test/mocks/apigateway/mock-list-handlers/n1/n2/basic.js',
            'PATCH::n1/n2/:nested/basic/:id': 'test/mocks/apigateway/mock-list-handlers/n1/n2/basic.js'
        };
        it('should resolve endpoint with trailing path parameter', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'list';
            const resolver = new RouteResolver({basePath, routingMode, handlerList});
            const mock = mockData.getApiGateWayCustomRouteWithParams('basic/1', 'post');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should find the nested file with trailing path parameter', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'list';
            const resolver = new RouteResolver({basePath, routingMode, handlerList});
            const mock = mockData.getApiGateWayCustomRouteWithParams('n1/n2/basic/1', 'put');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1'});
        });
        it('should find the nested file with middle and trailing path parameter', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'list';
            const resolver = new RouteResolver({basePath, routingMode, handlerList});
            const mock = mockData.getApiGateWayCustomRouteWithParams('n1/n2/syngenta/basic/1', 'patch');
            const request = new Request(mock);
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.deepEqual(request.path, {id: '1', nested: 'syngenta'});
        });
    });
});
