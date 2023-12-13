class Timer {
    constructor() {
        this.__id = null;
    }
    start(ms) {
        return new Promise((resolve) => {
            this.__id = setTimeout(resolve, ms, 'timeout');
        });
    }
    stop() {
        if (this.__id !== null) {
            clearTimeout(this.__id);
        }
    }
}

module.exports = Timer;
