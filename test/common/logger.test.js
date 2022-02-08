const {assert} = require('chai');
const Logger = require('../../src/common/logger');

describe('Test Logger', () => {
    describe('test constructor', () => {
        it('logger: Console has Logger _startTime property', () => {
            const logger = new Logger();
            assert.equal(true, '_startTime' in logger);
        });
        it('logger: Console has Logger _methodMap property', () => {
            const logger = new Logger();
            assert.equal(true, '_methodMap' in logger);
        });
        it('logger: Console has Logger _logLevelMap property', () => {
            const logger = new Logger();
            assert.equal(true, '_logLevelMap' in logger);
        });
    });
    describe('test _calcTime', () => {
        it('logger: Console has number for calcTime', () => {
            const logger = new Logger();
            const results = logger._calcTime();
            assert.equal(true, !isNaN(results));
        });
    });
    describe('test _shouldLog', () => {
        it('logger: WARN should log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('WARN');
            assert.equal(true, result);
        });
        it('logger: ERROR should log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('ERROR');
            assert.equal(true, result);
        });
        it('logger: INFO should log', () => {
            const logger = new Logger();
            const result = logger._shouldLog('INFO');
            assert.equal(true, result);
        });
    });
    describe('test _getStackSafely', () => {
        it('logger: Stack should be gotten', () => {
            logger = new Logger();
            const {stack} = new Error();
            const result = logger._getStackSafely(stack.toString());
            assert.deepEqual(result, [
                'Context.<anonymous> (/Users/paul.cruse/Developer/syngenta/alc-node/test/common/logger.test.js:46:29)',
                'callFn (/Users/paul.cruse/Developer/syngenta/alc-node/node_modules/mocha/lib/runnable.js:358:21)',
                'Test.Runnable.run (/Users/paul.cruse/Developer/syngenta/alc-node/node_modules/mocha/lib/runnable.js:346:5)',
                'Runner.runTest (/Users/paul.cruse/Developer/syngenta/alc-node/node_modules/mocha/lib/runner.js:621:10)',
                '/Users/paul.cruse/Developer/syngenta/alc-node/node_modules/mocha/lib/runner.js:745:12',
                'next (/Users/paul.cruse/Developer/syngenta/alc-node/node_modules/mocha/lib/runner.js:538:14)',
                '/Users/paul.cruse/Developer/syngenta/alc-node/node_modules/mocha/lib/runner.js:548:7',
                'next (/Users/paul.cruse/Developer/syngenta/alc-node/node_modules/mocha/lib/runner.js:430:14)',
                'Immediate._onImmediate (/Users/paul.cruse/Developer/syngenta/alc-node/node_modules/mocha/lib/runner.js:516:5)',
                'processImmediate (internal/timers.js:461:21)'
            ]);
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
