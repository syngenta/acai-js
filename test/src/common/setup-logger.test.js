const {assert} = require('chai');
require('../../../src').logger.setup();

describe('Test SetUp Logger', () => {
    describe('test constructor', () => {
        it('logger: _startTime property', () => {
            assert.equal(true, '_startTime' in global.logger);
        });
        it('logger: _methodMap property', () => {
            assert.equal(true, '_methodMap' in global.logger);
        });
        it('logger: _logLevelMap property', () => {
            assert.equal(true, '_logLevelMap' in global.logger);
        });
        it('logger: _logLevelMap property', () => {
            assert.equal(true, '_logLevelMap' in global.logger);
        });
        it('logger: doesnt run twice', () => {
            require('../../../src').logger.setup();
            assert.equal(true, '_logLevelMap' in global.logger);
        });
    });
});
