const {assert} = require('chai');
const Logger = require('../../../src/common/logger');

describe('Test Logger', () => {
    describe('test _calcTime', () => {
        it('logger: Console has number for calcTime', () => {
            const logger = new Logger();
            const results = logger._calcTime();
            assert.equal(!isNaN(results), true);
        });
    });
    describe('test _shouldLog', () => {
        it('logger: WARN should log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('WARN');
            assert.equal(result, true);
        });
        it('logger: ERROR should log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('ERROR');
            assert.equal(result, true);
        });
        it('logger: INFO should log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('INFO');
            assert.equal(result, true);
        });
    });
    describe('test _getStackSafely', () => {
        it('logger: Stack should be gotten', () => {
            logger = new Logger();
            const {stack} = new Error();
            const result = logger._getStackSafely(stack.toString());
            assert.equal(result.length, 10);
        });
        it('logger: Stack should take regular string', () => {
            logger = new Logger();
            const result = logger._getStackSafely('stack.toString()');
            assert.equal(result, 'stack.toString()');
        });
    });
    describe('test all other console wrappers', () => {
        it('logger: no errors are thrown', () => {
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
            assert.equal(true, true);
        });
    });
});
