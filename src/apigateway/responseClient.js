class ResponseClient {
    constructor() {
        this._body = {};
        this._code = 200;
        this._headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        };
    }

    get headers() {
        return this._headers;
    }

    set headers(headerObj) {
        this._headers[headerObj.key] = headerObj.value;
    }

    get code() {
        if (this._code === 200 && !this.body) {
            return 204;
        }
        if (this._code === 200 && this.hasErrors) {
            return 400;
        }
        return this._code;
    }

    set code(code) {
        this._code = code;
    }

    get body() {
        try {
            return JSON.stringify(this._body);
        } catch (error) {
            return this._body;
        }
    }

    set body(body) {
        this._body = body;
    }

    get response() {
        return {
            headers: this.headers,
            statusCode: this.code,
            body: this.body
        };
    }

    get hasErrors() {
        if (typeof this._body === 'object' && this._body) {
            return 'errors' in this._body;
        }
        return false;
    }

    setError(key_path, message, conflict = null) {
        const error = {key_path, message};
        if (this.hasErrors) {
            this._body.errors.push(error);
        } else {
            this._body = {errors: [error]};
        }
        if (conflict) {
            this._body.current = conflict;
        }
    }
}

module.exports = ResponseClient;
