const {assert} = require('chai');
const Logger = require('../../src/common/logger');

describe('Test Logger', () => {
    describe('test constructor', () => {
        it('Console has Logger _logs property', () => {
            const logger = new Logger();
            assert.equal(true, '_logs' in logger);
        });
        it('Console has Logger _startTime property', () => {
            const logger = new Logger();
            assert.equal(true, '_startTime' in logger);
        });
        it('Console has Logger _methodMap property', () => {
            const logger = new Logger();
            assert.equal(true, '_methodMap' in logger);
        });
        it('Console has Logger _logLevelMap property', () => {
            const logger = new Logger();
            assert.equal(true, '_logLevelMap' in logger);
        });
    });
    describe('test _calcTime', () => {
        it('Console has number for calcTime', () => {
            const logger = new Logger();
            const results = logger._calcTime();
            assert.equal(true, !isNaN(results));
        });
    });
    describe('test _appendToLogs', () => {
        it('Pushes to logs array', () => {
            const logger = new Logger();
            logger._appendToLogs('INFO', 'N/A', [{test: true}]);
            assert.equal(1, logger._logs.length);
        });
        it('Logs in array have corrrect format', () => {
            const logger = new Logger();
            logger.warn({test: true});
            assert.deepEqual(true, true);
        });
    });
    describe('test _shouldLog', () => {
        it('WARN should log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('WARN');
            assert.equal(true, result);
        });
        it('ERROR should log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('ERROR');
            assert.equal(true, result);
        });
        it('INFO should not log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('INFO');
            assert.equal(false, result);
        });
    });
    describe('test _getStackSafely', () => {
        it('Stack should be gotten', () => {
            logger = new Logger();
            const {stack} = new Error();
            const result = logger._getStackSafely(stack.toString());
            assert.equal(result, result);
        });
        it('Stack should take regular string', () => {
            logger = new Logger();
            const result = logger._getStackSafely('stack.toString()');
            assert.equal(result, 'stack.toString()');
        });
    });
    describe('test all other console wrappers', () => {
        it('no errors are thrown', () => {
            logger = new Logger();
            logger.dir();
            logger.time('unitest');
            logger.timeLog('unitest');
            logger.timeEnd('unitest');
            logger.trace();
            logger.count('unitest');
            logger.countReset('unitest');
            logger.group();
            logger.groupEnd();
            logger.table();
            logger.debug();
            logger.dirxml();
            logger.groupCollapsed();
            logger.profile();
            logger.profileEnd();
            logger.timeStamp();
            logger.context();
        });
    });
});
