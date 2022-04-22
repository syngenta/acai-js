const path = require('path');
const FileConfigReader = require('../../../src').apigateway.FileConfigReader;
const { assert } = require('chai');

const requirer = (modulePath) => require(path.join(path.dirname(__filename), 'mocks',  modulePath));
requirer.resolve = (modulePath) => require.resolve(path.join(path.dirname(__filename), 'mocks', modulePath))


describe('FileConfigReader', () => {
    it('should read config file from folder without index.js', () => {
        const modulePath = 'random-dir-name';
        const module = require('./mocks/random-dir-name');
        const fileConfigReader = new FileConfigReader({modulePath, requirer});
        assert.deepEqual(fileConfigReader.read(), module);
    });

    it('should read config file from folder with index.js', () => {
        const modulePath = path.join('random-dir-name', 'index.js');
        const module = require('./mocks/random-dir-name');
        const fileConfigReader = new FileConfigReader({modulePath, requirer});
        assert.deepEqual(fileConfigReader.read(), module);
    });

    it('should fail if path not found', () => {
        const modulePath = path.join('random', 'module', 'name')
        assert.throws(() => new FileConfigReader({modulePath, requirer}), 'can\'t resolve module random/module/name');
    });
});
