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
        it('should catch unhandled property', async () => {
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
                }
            });
            const results = await router.route();
            assert.deepEqual(results, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 500,
                body: '{"errors":[{"key_path":"server","message":"internal server error"}]}'
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
        it('router: pass required query string requirements', async () => {
            const router = new Router({
                event: mockData.getApiGateWayRouteValidation('DELETE'),
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
        it('router: fails required query string requirements', async () => {
            const event = mockData.getApiGateWayRouteValidation('DELETE');
            delete event.queryStringParameters.test;
            const router = new Router({
                event,
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
                statusCode: 400,
                body: '{"errors":[{"key_path":"params","message":"Please provide test for params"}]}'
            });
        });
        it('router: passes available query string requirements', async () => {
            const event = mockData.getApiGateWayRouteValidation('GET');
            const router = new Router({
                event,
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
        it('router: fails available query string requirements', async () => {
            const event = mockData.getApiGateWayRouteValidation('GET');
            event.queryStringParameters.fail = 1;
            const router = new Router({
                event,
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
                statusCode: 400,
                body: '{"errors":[{"key_path":"params","message":"fail is not an available params"}]}'
            });
        });
        it('router: pass with endpoint before', async () => {
            const event = mockData.getApiGateWayRouteValidation('PUT');
            const router = new Router({
                event,
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
                body: '{"data_class":true}'
            });
        });
        it('router: fail with endpoint before', async () => {
            const event = mockData.getApiGateWayRouteValidation('PUT');
            event.headers.fail = 'fail';
            const router = new Router({
                event,
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
                statusCode: 400,
                body: '{"errors":[{"key_path":"header","message":"before failed"}]}'
            });
        });
        it('router: pass response body valid', async () => {
            const event = mockData.getApiGateWayRouteValidation('LINK');
            const router = new Router({
                event,
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
                body: '{"id":"true"}'
            });
        });
        it('router: pass response body invalid', async () => {
            const event = mockData.getApiGateWayRouteValidation('UNLINK');
            const router = new Router({
                event,
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
                statusCode: 'rawBody',
                body: `{"errors":[{"key_path":"root","message":"must have required property 'id'"},{"key_path":"root","message":"must NOT have additional properties"}]}`
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
        it('router: test afterAll is called', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            const spyFn = sinon.fake();
            const router = new Router({
                event,
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                afterAll: spyFn
            });
            const response = await router.route();
            assert.deepEqual(spyFn.callCount, 1);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
        });
        it('should call withAuth when provided', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            const spyFn = sinon.fake();
            const router = new Router({
                event,
                basePath: 'unittest/v1',
                handlerPath: 'test/mocks/apigateway/mock-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                withAuth: spyFn
            });
            const response = await router.route();
            assert.deepEqual(spyFn.callCount, 1);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
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
