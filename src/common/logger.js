class Logger {
    constructor() {
        this.__startTime = new Date();
        this.__minLevel = process.env.MIN_LOG_LEVEL || 'INFO';
        this.__methodMap = {
            INFO: console.info,
            WARN: console.warn,
            ERROR: console.error
        };
        this.__logLevelMap = {
            INFO: 1,
            WARN: 2,
            ERROR: 3
        };
    }

    static setUpLogger(setup = true) {
        if (!global.logger && setup) {
            global.logger = new Logger();
        }
    }

    __calcTime() {
        const endTime = new Date();
        return endTime - this.__startTime;
    }

    __getStackSafely(stack) {
        const errorStack = [];
        for (const errorString of stack.split('\n')) {
            if (errorString !== 'Error') {
                errorStack.push(errorString.replace('at', '').trim());
            }
        }
        return errorStack;
    }

    __shouldLog(level) {
        if (process.env.UNIT_TEST) {
            return false;
        }
        level = isNaN(level) ? this.__logLevelMap[level] : level;
        this.__minLevel = isNaN(this.__minLevel) ? this.__logLevelMap[this.__minLevel] : this.__minLevel;
        return level >= parseInt(this.__minLevel, 10);
    }

    __logToConsole(level, stack, args = []) {
        if (this.__shouldLog(level)) {
            this.__methodMap[level](
                JSON.stringify(
                    {
                        level,
                        time: this.__calcTime(),
                        stack: this.__getStackSafely(stack),
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
        this.__logToConsole('INFO', stack.toString(), args);
    }

    log(...args) {
        const {stack} = new Error();
        this.__logToConsole('INFO', stack.toString(), args);
    }

    warn(...args) {
        const {stack} = new Error();
        this.__logToConsole('WARN', stack.toString(), args);
    }

    error(...args) {
        const {stack} = new Error();
        this.__logToConsole('ERROR', stack.toString(), args);
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
