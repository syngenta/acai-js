const {assert} = require('chai');
const DirectoryResolver = require('../../../../src/apigateway/router/directory-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Directory Resovler: src/apigateway/router/directory-resolver', () => {
    const basePath = 'unittest/v1';
    const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
    const routingMode = 'directory';
    const resolver = new DirectoryResolver({basePath, routingMode, handlerPath});
    const response = new Response();
    it('should find the file', () => {
        const request = new Request(mockData.getApiGateWayRoute());
        const result = resolver.resolve(request, response);
        assert.equal(result, 'test/mocks/apigateway/mock-directory-handlers/basic.js');
    });
    it('should not find the file', () => {
        const request = new Request(mockData.getApiGateWayRoute('-fail'));
        resolver.resolve(request, response);
        assert.equal(response.code, 404);
        assert.equal(response.hasErrors, true);
    });
    it('should fail when app has same with same file & directory', async () => {
        const request = new Request(mockData.getApiGateWayCustomRoute('same-file-directory'));
        resolver.resolve(request, response);
        try {
            resolver.resolve(request, response);
        } catch (error) {
            assert.equal(error.message, 'file & directory share name in the same directory');
        }
    });
    it('should fall back to index.js when route ends as a directory', async () => {
        const request = new Request(mockData.getApiGateWayCustomRoute('directory'));
        const result = resolver.resolve(request, response);
        assert.equal(result, 'test/mocks/apigateway/mock-directory-handlers/directory/index.js');
    });
});
