class Logger {
    constructor() {
        this._startTime = new Date();
        this.minLevel = process.env.MIN_LOG_LEVEL || 'INFO';
        this._methodMap = {
            INFO: console.info,
            WARN: console.warn,
            ERROR: console.error
        };
        this._logLevelMap = {
            INFO: 1,
            WARN: 2,
            ERROR: 3
        };
    }

    _calcTime() {
        const endTime = new Date();
        return endTime - this._startTime;
    }

    _getStackSafely(stack) {
        const errorStack = [];
        for (const errorString of stack.split('\n')) {
            if (errorString !== 'Error') {
                errorStack.push(errorString.replace('at', '').trim());
            }
        }
        return errorStack;
    }

    _shouldLog(level) {
        level = isNaN(level) ? this._logLevelMap[level] : level;
        this.minLevel = isNaN(this.minLevel) ? this._logLevelMap[this.minLevel] : this.minLevel;
        return level >= parseInt(this.minLevel, 10);
    }

    _logToConsole(level, stack, args = []) {
        if (this._shouldLog(level)) {
            this._methodMap[level](
                JSON.stringify(
                    {
                        level,
                        time: this._calcTime(),
                        stack: this._getStackSafely(stack),
                        log: args
                    },
                    null,
                    4
                )
            );
        }
    }

    info(...args) {
        const {stack} = new Error();
        this._logToConsole('INFO', stack.toString(), args);
    }

    log(...args) {
        const {stack} = new Error();
        this._logToConsole('INFO', stack.toString(), args);
    }

    warn(...args) {
        const {stack} = new Error();
        this._logToConsole('WARN', stack.toString(), args);
    }

    error(...args) {
        const {stack} = new Error();
        this._logToConsole('ERROR', stack.toString(), args);
    }

    dir(...args) {
        console.dir(args);
    }

    time(...args) {
        console.time(args);
    }

    timeEnd(...args) {
        console.timeEnd(args);
    }

    timeLog(...args) {
        console.timeLog(args);
    }

    trace(...args) {
        console.trace(args);
    }

    clear(...args) {
        console.clear(args);
    }

    count(...args) {
        console.count(args);
    }

    countReset(...args) {
        console.countReset(args);
    }

    group(...args) {
        console.group(args);
    }

    groupEnd(...args) {
        console.groupEnd(args);
    }

    table(...args) {
        console.table(args);
    }

    debug(...args) {
        console.debug(args);
    }

    dirxml(...args) {
        console.dirxml(args);
    }

    groupCollapsed(...args) {
        console.groupCollapsed(args);
    }

    Console(...args) {
        console.Console(args);
    }

    profile(...args) {
        console.profile(args);
    }

    profileEnd(...args) {
        console.profileEnd(args);
    }

    timeStamp(...args) {
        console.timeStamp(args);
    }

    context(...args) {
        console.context(args);
    }
}

module.exports = Logger;
