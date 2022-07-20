const {assert} = require('chai');
const ImportError = require('../../../../src/apigateway/import-manager/import-error');

describe('Test Import Error: src/apigateway/import-manager/import-error.js', () => {
    it('should have these defaults', () => {
        const error = new ImportError();
        assert.equal(error.code, 500);
        assert.equal(error.key, 'unknown');
        assert.equal(error.message, 'something went wrong');
    });
    it('should be able to accept custom values', () => {
        const error = new ImportError(404, 'url', 'endpoint not found');
        assert.equal(error.code, 404);
        assert.equal(error.key, 'url');
        assert.equal(error.message, 'endpoint not found');
    });
});
