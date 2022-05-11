const {assert} = require('chai');
const RouteResolver = require('../../../../src/apigateway/router/resolver');
const DirectoryResolver = require('../../../../src/apigateway/router/directory-resolver');
const PatternResolver = require('../../../../src/apigateway/router/pattern-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Resolver: src/apigateway/router/resolver.js', () => {
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
        it('should throw error for improper configuration', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'fail';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const request = new Request(mockData.getApiGateWayRouteBadImport());
            const response = new Response();
            try {
                resolver.getEndpoint(request, response);
            } catch (error) {
                assert.equal(error.message, 'routingMode must be either directory or pattern');
            }
        });
        it('should return module', () => {
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const resolved = 'test/mocks/apigateway/mock-directory-handlers/basic';
            const response = new Response();
            const module = resolver.getModule(resolved, response);
            assert.isFalse(response.hasErrors);
            assert.deepEqual(module.requirements, {
                post: {
                    requiredBody: 'v1-test-request'
                }
            });
        });
        it('should not return module', () => {
            const resolved = 'test/mocks/apigateway/mock-directory-handlers/basic-fail';
            const basePath = 'unittest/v1';
            const routingMode = 'directory';
            const handlerPath = 'test/mocks/apigateway/mock-directory-handlers';
            const resolver = new RouteResolver({basePath, routingMode, handlerPath});
            const response = new Response();
            const module = resolver.getModule(resolved, response);
            assert.isTrue(response.hasErrors);
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
