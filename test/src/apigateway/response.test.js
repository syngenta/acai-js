const {assert} = require('chai');
require('chai').should();
const Response = require('../../../src').apigateway.Response;

describe('Test Response', () => {
    describe('test headers', () => {
        const response = new Response();
        it('default headers', () => {
            assert.deepEqual(response.headers, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            });
        });
        it('custom headers', () => {
            response.headers = {key: 'x-user-id', value: 'abc123'};
            assert.deepEqual(response.headers, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'x-user-id': 'abc123'
            });
        });
    });
    describe('test code', () => {
        it('no body code', () => {
            const response = new Response();
            assert.equal(response.code, 204);
        });
        it('code with body', () => {
            const response = new Response();
            response.body = {bodyKey: 'body'};
            assert.equal(response.code, 200);
        });
        it('custom code with body', () => {
            const response = new Response();
            response.body = {bodyKey: 'body'};
            response.code = 304;
            assert.equal(response.code, 304);
        });
    });
    describe('test body', () => {
        it('body is json string', () => {
            const response = new Response();
            response.body = {bodyKey: 'body'};
            assert.equal(response.body, '{"bodyKey":"body"}');
        });
        it('body is some other string', () => {
            const response = new Response();
            response.body = 'some other string';
            assert.equal(response.body, '"some other string"');
        });
        it('body is bad object', () => {
            const response = new Response();
            const badObj = {};
            badObj.a = {b: badObj};
            response.body = badObj;
            assert.deepEqual(response.body, badObj);
        });
    });
    describe('test raw body', () => {
        it('raw is object', () => {
            const response = new Response();
            response.body = {bodyKey: 'body'};
            assert.deepEqual(response.rawBody, {bodyKey: 'body'});
        });
    });
    describe('test response', () => {
        const response = new Response();
        it('full response', () => {
            response.body = {bodyKey: 'body'};
            response.code = 200;
            assert.deepEqual(response.response, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"bodyKey":"body"}'
            });
        });
    });
    describe('test hasErrors', () => {
        const response = new Response();
        it('no errors', () => {
            assert.equal(response.hasErrors, false);
        });
        it('has errors', () => {
            response.setError('root', 'unittest has error');
            assert.equal(response.hasErrors, true);
        });
        it('proper error response', () => {
            response.setError('root', 'unittest can set multiple errors');
            assert.deepEqual(response.response, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body:
                    '{"errors":[{"key_path":"root","message":"unittest has error"},{"key_path":"root","message":"unittest can set multiple errors"}]}'
            });
        });
    });
});
