const xml2js = require('xml2js').Parser({explicitArray: false});
const Logger = require('../common/Logger');

class RequestClient {
    constructor(event) {
        this._event = event;
        this._logger = new Logger();
    }

    get method() {
        return this._event.httpMethod;
    }

    get resource() {
        return this._event.resource;
    }

    get authorizer() {
        if (this._event.isOffline || process.env.IS_OFFLINE) {
            return this._event.headers;
        }
        return this._event.requestContext.authorizer;
    }

    get headers() {
        const headers = {};
        for (const [header, value] of Object.entries(this._event.headers || {})) {
            headers[header.toLowerCase()] = value;
        }
        headers['content-type'] = headers['content-type'] ? headers['content-type'] : 'application/json';
        return headers;
    }

    get params() {
        return this._event.queryStringParameters ? this._event.queryStringParameters : {};
    }

    get path() {
        return this._event.pathParameters;
    }

    get json() {
        return JSON.parse(this._event.body);
    }

    get xml() {
        let result;
        xml2js.parseString(this._event.body, (err, rst) => {
            result = rst;
        });
        return result;
    }

    get raw() {
        return this._event.body;
    }

    get _bodyParsers() {
        return {
            'application/json': 'json',
            'application/xml': 'xml',
            'text/xml': 'xml',
            raw: 'raw'
        };
    }

    get body() {
        try {
            const type = this.headers['content-type'].split(';')[0];
            const parser = this._bodyParsers[type] ? this._bodyParsers[type] : 'raw';
            return this[parser];
        } catch (error) {
            this._logger.warn('request body parsing error: ', error);
            return this._event.body;
        }
    }

    get request() {
        return {
            method: this.method,
            resource: this.resource,
            authorizer: this.authorizer,
            headers: this.headers,
            params: this.params,
            path: this.path,
            body: this.body
        };
    }
}

module.exports = RequestClient;
