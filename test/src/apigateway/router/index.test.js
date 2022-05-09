const {assert} = require('chai');
const sinon = require('sinon');
const {Router} = require('../../../../src').apigateway;
const mockData = require('../../../mocks/apigateway/mock-data');
const mockBeforeAll = require('../../../mocks/apigateway/mock-before-all');

describe('Test Router', () => {
    describe('test routing', () => {
        it('router: found app route', async () => {
            const router = new Router({
                event: mockData.getApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route();
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
            const router = new Router({
                event: mockData.getApiGateWayRoute(),
                basePath: 'unittest/v1',
                handlerPath: '/test/mocks/apigateway/mock-handlers',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route();
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
            const router = new Router({
                event: mockData.getApiGateWayRoute('-fail'),
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route();
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
            const router = new Router({
                event: mockData.getApiGateWayRoute('', 'GET'),
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 403,
                body: '{"errors":[{"key_path":"method","message":"method not allowed"}]}'
            });
        });
        it('router: failed same with same file & directory', async () => {
            const router = new Router({
                event: mockData.getApiGateWayCustomRoute('same-file-directory'),
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 500,
                body:
                    '{"errors":[{"key_path":"router-config","message":"file & directory share name in the same directory"}]}'
            });
        });
        it('router: falls back to index.js', async () => {
            const router = new Router({
                event: mockData.getApiGateWayCustomRoute('directory'),
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"directory":true}'
            });
        });
    });
    describe('test route basic validation', () => {
        it('router: ran route without the need of requirements export', async () => {
            const router = new Router({
                event: mockData.getApiGateWayRouteNoRequirements(),
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
    });
    describe('test route custom validation', () => {
        it('router: test beforeAll fails', async () => {
            const router = new Router({
                event: mockData.getApiGateWayRouteValidation('PATCH'),
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                beforeAll: mockBeforeAll.checkPermissions
            });
            const results = await router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body: '{"errors":[{"key_path":"headers","message":"in appropriate api-key"}]}'
            });
        });
        it('router: test beforeAll pass', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            event.headers['x-api-key'] = 'passing-key';
            const router = new Router({
                event,
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                beforeAll: mockBeforeAll.checkPermissions
            });
            const results = await router.route();
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
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            const spyFn = sinon.fake();
            const error = new Error();
            const router = new Router({
                event,
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                beforeAll: () => {
                    throw error;
                },
                onError: spyFn
            });
            const response = await router.route();
            assert.deepEqual(spyFn.callCount, 1);
            assert.deepEqual(spyFn.getCall(0).args[2], error);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
        });
    });
});
