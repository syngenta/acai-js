const {assert} = require('chai');
const RouteError = require('../../../../src/apigateway/router/route-error');

describe('Test Route Error: src/apigateway/router/route-error.js', () => {
    it('should have these defaults', () => {
        const error = new RouteError();
        assert.equal(error.code, 500);
        assert.equal(error.key, 'unknown');
        assert.equal(error.message, 'something went wrong');
    });
    it('should be able to accept custom values', () => {
        const error = new RouteError(404, 'url', 'endpoint not found');
        assert.equal(error.code, 404);
        assert.equal(error.key, 'url');
        assert.equal(error.message, 'endpoint not found');
    });
});
