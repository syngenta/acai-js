const ResponseClient = require('../response-client');

class NotFoundError {
    constructor() {
        const responseClient = new ResponseClient();
        responseClient.code = 404;
        responseClient.setError('url', 'url is not found');
        this._responseClient = responseClient;
    }

    toJSON() {
        return JSON.stringify(this._responseClient.response);
    }
}

module.exports = NotFoundError;
