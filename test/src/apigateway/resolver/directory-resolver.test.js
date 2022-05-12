const {assert} = require('chai');
const DirectoryResolver = require('../../../../src/apigateway/resolver/directory-resolver');
const {Request, Response} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');

describe('Test Directory Resovler: src/apigateway/resolver/directory-resolver.js', () => {
    const basePath = 'unittest/v1';
    const handlerPath = 'test/mocks/apigateway/mock-directory-handlers/';
    const resolver = new DirectoryResolver({basePath, handlerPath});
    const response = new Response();
    it('should find the file', () => {
        const request = new Request(mockData.getApiGateWayRoute());
        const result = resolver.resolve(request);
        assert.isTrue(typeof result.post === 'function');
    });
    it('should not find the file', () => {
        const request = new Request(mockData.getApiGateWayRoute('-fail'));
        try {
            resolver.resolve(request);
        } catch (error) {
            assert.equal(error.code, 404);
            assert.equal(error.key, 'url');
            assert.equal(error.message, 'endpoint not found');
        }
    });
    it('should fail when app has same with same file & directory', async () => {
        const request = new Request(mockData.getApiGateWayCustomRoute('same-file-directory'));
        try {
            resolver.resolve(request);
        } catch (error) {
            assert.equal(error.code, 500);
            assert.equal(error.key, 'router-config');
            assert.equal(error.message, 'file & directory cant share name in the same directory');
        }
    });
    it('should fall back to index.js when route ends as a directory', async () => {
        const request = new Request(mockData.getApiGateWayCustomRoute('directory'));
        const result = resolver.resolve(request);
        assert.isTrue(typeof result.get === 'function');
    });
});
