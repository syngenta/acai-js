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
            global.logger = new Logger(params);
        }
    }

    log(...logs) {
        const normalized = this.__normalizeLogs(logs);
        const log = this.__getLog(normalized.level, normalized.log);
        this.__invokeConsoleMethod(log);
        this.__invokeCallback(log);
    }

    info(...logs) {
        this.log({level: 'INFO', log: logs});
    }

    debug(...logs) {
        this.log({level: 'DEBUG', log: logs});
    }

    warn(...logs) {
        this.log({level: 'WARN', log: logs});
    }

    error(...logs) {
        this.log({level: 'ERROR', log: logs});
    }

    __normalizeLogs(logs) {
        if (logs && logs[0] && logs[0].level && logs[0].log) {
            return logs[0];
        }
        if (!logs || !logs[0] || !logs[0].level || !logs[0].log) {
            return {level: 'INFO', log: logs};
        }
    }

    __getLog(level = 'INFO', logs) {
        return {
            level,
            time: new Date().toISOString(),
            stack: this.__getStack(),
            log: logs.length > 1 ? logs : logs[0]
        };
    }

    __getStack() {
        const stack = new Error().stack;
        const clean = stack.split('\n').filter((trace) => !trace.includes('Logger.'));
        return clean;
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
