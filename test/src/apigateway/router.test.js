const {assert} = require('chai');
const sinon = require('sinon');
const {Router} = require('../../../src').apigateway;
const mockData = require('../../mocks/apigateway/mock-data');
const mockBeforeAll = require('../../mocks/apigateway/mock-before-all');

describe('Test Router: src/apigateway/router.js', () => {
    describe('test routing', () => {
        it('should find route', async () => {
            const event = mockData.getApiGateWayRoute();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should find route with autoload', async () => {
            const event = mockData.getApiGateWayRoute();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            router.autoLoad();
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should find route in pattern mode', async () => {
            const event = mockData.getApiGateWayRoute('', 'get');
            const router = new Router({
                routingMode: 'pattern',
                basePath: 'unit-test/v1',
                handlerPattern: 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should find route in pattern mode with autoload', async () => {
            const event = mockData.getApiGateWayRoute('', 'get');
            const router = new Router({
                routingMode: 'pattern',
                basePath: 'unit-test/v1',
                handlerPattern: 'test/mocks/apigateway/mock-pattern-handlers/suffix/**/*.controller.js',
                schemaPath: 'test/mocks/openapi.yml'
            });
            router.autoLoad();
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should find route in list mode', async () => {
            const handlerList = {
                'POST::basic': 'test/mocks/apigateway/mock-list-handlers/basic.js'
            };
            const event = mockData.getApiGateWayRoute();
            const router = new Router({
                routingMode: 'list',
                basePath: 'unit-test/v1',
                handlerList: handlerList,
                schemaPath: 'test/mocks/openapi.yml'
            });
            router.autoLoad();
            const result = await router.route(event);
            assert.deepEqual(result, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should find route in list mode', async () => {
            const handlerList = {
                'POST::basic': 'test/mocks/apigateway/mock-list-handlers/basic.js'
            };
            const event = mockData.getApiGateWayRoute();
            const router = new Router({
                routingMode: 'list',
                basePath: 'unit-test/v1',
                handlerList: handlerList,
                schemaPath: 'test/mocks/openapi.yml'
            });
            const result = await router.route(event);
            assert.deepEqual(result, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should find route wiht no trailing /', async () => {
            const event = mockData.getApiGateWayRoute();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: '/test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should not find route', async () => {
            const event = mockData.getApiGateWayRoute('-fail');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 404,
                body: '{"errors":[{"key_path":"url","message":"endpoint not found"}]}'
            });
        });
        it('should not allow method', async () => {
            const event = mockData.getApiGateWayRoute('', 'PATCH');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 403,
                body: '{"errors":[{"key_path":"method","message":"method not allowed"}]}'
            });
        });
        it('should catch unhandled property', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            const error = new Error();
            const router = new Router({
                event,
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                beforeAll: () => {
                    throw error;
                }
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 500,
                body: '{"errors":[{"key_path":"server","message":"internal server error"}]}'
            });
        });
        it('should add logger to global scope', async () => {
            delete global.logger;
            new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                globalLogger: true
            });
            assert.equal('logger' in global, true);
            delete global.logger;
        });
        it('should not add logger to global scope', async () => {
            delete global.logger;
            new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                globalLogger: false
            });
            assert.equal('logger' in global, false);
        });
    });
    describe('test route basic validation', () => {
        it('should run route without the need of requirements export', async () => {
            const event = mockData.getApiGateWayRouteNoRequirements();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should pass required query string requirements', async () => {
            const event = mockData.getApiGateWayRouteValidation('DELETE');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should fail required query string requirements', async () => {
            const event = mockData.getApiGateWayRouteValidation('DELETE');
            delete event.queryStringParameters.test;
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body: '{"errors":[{"key_path":"queryParams","message":"Please provide test for queryParams"}]}'
            });
        });
        it('should pass available query string requirements', async () => {
            const event = mockData.getApiGateWayRouteValidation('GET');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should fail available query string requirements', async () => {
            const event = mockData.getApiGateWayRouteValidation('GET');
            event.queryStringParameters.fail = 1;
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body: '{"errors":[{"key_path":"queryParams","message":"fail is not an available queryParams"}]}'
            });
        });
        it('should pass with endpoint before', async () => {
            const event = mockData.getApiGateWayRouteValidation('PUT');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"data_class":true}'
            });
        });
        it('should fail with endpoint before', async () => {
            const event = mockData.getApiGateWayRouteValidation('PUT');
            event.headers.fail = 'fail';
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body: '{"errors":[{"key_path":"header","message":"before failed"}]}'
            });
        });
    });
    describe('test route custom validation', () => {
        it('should return errors when beforeAll fails', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                beforeAll: mockBeforeAll.checkPermissions
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 400,
                body: '{"errors":[{"key_path":"headers","message":"in appropriate api-key"}]}'
            });
        });
        it('should pass when beforeAll pass', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            event.headers['x-api-key'] = 'passing-key';
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                beforeAll: mockBeforeAll.checkPermissions
            });
            const results = await router.route(event);
            assert.deepEqual(results, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"test":true}'
            });
        });
        it('should call afterAll when provided', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            const spyFn = sinon.fake();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                afterAll: spyFn
            });
            const response = await router.route(event);
            assert.deepEqual(spyFn.callCount, 1);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
        });
        it('should call withAuth when provided', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            const spyFn = sinon.fake();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                withAuth: spyFn
            });
            const response = await router.route(event);
            assert.deepEqual(spyFn.callCount, 1);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
        });
        it('should call onError callback if onError exist and error occurs', async () => {
            const event = mockData.getApiGateWayRouteValidation('PATCH');
            const spyFn = sinon.fake();
            const error = new Error();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                beforeAll: () => {
                    throw error;
                },
                onError: spyFn
            });
            const response = await router.route(event);
            assert.deepEqual(spyFn.callCount, 1);
            assert.deepEqual(spyFn.getCall(0).args[2], error);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
        });
    });
    describe('test auto validate', () => {
        it('should auto validate and pass validation', async () => {
            const event = mockData.getApiGateWayCustomRouteWithParams('auto', 'post');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                autoValidate: true,
                strictValidation: true
            });
            const response = await router.route(event);
            assert.deepEqual(response, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"post":true}'
            });
        });
        it('should not find endpoint', async () => {
            const event = mockData.getApiGateWayCustomRouteWithParams('auto-not-found', 'patch');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                autoValidate: true,
                strictValidation: true
            });
            const response = await router.route(event);
            assert.equal(response.statusCode, 404);
        });
        it('should not allow method', async () => {
            const event = mockData.getApiGateWayCustomRouteWithParams('auto', 'patch');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                autoValidate: true,
                strictValidation: true
            });
            const response = await router.route(event);
            assert.equal(response.statusCode, 403);
        });
        it('should auto validate and pass validation with path param', async () => {
            const event = mockData.getApiGateWayCustomRouteWithParams('auto/1', 'put');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                autoValidate: true,
                strictValidation: true
            });
            const response = await router.route(event);
            assert.deepEqual(response, {
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"put":true}'
            });
        });
        it('should not find endpoint with path param', async () => {
            const event = mockData.getApiGateWayCustomRouteWithParams('auto/1', 'patch');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                autoValidate: true,
                strictValidation: true
            });
            const response = await router.route(event);
            assert.equal(response.statusCode, 404);
        });
        it('should find route but error on validation', async () => {
            const event = mockData.getApiGateWayCustomRouteWithParams('auto/1', 'delete');
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                autoValidate: true,
                strictValidation: true
            });
            const response = await router.route(event);
            assert.equal(response.statusCode, 400);
        });
    });
    describe('test configuration error handling', () => {
        it('should throw error for improper routingMode configuration', () => {
            try {
                new Router({
                    routingMode: 'fail',
                    basePath: 'unit-test/v1',
                    handlerPath: 'test/mocks/apigateway/mock-directory-handlers/'
                });
            } catch (error) {
                assert.equal(error.message, 'routingMode must be either directory, pattern or list');
            }
        });
        it('should throw error for improper directory configuration missing handlerPath', () => {
            try {
                new Router({
                    routingMode: 'directory',
                    basePath: 'unit-test/v1'
                });
            } catch (error) {
                assert.equal(error.message, 'handlerPath config is requied when routingMode is directory');
            }
        });
        it('should throw error for improper pattern configuration missing handlerPattern', () => {
            try {
                new Router({
                    routingMode: 'pattern',
                    basePath: 'unit-test/v1'
                });
            } catch (error) {
                assert.equal(error.message, 'handlerPattern config is requied when routingMode is pattern');
            }
        });
        it('should throw error for improper list configuration missing handlerList', () => {
            try {
                new Router({
                    routingMode: 'list',
                    basePath: 'unit-test/v1'
                });
            } catch (error) {
                assert.equal(error.message, 'handlerList config is requied when routingMode is list');
            }
        });
        it('should raise an error when resolver cacheSize is incorrect', () => {
            try {
                new Router({
                    routingMode: 'directory',
                    basePath: 'unit-test/v1',
                    cacheSize: 'must-be-string',
                    handlerPath: 'test/mocks/apigateway/mock-directory-handlers/'
                });
            } catch (error) {
                assert.equal(error.message, 'cacheSize must be an integer');
            }
        });
        it('should raise an error when resolver cacheMode is incorrect', () => {
            try {
                new Router({
                    routingMode: 'directory',
                    basePath: 'unit-test/v1',
                    cacheMode: 'must-be-one-of-all-dynamic-static',
                    handlerPath: 'test/mocks/apigateway/mock-directory-handlers/'
                });
            } catch (error) {
                assert.equal(error.message, 'cacheMode must be either: all, dynamic, static');
            }
        });
        it('should throw an error about multiple dynamic files in one directory', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-bad-multi-dynamic'
            });
            const event = mockData.getApiGateWayRoute();
            const response = await router.route(event);
            const expected = {
                errors: [
                    {
                        key_path: 'request-path',
                        message:
                            'request path conflict; found two dynamic files/directories in the same directory. files: {param}.js,{param}, location: {param}'
                    }
                ]
            };
            assert.equal(response.statusCode, 409);
            assert.deepEqual(JSON.parse(response.body), expected);
        });
        it('should throw an error about directory and files sharing the same name', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-bad-same-file-dir'
            });
            const event = mockData.getApiGateWayRoute();
            const response = await router.route(event);
            const expected = {
                errors: [
                    {
                        key_path: 'request-path',
                        message:
                            'request path conflict; found file & directory with same name. files: same-file-directory, location: same-file-directory'
                    }
                ]
            };
            assert.equal(response.statusCode, 409);
            assert.deepEqual(JSON.parse(response.body), expected);
        });
        it('should handle unknown error, but replace error message with default', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers'
            });
            const event = mockData.getBadImportData();
            const response = await router.route(event);
            const expected = {errors: [{key_path: 'server', message: 'internal server error'}]};
            assert.equal(response.statusCode, 500);
            assert.deepEqual(JSON.parse(response.body), expected);
        });
        it('should handle unknown error and show exact error message', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                outputError: true
            });
            const event = mockData.getBadImportData();
            const response = await router.route(event);
            assert.equal(response.statusCode, 500);
            assert.isTrue(JSON.parse(response.body).errors[0].message.includes('Cannot find module'));
        });
        it('should find file but throw an error because file has a problem and replace error message with default', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers'
            });
            const event = mockData.getApiGateWayRouteBadImport();
            const response = await router.route(event);
            const expected = {errors: [{key_path: 'server', message: 'internal server error'}]};
            assert.equal(response.statusCode, 500);
            assert.deepEqual(JSON.parse(response.body), expected);
        });
    });
    describe('test response validation', () => {
        it('should validate the response succesfully with responseBody defined in requirements', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                validateResponse: true
            });
            const expected = {test: true};
            const event = mockData.getApiGateWayRoute();
            const response = await router.route(event);
            assert.equal(response.statusCode, 200);
            assert.deepEqual(JSON.parse(response.body), expected);
        });
        it('should validate the response and fail with responseBody defined in requirements', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                validateResponse: true
            });
            const expected = {
                errors: [
                    {key_path: '.test', message: 'must be boolean'},
                    {key_path: '.nested.unit', message: 'must be boolean'}
                ]
            };
            const event = mockData.getApiGateWayRoute('', 'PUT');
            const response = await router.route(event);
            assert.equal(response.statusCode, 422);
            assert.deepEqual(JSON.parse(response.body), expected);
        });
        it('should validate the response succesfully with responseBody defined in openAPI', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                autoValidate: true,
                validateResponse: true
            });
            const event = mockData.getApiGateWayRouteWithProperData();
            const response = await router.route(event);
            const expected = {test: true};
            assert.equal(response.statusCode, 200);
            assert.deepEqual(JSON.parse(response.body), expected);
        });
        it('should validate the response and fail with responseBody defined in openAPI', async () => {
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                autoValidate: true,
                validateResponse: true
            });
            const expected = {
                errors: [
                    {key_path: '.test', message: 'must be boolean'},
                    {key_path: '.nested.unit', message: 'must be boolean'}
                ]
            };
            const event = mockData.getApiGateWayRouteWithProperData('PUT');
            const response = await router.route(event);
            assert.equal(response.statusCode, 422);
            assert.deepEqual(JSON.parse(response.body), expected);
        });
    });
    describe('test timeout feature', () => {
        it('should timeout', async function () {
            this.timeout(0);
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                timeout: 500
            });
            const event = mockData.getApiGateWayRouteForTimeout();
            const response = await router.route(event);
            assert.equal(response.statusCode, 408);
            assert.deepEqual(JSON.parse(response.body), {errors: [{key_path: 'unknown', message: 'request timeout'}]});
        });
        it('should timeout from endpoint with lower timeout than global', async function () {
            this.timeout(0);
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                timeout: 5000
            });
            const event = mockData.getApiGateWayRouteForTimeout('post');
            const response = await router.route(event);
            assert.equal(response.statusCode, 408);
            assert.deepEqual(JSON.parse(response.body), {errors: [{key_path: 'unknown', message: 'request timeout'}]});
        });
        it('should call timeout function on globally set timeout', async () => {
            const event = mockData.getApiGateWayRouteForTimeout();
            const spyFn = sinon.fake();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                timeout: 500,
                onTimeout: spyFn
            });
            const response = await router.route(event);
            assert.deepEqual(spyFn.callCount, 1);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
        });
        it('should call timeout function on endpoint set timeout', async () => {
            const event = mockData.getApiGateWayRouteForTimeout('post');
            const spyFn = sinon.fake();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers/',
                schemaPath: 'test/mocks/openapi.yml',
                timeout: 5000,
                onTimeout: spyFn
            });
            const response = await router.route(event);
            assert.deepEqual(spyFn.callCount, 1);
            assert.equal(spyFn.getCall(0).args[1].code, response.statusCode);
        });
        it('should not timeout', async function () {
            this.timeout(0);
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                timeout: 3000
            });
            const event = mockData.getApiGateWayRouteForTimeout('delete');
            const response = await router.route(event);
            assert.equal(200, response.statusCode);
            assert.deepEqual({timeout: false}, JSON.parse(response.body));
        });
        it('should not timeout from endpoint with higher timeout than global', async function () {
            this.timeout(0);
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                timeout: 3000
            });
            const event = mockData.getApiGateWayRouteForTimeout('put');
            const response = await router.route(event);
            assert.equal(200, response.statusCode);
            assert.deepEqual({timeout: false}, JSON.parse(response.body));
        });
        it('should not call timeout function', async function () {
            this.timeout(0);
            const spyFn = sinon.fake();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                timeout: 3000,
                onTimeout: spyFn
            });
            const event = mockData.getApiGateWayRouteForTimeout('delete');
            await router.route(event);
            assert.deepEqual(spyFn.callCount, 0);
        });
        it('should not call timeout function from endpoint with higher timeout than global', async function () {
            this.timeout(0);
            const spyFn = sinon.fake();
            const router = new Router({
                routingMode: 'directory',
                basePath: 'unit-test/v1',
                handlerPath: 'test/mocks/apigateway/mock-directory-handlers',
                schemaPath: 'test/mocks/openapi.yml',
                timeout: 3000,
                onTimeout: spyFn
            });
            const event = mockData.getApiGateWayRouteForTimeout('put');
            await router.route(event);
            assert.deepEqual(spyFn.callCount, 0);
        });
    });
});
