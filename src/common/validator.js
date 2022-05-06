class Validator {
    constructor(request, response, schema) {
        this.__request = request;
        this.__response = response;
        this.__schema = schema;
        this.__pairings = {
            requiredHeaders: {event: 'request', source: 'headers', method: '__validateRequiredFields', code: 400},
            availableHeaders: {event: 'request', source: 'headers', method: '__validateAvailableFields', code: 400},
            requiredParams: {event: 'request', source: 'params', method: '__validateRequiredFields', code: 400},
            availableParams: {event: 'request', source: 'params', method: '__validateAvailableFields', code: 400},
            requiredBody: {event: 'request', source: 'body', method: '__validateRequiredBody', code: 400},
            responseBody: {event: 'response', source: 'rawBody', method: '__validateRequiredBody', code: 500}
        };
    }

    async isValid(params) {
        for (const validation of Object.keys(this.__pairings)) {
            if (params && params[validation]) {
                const event = this.__pairings[validation].event === 'request' ? this.__request : this.__response;
                const source = this.__pairings[validation].source;
                const code = this.__pairings[validation].code;
                const part = event[source];
                await this[this.__pairings[validation].method](params[validation], part, source, code);
            }
        }
        return this.__response;
    }

    __validateAvailableFields(available, sent, source, code) {
        Object.keys(sent).forEach((field) => {
            if (!available.includes(field)) {
                this.__response.code = code;
                this.__response.setError(source, `${field} is not an available ${source}`);
            }
        });
    }

    __validateRequiredFields(required, sent, source, code) {
        required.forEach((field) => {
            if (sent[field] === undefined) {
                this.__response.code = code;
                this.__response.setError(source, `Please provide ${field} for ${source}`);
            }
        });
    }

    async __validateRequiredBody(requiredSchema, requestBody, code) {
        const errors = await this.__schema.validate(requiredSchema, requestBody);
        if (errors) {
            this.__response.code = code;
            errors.forEach((error) => {
                const dataPath = error.instancePath ? error.instancePath : 'root';
                this.__response.setError(dataPath, error.message);
            });
        }
    }
}

module.exports = Validator;
