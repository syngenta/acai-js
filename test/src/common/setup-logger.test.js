const {assert} = require('chai');
require('../../../src').logger.setup();

describe('Test SetUp Logger', () => {
    describe('test constructor', () => {
        it('logger: _startTime property', () => {
            assert.equal('_startTime' in global.logger, true);
        });
        it('logger: _methodMap property', () => {
            assert.equal('_methodMap' in global.logger, true);
        });
        it('logger: _logLevelMap property', () => {
            assert.equal('_logLevelMap' in global.logger, true);
        });
        it('logger: _logLevelMap property', () => {
            assert.equal('_logLevelMap' in global.logger, true);
        });
        it('logger: doesnt run twice', () => {
            require('../../../src').logger.setup();
            assert.equal('_logLevelMap' in global.logger, true);
        });
    });
});
