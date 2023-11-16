const {assert} = require('chai');
const ResolverCache = require('../../../../src/apigateway/resolver/cache');

describe('Test Cache: src/apigateway/resolver/cache.js', () => {
    describe('test simple cache operations', () => {
        const cacher = new ResolverCache();
        it('should cache the module sent', () => {
            const mockModule = {module: true};
            const dynamic = false;
            const routePath = '/unit-test/v1/cache-test';
            cacher.put(routePath, mockModule, dynamic);
            const results = cacher.get(routePath);
            assert.deepEqual(results.endpointModule, mockModule);
            assert.isFalse(results.isDynamic);
        });
        it('should delete the module sent', () => {
            const mockModule = {module: true};
            const dynamic = false;
            const routePath = '/unit-test/v1/cache-delete-test';
            cacher.put(routePath, mockModule, dynamic);
            cacher.delete(routePath);
            const result = cacher.get(routePath);
            assert.equal(result, null);
        });
        it('should clear all modules sent', () => {
            const cacher = new ResolverCache();
            const mockModule = {module: true};
            const dynamic = false;
            const routePath1 = '/unit-test/v1/cache-clear1-test';
            const routePath2 = '/unit-test/v1/cache-clear2-test';
            const routePath3 = '/unit-test/v1/cache-clear3-test';
            cacher.put(routePath1, mockModule, dynamic);
            cacher.put(routePath2, mockModule, dynamic);
            cacher.put(routePath3, mockModule, dynamic);
            cacher.clear();
            const result1 = cacher.get(routePath1);
            assert.equal(result1, null);
            const result2 = cacher.get(routePath2);
            assert.equal(result2, null);
            const result3 = cacher.get(routePath3);
            assert.equal(result3, null);
        });
    });
    describe('test conditional max size', () => {
        it('should cache nothing', () => {
            const cacher = new ResolverCache(0);
            const mockModule = {module: true};
            const dynamic = false;
            const routePath = '/unit-test/v1/cache-nothing-test';
            cacher.put(routePath, mockModule, dynamic);
            const result = cacher.get(routePath);
            assert.equal(result, null);
        });
        it('should only cache last 2 routes', () => {
            const cacher = new ResolverCache(2);
            const mockModule = {module: true};
            const dynamic = false;
            const routePath1 = '/unit-test/v1/cache-max1-test';
            const routePath2 = '/unit-test/v1/cache-max2-test';
            const routePath3 = '/unit-test/v1/cache-max3-test';
            cacher.put(routePath1, mockModule, dynamic);
            cacher.put(routePath2, mockModule, dynamic);
            cacher.put(routePath3, mockModule, dynamic);
            const result1 = cacher.get(routePath1);
            assert.equal(result1, null);
            const result2 = cacher.get(routePath2);
            assert.deepEqual(result2.endpointModule, mockModule);
            const result3 = cacher.get(routePath3);
            assert.deepEqual(result3.endpointModule, mockModule);
        });
    });
    describe('test conditional modes', () => {
        it('should cache only static routes', () => {
            const cacher = new ResolverCache(128, 'static');
            const mockModule1 = {module: true};
            const dynamic1 = false;
            const routePath1 = '/unit-test/v1/cache-static-test';
            cacher.put(routePath1, mockModule1, dynamic1);
            const result1 = cacher.get(routePath1);
            assert.deepEqual(result1.endpointModule, mockModule1);
            const mockModule2 = {module: true};
            const dynamic2 = true;
            const routePath2 = '/unit-test/v1/cache-dynamic-test';
            cacher.put(routePath2, mockModule2, dynamic2);
            const result2 = cacher.get(routePath2);
            assert.equal(result2, null);
        });
        it('should cache only dynamic routes', () => {
            const cacher = new ResolverCache(128, 'dynamic');
            const mockModule1 = {module: true};
            const dynamic1 = true;
            const routePath1 = '/unit-test/v1/cache-dynamic-test';
            cacher.put(routePath1, mockModule1, dynamic1);
            const result1 = cacher.get(routePath1);
            assert.deepEqual(result1.endpointModule, mockModule1);
            const mockModule2 = {module: true};
            const dynamic2 = false;
            const routePath2 = '/unit-test/v1/cache-staic-test';
            cacher.put(routePath2, mockModule2, dynamic2);
            const result2 = cacher.get(routePath2);
            assert.equal(result2, null);
        });
    });
});
