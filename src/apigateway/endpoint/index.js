class Endpoint {
    constructor(endpoint, method) {
        this.__endpoint = endpoint;
        this.__method = method.toLowerCase();
    }

    get requirements() {
        if (this.__endpoint.requirements) {
            return this.__endpoint.requirements[this.__method];
        }
        return {};
    }

    get hasBefore() {
        if (this.requirements && typeof this.requirements.before === 'function') {
            return true;
        }
        return false;
    }

    async before(request, response, requirements) {
        return this.requirements.before(request, response, requirements);
    }

    get hasAfter() {
        if (this.requirements && typeof this.requirements.after === 'function') {
            return true;
        }
        return false;
    }

    get method() {
        if (this.__endpoint) {
            return this.__endpoint[this.__method];
        }
        return false;
    }

    async after(request, response, requirements) {
        return this.requirements.after(request, response, requirements);
    }

    get hasDataClass() {
        if (this.requirements && this.requirements.dataClass) {
            return true;
        }
        return false;
    }

    dataClass(request) {
        if (this.hasDataClass) {
            return new this.requirements.dataClass(request);
        }
    }

    async run(request, response) {
        const input = this.dataClass(request) ? this.hasDataClass : request;
        return this.__endpoint[this.__method](input, response);
    }
}

module.exports = Endpoint;
