const {assert} = require('chai');
const RouteResolver = require('../../../../src/apigateway/router/resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Resolver: src/apigateway/router/resolver.js', () => {
    const resolver = new RouteResolver();
    const request = new Request(mockData.getApiGateWayRoute());
    const response = new Response();
    const basePath = 'unittest/v1';
    const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
    describe('basic test', () => {
        it('should find the file successfully', () => {
            const result = resolver.resolve(request, response, basePath, handlerPath);
            assert.equal(result, 'test/mocks/apigateway/mock-directory-handlers/basic.js');
        });
        it('should throw an error because file has a problem', () => {
            const result = resolver.resolve(request, response, basePath, handlerPath, 'fail');
            assert.equal(response.code, 500);
            assert.equal(response.hasErrors, true);
        });
    });
});