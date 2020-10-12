const {assert} = require('chai');
require('chai').should();
const ResponseClient = require('../../src').apigateway.Response;

describe('Test Response Client', () => {
    const responseClient = new ResponseClient();
    describe('test constructor', () => {
        it('client built', () => {
            responseClient.should.have.property('_body');
            responseClient.should.have.property('_code');
            responseClient.should.have.property('_headers');
        });
    });
    describe('test headers', () => {
        it('default headers', () => {
            assert.deepEqual(responseClient.headers, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            });
        });
        it('custom headers', () => {
            responseClient.headers = {key: 'x-user-id', value: 'abc123'};
            assert.deepEqual(responseClient.headers, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'x-user-id': 'abc123'
            });
        });
    });
    describe('test code', () => {
        it('no body code', () => {
            assert.equal(responseClient.code, 200);
        });
        it('code with body', () => {
            responseClient.body = {bodyKey: 'body'};
            assert.equal(responseClient.code, 200);
        });
        it('custom code with body', () => {
            responseClient.body = {bodyKey: 'body'};
            responseClient.code = 304;
            assert.equal(responseClient.code, 304);
        });
    });
    describe('test body', () => {
        it('body is json string', () => {
            responseClient.body = {bodyKey: 'body'};
            assert.equal(responseClient.body, '{"bodyKey":"body"}');
        });
        it('body is some other string', () => {
            responseClient.body = 'some other string';
            assert.equal(responseClient.body, '"some other string"');
        });
    });
    describe('test response', () => {
        it('full response', () => {
            responseClient.body = {bodyKey: 'body'};
            responseClient.code = 200;
            assert.deepEqual(responseClient.response, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'x-user-id': 'abc123'
                },
                statusCode: 200,
                body: '{"bodyKey":"body"}'
            });
        });
    });
    describe('test hasErrors', () => {
        it('no errors', () => {
            assert.equal(responseClient.hasErrors, false);
        });
        it('has errors', () => {
            responseClient.setError('root', 'unittest has error');
            assert.equal(responseClient.hasErrors, true);
        });
        it('proper error response', () => {
            responseClient.setError('root', 'unittest can set multiple errors');
            assert.deepEqual(responseClient.response, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'x-user-id': 'abc123'
                },
                statusCode: 400,
                body:
                    '{"errors":[{"key_path":"root","message":"unittest has error"},{"key_path":"root","message":"unittest can set multiple errors"}]}'
            });
        });
    });
});
