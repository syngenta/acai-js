const {assert} = require('chai');
const mockData = require('../../../mocks/apigateway/mock-data');
const Endpoint = require('../../../../src/apigateway/endpoint');
const {Request, Response} = require('../../../../src').apigateway;

describe('Test Endpoint', () => {
    const module = require('../../../mocks/apigateway/mock-directory-handlers/with-requirements');
    describe('test basic endpoint settings', () => {
        const endpoint = new Endpoint(module, 'GET');
        it('should have an endpoint with correct http method', async () => {
            assert.equal(endpoint.httpMethod, 'get');
        });
    });
    describe('test basic endpoint properties', () => {
        const endpoint = new Endpoint(module, 'GET');
        it('should not have a before', async () => {
            assert.equal(endpoint.hasBefore, false);
        });
        it('should not have an after', async () => {
            assert.equal(endpoint.hasAfter, false);
        });
        it('sholud not have a data class', async () => {
            assert.equal(endpoint.hasDataClass, false);
            assert.deepEqual(endpoint.dataClass(), {});
        });
    });
    describe('test advance endpoint properties', () => {
        const endpoint = new Endpoint(module, 'PUT');
        it('should have an before', async () => {
            assert.equal(endpoint.hasBefore, true);
        });
        it('should have an after', async () => {
            assert.equal(endpoint.hasAfter, true);
        });
        it('should have a data class', async () => {
            assert.equal(endpoint.hasDataClass, true);
        });
    });
    describe('test run advance properties', () => {
        const request = new Request(mockData.getData());
        const response = new Response();
        const endpoint = new Endpoint(module, 'PUT');
        it('should run before', async () => {
            assert.equal(endpoint.hasBefore, true);
            const result = await endpoint.before(request, response);
            assert.equal(result.before, true);
        });
        it('should run before and mutate request', async () => {
            const request = new Request(mockData.getData());
            await endpoint.before(request, response);
            assert.deepEqual(request.context, {before: true});
        });
        it('should run after', async () => {
            assert.equal(endpoint.hasAfter, true);
            const result = await endpoint.after(request, response);
            assert.equal(result.after, true);
        });
        it('should run after and mutate request', async () => {
            const request = new Request(mockData.getData());
            await endpoint.after(request, response);
            assert.deepEqual(request.context, {after: true});
        });
        it('should have a data class passed in method and returned custom body response', async () => {
            assert.equal(endpoint.hasDataClass, true);
            const dataClass = await endpoint.dataClass(request);
            assert.equal(dataClass.exists, true);
        });

        it('should have run correctly', async () => {
            await endpoint.run(request, response);
            assert.deepEqual(response.response, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                },
                statusCode: 200,
                body: '{"data_class":true}'
            });
        });
    });
});
