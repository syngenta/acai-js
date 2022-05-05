const {assert} = require('chai');
const mockData = require('../../../mocks/apigateway/mock-data');
const Endpoint = require('../../../../src/apigateway/endpoint');
const {Request, Response} = require('../../../../src').apigateway;

describe('Test Endpoint', () => {
    const module = require('../../../mocks/apigateway/mock-handler');
    describe('test basic endpoint settings', () => {
        const endpoint = new Endpoint(module, 'GET');
        it('endpoint: no http method', async () => {
            assert.equal(endpoint.httpMethod, 'get');
        });
    });
    describe('test basic endpoint properties', () => {
        const endpoint = new Endpoint(module, 'GET');
        it('endpoint: no before', async () => {
            assert.equal(endpoint.hasBefore, false);
        });
        it('endpoint: no hasAfter', async () => {
            assert.equal(endpoint.hasAfter, false);
        });
        it('endpoint: no dataClass', async () => {
            assert.equal(endpoint.hasDataClass, false);
            assert.deepEqual(endpoint.dataClass(), {});
        });
    });
    describe('test advance endpoint properties', () => {
        const endpoint = new Endpoint(module, 'PUT');
        it('endpoint: has before', async () => {
            assert.equal(endpoint.hasBefore, true);
        });
        it('endpoint: has hasAfter', async () => {
            assert.equal(endpoint.hasAfter, true);
        });
        it('endpoint: has dataClass', async () => {
            assert.equal(endpoint.hasDataClass, true);
        });
    });
    describe('test run advance properties', () => {
        const request = new Request(mockData.getData());
        const response = new Response();
        const endpoint = new Endpoint(module, 'PUT');
        it('endpoint ran before', async () => {
            assert.equal(endpoint.hasBefore, true);
            const result = await endpoint.before(request, response);
            assert.equal(result.before, true);
        });
        it('endpoint before can mutate request', async () => {
            const request = new Request(mockData.getData());
            await endpoint.before(request, response);
            assert.deepEqual(request.context, {before: true});
        });
        it('endpoint ran after', async () => {
            assert.equal(endpoint.hasAfter, true);
            const result = await endpoint.after(request, response);
            assert.equal(result.after, true);
        });
        it('endpoint after can mutate request', async () => {
            const request = new Request(mockData.getData());
            await endpoint.after(request, response);
            assert.deepEqual(request.context, {after: true});
        });
        it('endpoint has data class', async () => {
            assert.equal(endpoint.hasDataClass, true);
            const dataClass = await endpoint.dataClass(request);
            assert.equal(dataClass.exists, true);
        });

        it('endpoint has run correctly', async () => {
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
