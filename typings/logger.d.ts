export namespace logger {
    export class Logger {
        info(...args: unknown[]): void

        log(...args: unknown[]): void

        warn(...args: unknown[]): void

        error(...args: unknown[]): void

        dir(...args: unknown[]): void

        time(...args: unknown[]): void

        timeEnd(...args: unknown[]): void

        timeLog(...args: unknown[]): void

        trace(...args: unknown[]): void

        clear(...args: unknown[]): void

        count(...args: unknown[]): void

        countReset(...args: unknown[]): void

        group(...args: unknown[]): void

        groupEnd(...args: unknown[]): void

        table(...args: unknown[]): void

        debug(...args: unknown[]): void

        dirxml(...args: unknown[]): void

        groupCollapsed(...args: unknown[]): void

        Console(...args: unknown[]): void

        profile(...args: unknown[]): void

        profileEnd(...args: unknown[]): void

        timeStamp(...args: unknown[]): void

        context(...args: unknown[]): void
    }
}
