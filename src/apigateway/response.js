class Response {
    constructor() {
        this.__body = null;
        this.__code = 200;
        this.__base64Encoded = false;
        this.__headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        };
    }

    get headers() {
        return this.__headers;
    }

    set headers(headerObj) {
        this.__headers[headerObj.key] = headerObj.value;
    }

    get code() {
        if (this.__code === 200 && !this.__body) {
            return 204;
        }
        if (this.__code === 200 && this.hasErrors) {
            return 400;
        }
        return this.__code;
    }

    set code(code) {
        this.__code = code;
    }

    get rawBody() {
        return this.__body;
    }

    get body() {
        try {
            return JSON.stringify(this.__body);
        } catch (error) {
            return this.__body;
        }
    }

    set body(body) {
        this.__body = body;
    }

    get response() {
        return {
            isBase64Encoded: this.__base64Encoded,
            headers: this.headers,
            statusCode: this.code,
            body: this.body
        };
    }

    get hasErrors() {
        if (typeof this.__body === 'object' && this.__body) {
            return 'errors' in this.__body;
        }
        return false;
    }

    setError(key_path, message) {
        const error = {key_path, message};
        if (this.hasErrors) {
            this.__body.errors.push(error);
        } else {
            this.__body = {errors: [error]};
        }
    }
}

module.exports = Response;
