class RequestValidator {
    constructor(request, response, schema) {
        this.__request = request;
        this.__response = response;
        this.__schema = schema;

        this._validationPairings = {
            requiredHeaders: {list: 'headers', func: '__validateRequiredFields'},
            availableHeaders: {list: 'headers', func: '__validateAvailableFields'},
            requiredParams: {list: 'params', func: '__validateRequiredFields'},
            availableParams: {list: 'params', func: '__validateAvailableFields'},
            requiredBody: {list: 'body', func: '__validateRequiredBody'}
        };
    }

    async isValid(params) {
        await this.__validateRequest(params);
        return this.__response;
    }

    async __validateRequest(params) {
        const event = this.__request.request;
        for (const validation of Object.keys(this._validationPairings)) {
            if (params[validation]) {
                const list = this._validationPairings[validation].list;
                const request = event[this._validationPairings[validation].list];
                await this[this._validationPairings[validation].func](params[validation], request, list);
            }
        }
    }

    __validateAvailableFields(available, sent, listName) {
        Object.keys(sent).forEach((field) => {
            if (!available.includes(field)) {
                this.__response.setError(listName, `${field} is not an available ${listName}`);
            }
        });
    }

    __validateRequiredFields(required, sent, listName) {
        required.forEach((field) => {
            if (sent[field] === undefined) {
                this.__response.setError(listName, `Please provide ${field} for ${listName}`);
            }
        });
    }

    async __validateRequiredBody(requiredSchema, requestBody) {
        const errors = await this.__schema.validate(requiredSchema, requestBody);
        if (errors) {
            errors.forEach((error) => {
                const dataPath = error.instancePath ? error.instancePath : 'root';
                this.__response.setError(dataPath, error.message);
            });
        }
    }
}

module.exports = RequestValidator;
