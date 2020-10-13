class Logger {
    constructor() {
        this._logs = [];
        this._startTime = new Date();
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
        const splitStack = stack.split('\n');
        if (typeof splitStack[2] !== 'undefined') {
            const [, lastFileCaller] = splitStack;
            return lastFileCaller.replace('at', '').trim();
        }
        return stack.replace('at', '').trim();
    }

    _shouldLog(level) {
        let minLevel = process.env.MIN_LOG_LEVEL || 'WARN';
        level = isNaN(level) ? this._logLevelMap[level] : level;
        minLevel = isNaN(minLevel) ? this._logLevelMap[minLevel] : minLevel;
        return level >= parseInt(minLevel, 10);
    }

    _logToConsole() {
        for (const log of this._logs) {
            if (this._shouldLog(log.level)) {
                this._methodMap[log.level](JSON.stringify(log, null, 4));
            }
        }
        this._logs = [];
    }

    _appendToLogs(level, stack, args = []) {
        for (const arg of args) {
            this._logs.push({
                level,
                time: this._calcTime(),
                caller: this._getStackSafely(stack),
                log: arg
            });
        }
    }

    info(...args) {
        const {stack} = new Error();
        this._appendToLogs('INFO', stack.toString(), args);
        this._logToConsole();
    }

    log(...args) {
        const {stack} = new Error();
        this._appendToLogs('INFO', stack.toString(), args);
        this._logToConsole();
    }

    warn(...args) {
        const {stack} = new Error();
        this._appendToLogs('WARN', stack.toString(), args);
        this._logToConsole();
    }

    error(...args) {
        const {stack} = new Error();
        this._appendToLogs('ERROR', stack.toString(), args);
        this._logToConsole();
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
