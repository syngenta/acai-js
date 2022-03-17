class ResponseValidator {
    constructor(eventClient, responseClient, schema) {
        this._schema = schema;
        this._responseClient = responseClient;
        this._eventClient = eventClient;
    }

    async isValid(validationRule) {
        await this._checkIfRequestValid(validationRule);
        return this._responseClient;
    }

    async _checkIfRequestValid(validationRule) {
        const errors = await this._schema.validate(validationRule, this._responseClient.rawBody);
        if (errors) {
            this._responseClient.code = 500;
            errors.forEach((error) => {
                const dataPath = error.instancePath ? error.instancePath : 'root';
                this._responseClient.setError(dataPath, error.message);
            });
        }
    }
}

module.exports = ResponseValidator;
