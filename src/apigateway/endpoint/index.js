class Endpoint {
    constructor(endpoint, method) {
        this.__endpoint = endpoint;
        this.__method = method;
    }

    get requirements() {
        if (this.__endpoint.requirements) {
            return this.__endpoint.requirements[this.__method];
        }
        return {};
    }

    get hasBefore() {
        if (typeof this.requirements.before === 'function') {
            return true;
        }
        return false;
    }

    async before(request, response, requirements) {
        return this.requirements.before(request, response, requirements);
    }

    get hasAfter() {
        if (typeof this.requirements.after === 'function') {
            return true;
        }
        return false;
    }

    async after(request, response, requirements) {
        return this.requirements.after(request, response, requirements);
    }

    get hasDataClass() {
        if (this.requirements.dataClass) {
            return true;
        }
        return false;
    }

    dataClass(request) {
        return new this.requirements.dataClass(request);
    }

    async run(request, response, requirements) {
        return this.__endpoint[this.__method](request, response);
    }
}

module.exports = Endpoint;
