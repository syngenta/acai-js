class Validator {
    constructor(schema) {
        this.__schema = schema;
        this.__pairings = {
            requiredHeaders: {source: 'headers', method: '__validateRequiredFields', code: 400},
            availableHeaders: {source: 'headers', method: '__validateAvailableFields', code: 400},
            requiredQuery: {source: 'query', method: '__validateRequiredFields', code: 400},
            availableQuery: {source: 'query', method: '__validateAvailableFields', code: 400},
            requiredPath: {source: 'path', method: '__validateRequiredpath', code: 400},
            requiredBody: {source: 'body', method: '__validateApigatewayBody', code: 400}
        };
    }

    async validateWithOpenAPI(request, response) {
        const method = request.method;
        const path = this.__convertPathToOpenAPI(request.paramPath);
        return path;
        const translatedRequest = {
            headers: request.headers,
            queryParameters: request.query,
            pathParameters: request.path,
            body: request.body
        };
        const errors = this.__schema.validateOpenApi(path, method, translatedRequest);
        return errors;
    }

    async isValid(request, response, requirements) {
        for (const pairing of Object.keys(this.__pairings)) {
            const requirement = requirements[pairing];
            const source = this.__pairings[pairing].source;
            const code = this.__pairings[pairing].code;
            const part = request[source];
            if (requirement) {
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

    __convertPathToOpenAPI(path) {
        const matches = path.matchAll(':(.*?)($|/)', 'g');
        Array.from(matches).forEach((match) => {
            path = path.replace(`:${match[1]}`, `{${match[1]}}`);
        });
        return path;
    }
}

module.exports = Validator;
