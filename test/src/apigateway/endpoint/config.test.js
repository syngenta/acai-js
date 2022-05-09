const {assert} = require('chai');
const mockData = require('../../../mocks/apigateway/mock-data');
const EndpointConfig = require('../../../../src/apigateway/endpoint/config');
const {Request, Response} = require('../../../../src').apigateway;

describe('Test Endpoint Config: src/apigateway/endpoint/config', () => {
    const base = 'unittest/v1';
    const request = new Request(mockData.getData());
    it('should be able to find endpoint', async () => {
        const controller = 'test/mocks/apigateway/mock-handlers';
        const response = new Response();
        const endpoint = EndpointConfig.getEndpoint(request, response, base, controller);
        assert.equal(endpoint.httpMethod, 'get');
        assert.equal(response.code, 204);
    });
    it('should not be able to find endpoint and the correct error is caught', async () => {
        const controller = 'test/mocks/apigateway/mock-handlers/not-found';
        const response = new Response();
        const endpoint = EndpointConfig.getEndpoint(request, response, base, controller);
        assert.equal(response.code, 404);
    });
    it('should not be able to find endpoint and throws unhandled error', async () => {
        const controller = 'test/mocks/apigateway/mock-handlers';
        const request = new Request(mockData.getBadImportData('bad-import'));
        const response = new Response();
        const endpoint = EndpointConfig.getEndpoint(request, response, base, controller);
        assert.equal(response.code, 500);
        assert.equal(response.hasErrors, true);
    });
});
