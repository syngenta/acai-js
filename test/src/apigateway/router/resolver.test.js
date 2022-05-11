const {assert} = require('chai');
const RouteResolver = require('../../../../src/apigateway/router/resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Resolver: src/apigateway/router/resolver.js', () => {
    describe('test top level static methods', () => {
        const base = 'unittest/v1';
        const request = new Request(mockData.getData());
        const resolver = new RouteResolver();
        it('should be able to find endpoint', async () => {
            const controller = 'test/mocks/apigateway/mock-directory-handlers';
            const response = new Response();
            const endpoint = resolver.getEndpoint(request, response, base, controller);
            assert.equal(endpoint.httpMethod, 'get');
            assert.equal(response.code, 204);
        });
        it('should not be able to find endpoint and the correct error is caught', async () => {
            const controller = 'test/mocks/apigateway/mock-directory-handlers/not-found';
            const response = new Response();
            resolver.getEndpoint(request, response, base, controller);
            assert.equal(response.code, 404);
        });
        it('should not be able to find endpoint and throws unhandled error', async () => {
            const controller = 'test/mocks/apigateway/mock-directory-handlers';
            const request = new Request(mockData.getBadImportData('bad-import'));
            const response = new Response();
            resolver.getEndpoint(request, response, base, controller);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
        });
        it('should throw an error because file has a problem', () => {
            const controller = 'test/mocks/apigateway/mock-directory-handlers';
            const request = new Request(mockData.getApiGateWayRouteBadImport());
            const response = new Response();
            resolver.getEndpoint(request, response, base, controller);
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
        });
    });
});
