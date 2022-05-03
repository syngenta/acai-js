const Logger = require('./logger');

exports.setUpLogger = (setup = true) => {
    if (!global.logger && setup) {
        global.logger = new Logger();
    }
};
