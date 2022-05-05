class RouteError {
    constructor(code = 500, key = 'route-config', message = 'something went wrong') {
        this.code = code;
        this.key = key;
        this.message = message;
    }
}

module.exports = RouteError;
