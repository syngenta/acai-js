const {assert} = require('chai');
const DirectoryResolver = require('../../../../src/apigateway/router/directory-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Directory Resovler: src/apigateway/router/directory-resolver', () => {
    const resolver = new DirectoryResolver();
    const response = new Response();
    const basePath = 'unittest/v1';
    const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
    it('should find the file successfully', () => {
        const request = new Request(mockData.getApiGateWayRoute());
        const result = resolver.resolve(request, response, basePath, handlerPath);
        assert.equal(result, 'test/mocks/apigateway/mock-directory-handlers/basic.js');
    });
});
