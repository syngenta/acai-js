const PathResolver = require('../../../src/apigateway/endpoint-config/path-resolver');
const path = require('path');
const {expect} = require('chai');

describe('PathResolver', () => {
    it('PathResolver should be created', () => {
        const pathResolver = new PathResolver();
        expect(pathResolver.path).to.eq('.')
    });

    it('Path resolver should resolve simple cases', () => {
        const basePath = '/';
        const handlerPath = '/hello';
        const requestPath = '/world';

        const pathResolver = new PathResolver({
            basePath,
            handlerPath,
            requestPath,
        });
        expect(pathResolver.path).to.eq(path.join('hello', 'world'));
    });

    it('Path resolver should throw error if paths don\'t match', () => {
        const basePath = '/foo';
        const handlerPath = '/hello';
        const requestPath = '/world';

        const handler = () => new PathResolver({
            basePath,
            handlerPath,
            requestPath,
        });
        expect(handler).to.throw('base path is not match request path');
    });

    it('Path resolver should clean /', () => {
        const basePath = '/foo';
        const handlerPath = '/hello/';
        const requestPath = '/foo/world/';

        const pathResolver = new PathResolver({
            basePath,
            handlerPath,
            requestPath,
        });
        expect(pathResolver.path).to.eq(path.join('hello', 'world'));
    });
});
