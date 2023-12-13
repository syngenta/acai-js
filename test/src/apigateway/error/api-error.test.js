const {assert} = require('chai');
const ApiError = require('../../../../src/apigateway/error/api-error');

describe('Test Api Error: src/apigateway/error/api-error.js', () => {
    it('should have these defaults', () => {
        const error = new ApiError();
        assert.equal(error.code, 500);
        assert.equal(error.key, 'unknown');
        assert.equal(error.message, 'something went wrong');
    });
    it('should be able to accept custom values', () => {
        const error = new ApiError(404, 'url', 'endpoint not found');
        assert.equal(error.code, 404);
        assert.equal(error.key, 'url');
        assert.equal(error.message, 'endpoint not found');
    });
});
