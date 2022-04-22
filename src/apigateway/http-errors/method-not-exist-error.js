const ResponseClient = require('../response-client');

class MethodNotExistError {
    constructor() {
        this._setResponseClient();
    }

    _setResponseClient() {
        const responseClient = new ResponseClient();
        responseClient.code = 403;
        responseClient.setError('method', 'method not allowed');
        this._responseClient = responseClient;
    }

    get response(){
        return this._responseClient.response;
    }
}

module.exports = MethodNotExistError;
