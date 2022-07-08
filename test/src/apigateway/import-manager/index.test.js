const {assert} = require('chai');
const ImportManager = require('../../../../src/apigateway/import-manager');

describe('Test Import Manager: src/apigateway/import-manager/index.js', () => {
    it('should return true for directory', () => {
        const path = 'test/mocks/apigateway/mock-strict-directory-handlers/base';
        const manager = new ImportManager();
        const result = manager.isDirectory(path);
        assert.equal(result, true);
    });
    it('should return false for directory', () => {
        const path = 'test/mocks/apigateway/mock-strict-directory-handlers/base/{base-id}.js';
        const manager = new ImportManager();
        const result = manager.isDirectory(path);
        assert.equal(result, false);
    });
    it('should return true for file', () => {
        const path = 'test/mocks/apigateway/mock-strict-directory-handlers/base/{base-id}.js';
        const manager = new ImportManager();
        const result = manager.isFile(path);
        assert.equal(result, true);
    });
    it('should return false for flie', () => {
        const path = 'test/mocks/apigateway/mock-strict-directory-handlers/base';
        const manager = new ImportManager();
        const result = manager.isFile(path);
        assert.equal(result, false);
    });
    it('should find path paramater directory', () => {
        const path = 'test/mocks/apigateway/mock-strict-directory-handlers/params';
        const manager = new ImportManager();
        const results = manager.getPathParameterResource(path);
        assert.equal(results[0], '{some-param}');
    });
    it('should find path paramater file', () => {
        const path = 'test/mocks/apigateway/mock-strict-directory-handlers/base';
        const manager = new ImportManager();
        const results = manager.getPathParameterResource(path);
        assert.equal(results[0], '{base-id}.js');
    });
});
