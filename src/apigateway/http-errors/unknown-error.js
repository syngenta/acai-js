const ResponseClient = require('../response-client');

class UnknownError {
    constructor() {
        const responseClient = new ResponseClient();
        responseClient.code = 500;
        responseClient.setError('server', 'internal server error');
        this._responseClient = responseClient;
    }

    get response() {
        return this._responseClient.response;
    }
}

module.exports = UnknownError;
