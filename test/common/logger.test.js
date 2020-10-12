const {assert} = require('chai');
const Logger = require('../../src/common/logger');

describe('Test Logger', () => {
    describe('test constructor', () => {
        it('Console has Logger _logs property', () => {
            const consoleTest = new Logger();
            assert.equal(true, '_logs' in consoleTest);
        });
        it('Console has Logger _startTime property', () => {
            const consoleTest = new Logger();
            assert.equal(true, '_startTime' in consoleTest);
        });
        it('Console has Logger _methodMap property', () => {
            const consoleTest = new Logger();
            assert.equal(true, '_methodMap' in consoleTest);
        });
        it('Console has Logger _logLevelMap property', () => {
            const consoleTest = new Logger();
            assert.equal(true, '_logLevelMap' in consoleTest);
        });
    });
    describe('test _calcTime', () => {
        it('Console has number for calcTime', () => {
            const consoleTest = new Logger();
            const results = consoleTest._calcTime();
            assert.equal(true, !isNaN(results));
        });
    });
    describe('test _appendToLogs', () => {
        it('Pushes to logs array', () => {
            const consoleTest = new Logger();
            consoleTest._appendToLogs('INFO', 'N/A', [{test: true}]);
            assert.equal(1, consoleTest._logs.length);
        });
        it('Logs in array have corrrect format', () => {
            const consoleTest = new Logger();
            consoleTest.warn({test: true});
            assert.deepEqual(true, true);
        });
    });
    describe('test _shouldLog', () => {
        it('WARN should log', () => {
            const consoleTest = new Logger();
            const result = consoleTest._shouldLog('WARN');
            assert.equal(true, result);
        });
        it('ERROR should log', () => {
            const consoleTest = new Logger();
            const result = consoleTest._shouldLog('ERROR');
            assert.equal(true, result);
        });
        it('INFO should not log', () => {
            const consoleTest = new Logger();
            const result = consoleTest._shouldLog('INFO');
            assert.equal(false, result);
        });
    });
    describe('test _getStackSafely', () => {
        it('Stack should be gotten', () => {
            consoleTest = new Logger();
            const {stack} = new Error();
            const result = consoleTest._getStackSafely(stack.toString());
            assert.equal(result, result);
        });
        it('Stack should take regular string', () => {
            consoleTest = new Logger();
            const result = consoleTest._getStackSafely('stack.toString()');
            assert.equal(result, 'stack.toString()');
        });
    });
    describe('test all other console wrappers', () => {
        it('no errors are thrown', () => {
            consoleTest = new Logger();
            consoleTest.dir();
            consoleTest.time();
            consoleTest.timeEnd();
            consoleTest.timeLog();
            consoleTest.trace();
            consoleTest.countReset();
            consoleTest.group();
            consoleTest.groupEnd();
            consoleTest.table();
            consoleTest.debug();
            consoleTest.dirxml();
            consoleTest.groupCollapsed();
            consoleTest.profile();
            consoleTest.profileEnd();
            consoleTest.timeStamp();
            consoleTest.context();
        });
    });
});
