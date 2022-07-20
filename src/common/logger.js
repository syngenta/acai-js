class Logger {
    constructor(params = {}) {
        this.__callback = params.callback;
        this.__minLevel = process.env.MIN_LOG_LEVEL || 'INFO';
        this.__logLevels = {
            INFO: 1,
            DEBUG: 1,
            WARN: 2,
            ERROR: 3,
            OFF: 4
        };
    }

    static setUpGlobal(setup = true, params = {}) {
        if (!global.logger && setup) {
            new Logger(params).setUp();
        }
    }

    setUp() {
        global.logger = this;
    }

    log(log) {
        const complete = this.__getLog(log.level, log.log);
        this.__invokeConsoleMethod(complete);
        this.__invokeCallback(complete);
    }

    info(log) {
        this.log({level: 'INFO', log: log});
    }

    debug(log) {
        this.log({level: 'DEBUG', log: log});
    }

    warn(log) {
        this.log({level: 'WARN', log: log});
    }

    error(log) {
        this.log({level: 'ERROR', log: log});
    }

    __getLog(level = 'INFO', log = {}) {
        return {
            level,
            time: new Date().toISOString(),
            log
        };
    }

    __shouldLog(level) {
        try {
            if (!(level in this.__logLevels)) {
                throw new Error(`log level must be one of 4: INFO, DEBUG, WARN, ERROR | provided: ${level}`);
            }
            if (!(this.__minLevel in this.__logLevels)) {
                throw new Error(
                    `MIN_LOG_LEVEL must be one of 4: INFO, DEBUG, WARN, ERROR, OFF | provided: ${this.__minLevel};`
                );
            }
            const logLevel = isNaN(level) ? this.__logLevels[level] : level;
            const systemLevel = isNaN(this.__minLevel) ? this.__logLevels[this.__minLevel] : this.__minLevel;
            return logLevel >= parseInt(systemLevel, 10);
        } catch (error) {
            console.log(error.message);
            return true;
        }
    }

    __invokeConsoleMethod(log) {
        if (this.__shouldLog(log.level)) {
            console.log(JSON.stringify(log, null, 4));
        }
    }

    __invokeCallback(log) {
        if (this.__callback && typeof this.__callback === 'function') {
            try {
                this.__callback(log);
            } catch (error) {
                console.log(`error with call back: ${error.message}`);
            }
        }
    }
}

module.exports = Logger;
