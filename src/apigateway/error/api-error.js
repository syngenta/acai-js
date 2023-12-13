class ApiError {
    constructor(code = 500, key = 'unknown', message = 'something went wrong') {
        this.code = code;
        this.key = key;
        this.message = message;
    }
}

module.exports = ApiError;
