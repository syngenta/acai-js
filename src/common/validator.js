class Validator {
    constructor(schema) {
        this.__schema = schema;
        this.__pairings = {
            requiredHeaders: {target: 'request', source: 'headers', method: '__validateRequiredFields', code: 400},
            availableHeaders: {target: 'request', source: 'headers', method: '__validateAvailableFields', code: 400},
            requiredParams: {target: 'request', source: 'params', method: '__validateRequiredFields', code: 400},
            availableParams: {target: 'request', source: 'params', method: '__validateAvailableFields', code: 400},
            requiredBody: {target: 'request', source: 'body', method: '__validateApigatewayBody', code: 400},
            responseBody: {target: 'response', source: 'rawBody', method: '__validateApigatewayBody', code: 500}
        };
    }

    async isValid(request, response, requirements, target = 'request') {
        for (const pairing of Object.keys(this.__pairings)) {
            const requirement = requirements[pairing];
            const pairingTarget = this.__pairings[pairing].target;
            const event = target === 'request' ? request : response;
            const source = this.__pairings[pairing].source;
            const code = this.__pairings[pairing].code;
            const part = event[source];
            if (requirement && pairingTarget === target) {
                await this[this.__pairings[pairing].method](response, requirement, part, source, code);
            }
        }
        return response;
    }

    async isValidRecord(entityName = '', record = {}) {
        const errors = await this.__schema.validate(entityName, record.body);
        if (errors) {
            const throwables = [];
            errors.forEach((error) => {
                const path = error.instancePath ? error.instancePath : 'root';
                throwables.push({path, message: error.message});
            });
            throw new Error(JSON.stringify(throwables));
        }
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

    async __validateApigatewayBody(response, schema, body, code) {
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
