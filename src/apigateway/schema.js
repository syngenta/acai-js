const fs = require('fs');
const Ajv = require('ajv');
const yaml = require('js-yaml');
const RefParser = require('json-schema-ref-parser');

const defaultEnconding = 'utf8';

class Schema {
    static fromFilePath(schemaPath) {
        const openAPISchema = yaml.load(fs.readFileSync(schemaPath, defaultEnconding));
        return new Schema(openAPISchema);
    }

    constructor(openAPISchema) {
        this._openAPISchema = openAPISchema;
        this._ajv = new Ajv({allErrors: true});
    }

    async validate(entityName, data) {
        const refSchema = await RefParser.dereference(this._openAPISchema);
        const combinedSchema = await this._combineSchemas(entityName, refSchema);

        const result = this._ajv.validate(combinedSchema, data);

        return {
            result,
            errors: this._ajv.errors
        };
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

module.exports = Schema;
