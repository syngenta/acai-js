const {assert} = require('chai');
const Logger = require('../../../src/common/logger');

describe('Test Logger', () => {
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
