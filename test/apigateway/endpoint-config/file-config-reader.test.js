const path = require('path');
const FileConfigReader = require('../../../src').apigateway.FileConfigReader;
const { assert } = require('chai');
const randomModule = require('./mocks/random-dir-name');

describe('FileConfigReader', () => {
    it('should read config file from folder without index.js', () => {
        const modulePath = 'test/apigateway/endpoint-config/mocks/random-dir-name';
        const fileConfigReader = new FileConfigReader({modulePath});
        assert.deepEqual(fileConfigReader.read(), randomModule);
    });

    it('should read config file from folder with index.js', () => {
        const modulePath = 'test/apigateway/endpoint-config/mocks/random-dir-name/index.js';
        const fileConfigReader = new FileConfigReader({modulePath});
        assert.equal(fileConfigReader.read(), randomModule);
    });

    it('should fail if path not found', () => {
        const modulePath = path.join('random', 'module', 'name')
        assert.throws(() => new FileConfigReader({modulePath}), 'can\'t resolve module random/module/name');
    });
});
