const ResponseClient = require('../response-client');

class NotFoundError {
    constructor() {
        const responseClient = new ResponseClient();
        responseClient.code = 404;
        responseClient.setError('url', 'endpoint not found');
        this._responseClient = responseClient;
    }

    get response() {
        return this._responseClient.response;
    }
}

module.exports = NotFoundError;
