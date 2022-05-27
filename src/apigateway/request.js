const xml2js = require('xml2js').Parser({explicitArray: false});

class Request {
    constructor(event) {
        this.__event = event;
        this.__context = null;
        this.__pathParameters = {};
        this.__paramPath = this.__event.path;
    }

    get method() {
        return this.__event.httpMethod.toLowerCase();
    }

    get resource() {
        return this.__event.resource;
    }

    get authorizer() {
        if (this.__event.isOffline || process.env.IS_OFFLINE) {
            return this.__event.headers;
        }
        return this.__event.requestContext.authorizer;
    }

    get headers() {
        const headers = {};
        for (const [header, value] of Object.entries(this.__event.headers || {})) {
            headers[header.toLowerCase()] = value;
        }
        headers['content-type'] = headers['content-type'] ? headers['content-type'] : 'application/json';
        return headers;
    }

    get params() {
        const query = this.query;
        const path = this.path;
        return {query, path};
    }

    get query() {
        return this.__event.queryStringParameters ? this.__event.queryStringParameters : {};
    }

    get path() {
        return this.__pathParameters;
    }

    set path({key, value}) {
        this.__pathParameters[key] = value;
    }

    get paramPath() {
        return this.__paramPath;
    }

    set paramPath(paramPath) {
        this.__paramPath = paramPath;
    }

    get route() {
        return this.__event.path;
    }

    get json() {
        return JSON.parse(this.__event.body);
    }

    get xml() {
        try {
            let result;
            xml2js.parseString(this.__event.body, (error, parsed) => {
                if (error) {
                    throw error;
                }
                result = parsed;
            });
            return result;
        } catch (error) {
            return this.__event.body;
        }
    }

    get body() {
        try {
            const type = this.headers['content-type'].split(';')[0];
            const parser = this.__bodyParsers[type] ? this.__bodyParsers[type] : 'raw';
            return this[parser];
        } catch (error) {
            return this.__event.body;
        }
    }

    get context() {
        return this.__context;
    }

    set context(context) {
        this.__context = context;
    }

    get raw() {
        return this.__event.body;
    }

    get __bodyParsers() {
        return {
            'application/json': 'json',
            'application/xml': 'xml',
            'text/xml': 'xml',
            raw: 'raw'
        };
    }

    get request() {
        return {
            method: this.method,
            resource: this.resource,
            authorizer: this.authorizer,
            headers: this.headers,
            params: this.params,
            query: this.query,
            path: this.path,
            route: this.route,
            context: this.context,
            body: this.body
        };
    }
}

module.exports = Request;
