const {assert, expect} = require('chai');
const sinon = require('sinon');
const {Router} = require('../../src').apigateway;
const mockData = require('./mock-data');
const mockPermissions = require('./mock-permissions-middleware');

describe('Test Router', () => {
    describe('test route', () => {
        it('router: found app route', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('router: found app route; no trailing /', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: '/test/apigateway',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('router: found public route', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute('client-'),
                basePath: 'client-unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('router: did not find route', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute('', '-fail'),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 404,
                body: '{"errors":[{"key_path":"url","message":"endpoint not found"}]}'
            });
        });
        it('router: method not allowed', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute('', '', 'GET'),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 403,
                body: '{"errors":[{"key_path":"method","message":"method not allowed"}]}'
            });
        });
        it('router: defaults to index', async () => {
            this.router = new Router({
                event: await mockData.getIndexApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: '/test/apigateway'
            });
            const results = await this.router._getEndpoint();
            assert.equal(results, 'test/apigateway/index.js');
        });
        it('router: ran route without the need of requirements export', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRouteNoRequirements(),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml'
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('router: test permissions fail', async () => {
            this.router = new Router({
                event: await mockData.getApiGateWayRoute('', '', 'PATCH'),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml',
                beforeAll: mockPermissions.checkPermissions
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body: '{"errors":[{"key_path":"headers","message":"in appropriate api-key"}]}'
            });
        });
        it('router: test permissions pass', async () => {
            const event = await mockData.getApiGateWayRoute('', '', 'PATCH');
            event.headers['x-api-key'] = 'passing-key';
            this.router = new Router({
                event,
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml',
                beforeAll: mockPermissions.checkPermissions
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should call onError callback if onError exist and error occurs', async () => {
            const event = await mockData.getApiGateWayRoute('', '', 'PATCH');
            const spyFn = sinon.fake();
            const error = new Error();

            this.router = new Router({
                event,
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml',
                beforeAll: () => {
                    throw error;
                },
                onError: spyFn
            });
            const response = await this.router.route();
            assert.deepEqual(spyFn.callCount, 1);
            assert.deepEqual(spyFn.getCall(0).args[2], error);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
        });

        it('should call onRunEndpoint callback if exist', async () => {
            const testHook = (endpoint, request, response) => {
                response.body = {hook: 'testCallback'};
                return response;
            };
            this.router = new Router({
                event: await mockData.getApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: 'test/apigateway/',
                schemaPath: 'test/openapi.yml',
                onRunEndpoint: testHook
            });
            const results = await this.router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"hook":"testCallback"}'
            });
        });
    });
});
