const {assert} = require('chai');
require('chai').should();
const Response = require('../../../src').apigateway.Response;

describe('Test Response: src/apigateway/response.js', () => {
    describe('test headers', () => {
        const response = new Response();
        it('should have these default headers', () => {
            assert.deepEqual(response.headers, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            });
        });
        it('should be able to accept custom headers', () => {
            response.headers = {key: 'x-user-id', value: 'abc123'};
            assert.deepEqual(response.headers, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'x-user-id': 'abc123'
            });
        });
    });
    describe('test response code', () => {
        it('should default to 204 with empty body', () => {
            const response = new Response();
            assert.equal(response.code, 204);
        });
        it('should default to 200 with body', () => {
            const response = new Response();
            response.body = {bodyKey: 'body'};
            assert.equal(response.code, 200);
        });
        it('should be able to accept custom code', () => {
            const response = new Response();
            response.body = {bodyKey: 'body'};
            response.code = 418;
            assert.equal(response.code, 418);
        });
    });
    describe('test body', () => {
        it('should be a json string for the body', () => {
            const response = new Response();
            response.body = {bodyKey: 'body'};
            assert.equal(response.body, '{"bodyKey":"body"}');
        });
        it('should be some other string for the body', () => {
            const response = new Response();
            response.body = 'some other string';
            assert.equal(response.body, '"some other string"');
        });
        it('should be able to handle a bad object', () => {
            const response = new Response();
            const badObj = {};
            badObj.a = {b: badObj};
            response.body = badObj;
            assert.deepEqual(response.body, badObj);
        });
    });
    describe('test raw body', () => {
        it('should be an object', () => {
            const response = new Response();
            response.body = {bodyKey: 'body'};
            assert.deepEqual(response.rawBody, {bodyKey: 'body'});
        });
    });
    describe('test response', () => {
        const response = new Response();
        it('should be this full response', () => {
            response.body = {bodyKey: 'body'};
            response.code = 200;
            assert.deepEqual(response.response, {
                isBase64Encoded: false,
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
        it('should start with no errors', () => {
            assert.equal(response.hasErrors, false);
        });
        it('should know it has errors when it has errors', () => {
            response.setError('root', 'unit-test has error');
            assert.equal(response.hasErrors, true);
        });
        it('should have proper error signature', () => {
            response.setError('root', 'unit-test can set multiple errors');
            assert.deepEqual(response.response, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body:
                    '{"errors":[{"key_path":"root","message":"unit-test has error"},{"key_path":"root","message":"unit-test can set multiple errors"}]}'
            });
        });
    });
    describe('test hasErrors', () => {
        it('should start compress as false', () => {
            const response = new Response();
            assert.equal(response.compress, false);
        });
        it('should be mutable to change compress to true', () => {
            const response = new Response();
            response.compress = true;
            assert.equal(response.compress, true);
        });
        it('should compress bodyKey', () => {
            const response = new Response();
            response.body = {'test': true};
            response.compress = true;
            assert.equal(response.body instanceof String, true);
        });
    });
});
