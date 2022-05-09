class Validator {
    constructor(schema) {
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

    async isValid(request, response, requirements) {
        for (const validation of Object.keys(this.__pairings)) {
            if (requirements && requirements[validation]) {
                const event = this.__pairings[validation].event === 'request' ? request : response;
                const source = this.__pairings[validation].source;
                const code = this.__pairings[validation].code;
                const part = event[source];
                await this[this.__pairings[validation].method](response, requirements[validation], part, source, code);
            }
        }
        return response;
    }

    __validateAvailableFields(response, available, sent, source, code) {
        Object.keys(sent).forEach((field) => {
            if (!available.includes(field)) {
                response.code = code;
                response.setError(source, `${field} is not an available ${source}`);
            }
        });
    }

    __validateRequiredFields(response, required, sent, source, code) {
        required.forEach((field) => {
            if (sent[field] === undefined) {
                response.code = code;
                response.setError(source, `Please provide ${field} for ${source}`);
            }
        });
    }

    async __validateRequiredBody(response, schema, body, code) {
        const errors = await this.__schema.validate(schema, body);
        if (errors) {
            response.code = code;
            errors.forEach((error) => {
                const dataPath = error.instancePath ? error.instancePath : 'root';
                response.setError(dataPath, error.message);
            });
        }
    }
}

module.exports = Validator;
