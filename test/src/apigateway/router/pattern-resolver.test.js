const {assert} = require('chai');
const PatternResolver = require('../../../../src/apigateway/router/pattern-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test PatternResolver Resovler: src/apigateway/router/pattern-resolver', () => {
    const handlerPattern = 'test/mocks/apigateway/mock-pattern-handlers/**/**.controller.js';
    const basePath = 'unittest/v1';
    const resolver = new PatternResolver({handlerPattern, basePath});
    const response = new Response();
    it('should find the file', () => {
        const request = new Request(mockData.getApiGateWayRoute());
        const result = resolver.resolve(request, response);
        assert.equal(result, 'test/mocks/apigateway/mock-pattern-handlers/basic.controller.js');
    });
    it('should not find the file', () => {
        const request = new Request(mockData.getApiGateWayRoute('-fail'));
        const result = resolver.resolve(request, response);
        assert.equal(response.code, 404);
        assert.equal(response.hasErrors, true);
    });
});
