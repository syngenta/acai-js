const {assert} = require('chai');
require('../../src').logger.setup();

describe('Test SetUp Logger', () => {
    describe('test constructor', () => {
        it('Console has Logger _logs property', () => {
            assert.equal(true, '_logs' in global.logger);
        });
        it('Console has Logger _startTime property', () => {
            assert.equal(true, '_startTime' in global.logger);
        });
        it('Console has Logger _methodMap property', () => {
            assert.equal(true, '_methodMap' in global.logger);
        });
        it('Console has Logger _logLevelMap property', () => {
            assert.equal(true, '_logLevelMap' in global.logger);
        });
    });
});
