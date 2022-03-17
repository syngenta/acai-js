class RequestValidator {
    constructor(EventClient, ResponseClient, schema) {
        this._eventClient = EventClient;
        this._responseClient = ResponseClient;
        this._schema = schema;

        this._validationPairings = {
            requiredHeaders: {list: 'headers', func: '_validateRequiredFields'},
            availableHeaders: {list: 'headers', func: '_validateAvailableFields'},
            requiredParams: {list: 'params', func: '_validateRequiredFields'},
            availableParams: {list: 'params', func: '_validateAvailableFields'},
            requiredBody: {list: 'body', func: '_validateRequiredBody'},
            requiredRouteParams: {list: 'path', func: '_validateRequiredRouteParams'}
        };
    }

    async isValid(params) {
        await this._validateRequest(params);
        return this._responseClient;
    }

    async _validateRequest(params) {
        const event = this._eventClient.request;
        for (const validation of Object.keys(this._validationPairings)) {
            if (params[validation]) {
                const list = this._validationPairings[validation].list;
                const request = event[this._validationPairings[validation].list];
                await this[this._validationPairings[validation].func](params[validation], request, list);
            }
        }
    }

    _validateAvailableFields(available, sent, listName) {
        Object.keys(sent).forEach((field) => {
            if (!available.includes(field)) {
                this._responseClient.setError(listName, `${field} is not an available ${listName}`);
            }
        });
    }

    _validateRequiredFields(required, sent, listName) {
        required.forEach((field) => {
            if (sent[field] === undefined) {
                this._responseClient.setError(listName, `Please provide ${field} for ${listName}`);
            }
        });
    }

    async _validateRequiredBody(requiredSchema, requestBody) {
        const errors = await this._schema.validate(requiredSchema, requestBody);

        if (errors) {
            errors.forEach((error) => {
                const dataPath = error.instancePath ? error.instancePath : 'root';
                this._responseClient.setError(dataPath, error.message);
            });
        }
    }
}

module.exports = RequestValidator;
