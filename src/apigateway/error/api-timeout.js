class ApiTimeout {
    constructor(key = 'unknown', message = 'request timeout') {
        this.code = 408;
        this.key = key;
        this.message = message;
    }
}

module.exports = ApiTimeout;
