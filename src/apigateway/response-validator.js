const responseBodyValidationRuleKey = 'requiredResponse';

class ResponseValidator {
    constructor(eventClient, responseClient, schema) {
        this._schema = schema;
        this._responseClient = responseClient;
        this._eventClient = eventClient;
    }

    async isValid(params) {
        await this._checkIfRequestValid(params);
        return this._responseClient;
    }

    async _checkIfRequestValid(params) {
        const rule = params[responseBodyValidationRuleKey];
        if (!rule) {
            return;
        }
        const {errors} = await this._schema.validate(rule, this._responseClient.rawBody);
        if (errors === null) {
            return;
        }
        this._responseClient.code = 500;
        errors.forEach((error) => {
            const dataPath = error.instancePath ? error.instancePath : 'root';
            this._responseClient.setError(dataPath, error.message);
        });
    }
}

module.exports = ResponseValidator;
