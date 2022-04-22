const ResponseClient = require('../response-client');

class MethodNotExistError {
    constructor() {
        const responseClient = new ResponseClient();
        responseClient.code = 403;
        responseClient.setError('method', 'method not allowed');
        this._responseClient = responseClient;
    }

    toJSON() {
        return JSON.stringify(this._responseClient.response);
    }
}

module.exports = MethodNotExistError;
