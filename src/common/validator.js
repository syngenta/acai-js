class Validator {
    constructor(schema) {
        this.__schema = schema;
        this.__pairings = {
            requiredHeaders: {source: 'headers', method: '__validateRequiredFields', code: 400},
            availableHeaders: {source: 'headers', method: '__validateAvailableFields', code: 400},
            requiredQuery: {source: 'queryParams', method: '__validateRequiredFields', code: 400},
            availableQuery: {source: 'queryParams', method: '__validateAvailableFields', code: 400},
            requiredPath: {source: 'pathParams', method: '__validateRequiredpath', code: 400},
            requiredBody: {source: 'body', method: '__validateApigatewayBody', code: 400}
        };
    }

    async validateWithOpenAPI(request, response) {
        const route = this.__convertRouteToOpenAPI(request.route);
        const translatedRequest = {
            headers: request.headers,
            queryParameters: request.queryParams,
            pathParameters: request.path,
            body: request.body
        };
        const errors = await this.__schema.validateOpenApi(route, request.method, translatedRequest);
        this.__translateOpenAPIErrors(errors, response);
        return response;
    }

    async validateWithRequirements(request, response, requirements) {
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

    async validateWithRequirementsRecord(entityName = '', record = {}) {
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
                const key = error.instancePath ? error.instancePath : 'root';
                response.setError(key, error.message);
            });
        }
    }

    __convertRouteToOpenAPI(path) {
        const matches = path.matchAll(':(.*?)($|/)', 'g');
        Array.from(matches).forEach((match) => {
            path = path.replace(`:${match[1]}`, `{${match[1]}}`);
        });
        return !path.startsWith('/') ? `/${path}` : path;
    }

    __translateOpenAPIErrors(errors, response) {
        if (errors.length) {
            response.code = 400;
            errors.forEach((error) => {
                const key = error.path.split('.')[1];
                const value = error.message;
                response.setError(key, value);
            });
        }
    }
}

module.exports = Validator;
