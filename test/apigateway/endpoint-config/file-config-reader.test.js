const path = require('path');
const FileConfigReader = require('../../../src').apigateway.FileConfigReader;
const { assert } = require('chai');

describe('FileConfigReader', () => {
    it('should read config file from folder without index.js', () => {
        const modulePath = 'test/apigateway/endpoint-config/mocks/random-dir-name';
        const module = require('./mocks/random-dir-name');
        const fileConfigReader = new FileConfigReader({modulePath});
        assert.deepEqual(fileConfigReader.read(), module);
    });

    it('should read config file from folder with index.js', () => {
        const modulePath = 'test/apigateway/endpoint-config/mocks/random-dir-name/index.js';
        const module = require('./mocks/random-dir-name');
        const fileConfigReader = new FileConfigReader({modulePath});
        assert.equal(fileConfigReader.read(), module.get);
    });

    it('should fail if path not found', () => {
        const modulePath = path.join('random', 'module', 'name')
        assert.throws(() => new FileConfigReader({modulePath}), 'can\'t resolve module random/module/name');
    });
});
