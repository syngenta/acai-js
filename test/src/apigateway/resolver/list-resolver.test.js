const {assert} = require('chai');
const ListResolver = require('../../../../src/apigateway/resolver/list-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test List Resovler: src/apigateway/resolver/list-resolver.js', () => {
    const basePath = 'unittest/v1';
    const handlerList = {
        'POST:basic': 'test/mocks/apigateway/mock-list-handlers/basic.js',
        'GET:nested-1/nested-2/basic': 'test/mocks/apigateway/mock-list-handlers/basic.js'
    };
    const resolver = new ListResolver({basePath, handlerList});
    const response = new Response();
    it('should find the file', () => {
        const request = new Request(mockData.getApiGateWayRoute());
        const result = resolver.resolve(request);
        assert.isTrue(typeof result.post === 'function');
    });
    it('should find the file with nested structure', () => {
        const request = new Request(mockData.getApiGateWayCustomRoute('nested-1/nested-2/basic'));
        const result = resolver.resolve(request);
        assert.isTrue(typeof result.post === 'function');
    });
    it('should not find the file', () => {
        const request = new Request(mockData.getApiGateWayRoute('-fail'));
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
