class Endpoint {
    constructor(endpoint, method) {
        this.__endpoint = endpoint;
        this.__method = method.toLowerCase();
    }

    get hasRequirements() {
        return Boolean(this.requirements);
    }

    get requirements() {
        if (this.__endpoint.requirements) {
            return this.__endpoint.requirements[this.__method];
        }
        return {};
    }

    get hasAuth() {
        return Boolean(this.requirements?.requiredAuth);
    }

    get hasBefore() {
        return this.requirements && typeof this.requirements.before === 'function';
    }

    async before(request, response) {
        return this.requirements.before(request, response, this.requirements);
    }

    get hasAfter() {
        return this.requirements && typeof this.requirements.after === 'function';
    }

    get hasTimeout() {
        return this.requirements && Number.isInteger(this.requirements.timeout);
    }

    get timeout() {
        return this.requirements.timeout;
    }

    get method() {
        return this.__endpoint[this.__method];
    }

    get httpMethod() {
        return this.__method;
    }

    async after(request, response) {
        return this.requirements.after(request, response, this.requirements);
    }

    get hasDataClass() {
        return Boolean(this.requirements?.dataClass);
    }

    dataClass(request) {
        return new this.requirements.dataClass(request);
    }

    async run(request, response) {
        if (this.hasDataClass) {
            const input = this.dataClass(request);
            return this.method(input, response);
        }
        return this.method(request, response);
    }
}

module.exports = Endpoint;
