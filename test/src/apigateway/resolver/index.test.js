const {assert} = require('chai');
const RouteResolver = require('../../../../src/apigateway/resolver');
const DirectoryResolver = require('../../../../src/apigateway/resolver/directory-resolver');
const PatternResolver = require('../../../../src/apigateway/resolver/pattern-resolver');
const ListResolver = require('../../../../src/apigateway/resolver/list-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Resolver: src/apigateway/resolver/index.js', () => {
    describe('test top level static methods', () => {
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
            const request = new Request(mockData.getApiGateWayRouteBadImport());
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
            const request = new Request(mockData.getApiGateWayRouteBadImport());
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
            const request = new Request(mockData.getApiGateWayRouteBadImport());
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
            const request = new Request(mockData.getApiGateWayRouteBadImport());
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
            const request = new Request(mockData.getBadImportData());
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
            const request = new Request(mockData.getApiGateWayRouteBadImport());
            const response = new Response();
            resolver.getEndpoint(request, response);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
        });
    });
});
