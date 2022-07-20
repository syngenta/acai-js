const {assert} = require('chai');
const Logger = require('../../../src/common/logger');
const sinon = require('sinon');

describe('Test Logger: src/common/logger.js', () => {
    describe('test global logger', () => {
        it('should assign logger to global scope', () => {
            Logger.setUpGlobal();
            assert.equal('logger' in global, true);
        });
        it('should should allow me to call logger from global scope', () => {
            Logger.setUpGlobal();
            global.logger.log('works');
            assert.equal(true, true);
        });
    });
    describe('test top level methods', () => {
        const logger = new Logger();
        it('should allow me to call log without error', () => {
            logger.log('works');
            assert.equal(true, true);
        });
        it('should allow me to call info without error', () => {
            logger.info('works');
            assert.equal(true, true);
        });
        it('should allow me to call warn without error', () => {
            logger.warn('works');
            assert.equal(true, true);
        });
        it('should allow me to call debug without error', () => {
            logger.debug('works');
            assert.equal(true, true);
        });
        it('should allow me to call error without error', () => {
            logger.error('works');
            assert.equal(true, true);
        });
    });
    describe('test logger.log ability to log anything', () => {
        before(() => {
            process.env['MIN_LOG_LEVEL'] = 'INFO';
        });
        it('should allow me to call log proper object', () => {
            const logger = new Logger();
            logger.log({level: 'INFO', log: 'works'});
            assert.equal(true, true);
        });
        it('should allow me to call log improper object', () => {
            const logger = new Logger();
            logger.log({level: 'INFO', broken: 'works'});
            assert.equal(true, true);
        });
        it('should allow me to call log string without error', () => {
            const logger = new Logger();
            logger.log('works');
            assert.equal(true, true);
        });
        it('should allow me to call log multiple strings without error', () => {
            const logger = new Logger();
            logger.log('works', 'as', 'it', 'should');
            assert.equal(true, true);
        });
        it('should allow me to call log number without error', () => {
            const logger = new Logger();
            logger.log(1);
            assert.equal(true, true);
        });
        it('should allow me to call log object without error', () => {
            const logger = new Logger();
            logger.log({key: 'value'});
            assert.equal(true, true);
        });
        it('should allow me to call log array without error', () => {
            const logger = new Logger();
            logger.log(['value']);
            assert.equal(true, true);
        });
        after(() => {
            process.env['MIN_LOG_LEVEL'] = 'OFF';
        });
    });
    describe('test logger to know when to log', () => {
        it('should log INFO with MIN_LOG_LEVEL set to INFO', () => {
            process.env['MIN_LOG_LEVEL'] = 'INFO';
            const logger = new Logger();
            assert.equal(logger.__shouldLog('INFO'), true);
            process.env['MIN_LOG_LEVEL'] = 'OFF';
        });
        it('should log DEBUG with MIN_LOG_LEVEL set to INFO', () => {
            process.env['MIN_LOG_LEVEL'] = 'INFO';
            const logger = new Logger();
            assert.equal(logger.__shouldLog('DEBUG'), true);
            process.env['MIN_LOG_LEVEL'] = 'OFF';
        });
        it('should log WARN with MIN_LOG_LEVEL set to INFO', () => {
            process.env['MIN_LOG_LEVEL'] = 'INFO';
            const logger = new Logger();
            assert.equal(logger.__shouldLog('WARN'), true);
            process.env['MIN_LOG_LEVEL'] = 'OFF';
        });
        it('should log WARN with MIN_LOG_LEVEL set to INFO', () => {
            process.env['MIN_LOG_LEVEL'] = 'INFO';
            const logger = new Logger();
            assert.equal(logger.__shouldLog('ERROR'), true);
            process.env['MIN_LOG_LEVEL'] = 'OFF';
        });
        it('should log ERROR with MIN_LOG_LEVEL set to ERROR', () => {
            process.env['MIN_LOG_LEVEL'] = 'ERROR';
            const logger = new Logger();
            assert.equal(logger.__shouldLog('ERROR'), true);
            process.env['MIN_LOG_LEVEL'] = 'OFF';
        });
        it('should not log INFO with MIN_LOG_LEVEL set to ERROR', () => {
            process.env['MIN_LOG_LEVEL'] = 'ERROR';
            const logger = new Logger();
            assert.equal(logger.__shouldLog('INFO'), false);
            process.env['MIN_LOG_LEVEL'] = 'OFF';
        });
        it('should not log WARN with MIN_LOG_LEVEL set to ERROR', () => {
            process.env['MIN_LOG_LEVEL'] = 'ERROR';
            const logger = new Logger();
            assert.equal(logger.__shouldLog('WARN'), false);
            process.env['MIN_LOG_LEVEL'] = 'OFF';
        });
    });
    describe('test callback', () => {
        it('should invoke callback', () => {
            const spyFn = sinon.fake();
            const logger = new Logger({callback: spyFn});
            logger.log('callback');
            assert.deepEqual(spyFn.callCount, 1);
        });
        it('should invoke callback from global logger', () => {
            const spyFn = sinon.fake();
            delete global.logger;
            Logger.setUpGlobal(true, {callback: spyFn});
            global.logger.log('callback');
            assert.deepEqual(spyFn.callCount, 1);
        });
        it('should gracefully error in callback', () => {
            const logger = new Logger({
                callback: () => {
                    throw new Error('some error');
                }
            });
            logger.log('callback');
            assert.deepEqual(true, true);
        });
    });
    describe('test durability with log levels', () => {
        it('should still work with bad MIN_LOG_LEVEL', () => {
            process.env['MIN_LOG_LEVEL'] = 'NOT-REAL';
            const logger = new Logger();
            logger.log({level: 'INFO', log: 'durable min log level'});
            assert.deepEqual(true, true);
        });
        it('should still work with bad level', () => {
            process.env['MIN_LOG_LEVEL'] = 'INFO';
            const logger = new Logger();
            logger.log({level: 'NOT-REAL', log: 'durable level'});
            assert.deepEqual(true, true);
        });
    });
});
