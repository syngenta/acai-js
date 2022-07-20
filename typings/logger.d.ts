export namespace logger {
    export class Logger {
        info(...args: unknown[]): void

        log(...args: unknown[]): void

        debug(...args: unknown[]): void

        warn(...args: unknown[]): void

        error(...args: unknown[]): void
    }
}
