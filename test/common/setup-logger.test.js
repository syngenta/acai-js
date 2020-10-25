const {assert} = require('chai');
require('../../src').logger.setup();

describe('Test SetUp Logger', () => {
    describe('test constructor', () => {
        it('Global Logger _startTime property', () => {
            assert.equal(true, '_startTime' in global.logger);
        });
        it('Global Logger _methodMap property', () => {
            assert.equal(true, '_methodMap' in global.logger);
        });
        it('Global Logger _logLevelMap property', () => {
            assert.equal(true, '_logLevelMap' in global.logger);
        });
        it('Global Logger _logLevelMap property', () => {
            assert.equal(true, '_logLevelMap' in global.logger);
        });
        it('Global Logger doesnt run twice', () => {
            require('../../src').logger.setup();
            assert.equal(true, '_logLevelMap' in global.logger);
        });
    });
});
