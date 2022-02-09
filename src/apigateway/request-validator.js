const fs = require('fs');
const Ajv = require('ajv');
const yaml = require('js-yaml');
const RefParser = require('json-schema-ref-parser');

class RequestValidator {
    constructor(EventClient, ResponseClient, schemaPath) {
        this._ajv = new Ajv({allErrors: true});
        this._eventClient = EventClient;
        this._responseClient = ResponseClient;
        this._schemaPath = schemaPath;
        this._validationPairings = {
            requiredHeaders: {list: 'headers', func: '_validateRequiredFields'},
            availableHeaders: {list: 'headers', func: '_validateAvailableFields'},
            requiredParams: {list: 'params', func: '_validateRequiredFields'},
            availableParams: {list: 'params', func: '_validateAvailableFields'},
            requiredBody: {list: 'body', func: '_validateRequiredBody'},
            requiredRouteParams: {list: 'path', func: '_validateRequiredRouteParams'}
        };
    }

    async requestIsValid(params) {
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
        const openapi = await this._getApiDoc();
        const refSchema = await this._dereferenceApiDoc(openapi);
        const combinedSchema = await this._combineSchemas(requiredSchema, refSchema);
        this._ajv.validate(combinedSchema, requestBody);
        if (this._ajv.errors) {
            this._ajv.errors.forEach((error) => {
                const dataPath = error.instancePath ? error.instancePath : 'root';
                this._responseClient.setError(dataPath, error.message);
            });
        }
    }

    async _getApiDoc() {
        return yaml.safeLoad(fs.readFileSync(this._schemaPath, 'utf8'));
    }

    async _dereferenceApiDoc(openapi) {
        return await RefParser.dereference(openapi);
    }

    async _combineSchemas(requiredSchema, refSchema) {
        const combinedSchema = {};
        const definition = refSchema.components.schemas[requiredSchema];
        const jsonSchemas = definition.allOf ? definition.allOf : [definition];
        jsonSchemas.forEach((jsonSchema) => {
            Object.assign(combinedSchema, jsonSchema);
        });
        combinedSchema.additionalProperties = false;
        return combinedSchema;
    }
}

module.exports = RequestValidator;
