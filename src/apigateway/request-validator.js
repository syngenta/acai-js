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
        this._requiredPairings = {
            requiredHeaders: 'headers',
            requiredQueryStringParameters: 'queryStringParameters',
            requiredBody: 'body'
        };
    }

    async requestIsValid(params) {
        await this.validateRequest(params);
        return this._responseClient;
    }

    async validateRequest(params) {
        const event = this._eventClient.request;
        if (params.requiredHeaders) {
            await this.validateRequiredFields(params.requiredHeaders, event.headers, 'headers');
        } else if (params.requiredQueryStringParameters) {
            await this.validateRequiredFields(
                params.requiredQueryStringParameters,
                event.params,
                'queryStringParameters'
            );
        } else if (params.requiredBody) {
            await this.validateRequiredBody(params.requiredBody, event.body);
        }
        return true;
    }

    validateRequiredFields(required, sent, listName) {
        required.forEach((field) => {
            if (!sent[field]) {
                this._responseClient.setError(listName, `Please provide ${field}`);
            }
        });
    }

    async validateRequiredBody(requiredSchema, requestBody) {
        const openapi = this.getApiDoc();
        const refSchema = await this.dereferenceApiDoc(openapi);
        const combinedSchema = await this.combineSchemas(requiredSchema, refSchema);
        this._ajv.validate(combinedSchema, requestBody);
        if (this._ajv.errors) {
            this._ajv.errors.forEach((error) => {
                const dataPath = error.dataPath ? error.dataPath : 'root';
                this._responseClient.setError(dataPath, error.message);
            });
        }
    }

    getApiDoc() {
        return yaml.safeLoad(fs.readFileSync(this._schemaPath, 'utf8'));
    }

    async dereferenceApiDoc(openapi) {
        const parser = await RefParser.dereference(openapi);
        return parser;
    }

    combineSchemas(requiredSchema, refSchema) {
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
