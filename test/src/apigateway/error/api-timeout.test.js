const {assert} = require('chai');
const ApiTimeout = require('../../../../src/apigateway/error/api-timeout');

describe('Test Api Timeout Error: src/apigateway/error/api-timeout.js', () => {
    it('should have these defaults', () => {
        const error = new ApiTimeout();
        assert.equal(error.code, 408);
        assert.equal(error.key, 'unknown');
        assert.equal(error.message, 'request timeout');
    });
    it('should be able to accept custom values', () => {
        const error = new ApiTimeout('db', 'connection timeout');
        assert.equal(error.code, 408);
        assert.equal(error.key, 'db');
        assert.equal(error.message, 'connection timeout');
    });
});
