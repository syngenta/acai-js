const Logger = require('./logger');

exports.setUpLogger = () => {
    if (!global.logger) {
        global.logger = new Logger();
    }
};
