const fs = require('fs');
const Ajv = require('ajv/dist/2020');
const yaml = require('js-yaml');
const RefParser = require('json-schema-ref-parser');
const mergeAll = require('json-schema-merge-allof');

const defaultEnconding = 'utf8';

class Schema {
    static fromFilePath(schemaPath) {
        const openAPISchema = yaml.load(fs.readFileSync(schemaPath, defaultEnconding));
        return new Schema(openAPISchema);
    }

    constructor(openAPISchema) {
        this._refParser = RefParser;
        this._openAPISchema = openAPISchema;
        this._ajv = new Ajv({
            allErrors: true
        });
    }

    async validate(entityName, data) {
        const refSchema = await this._refParser.dereference(this._openAPISchema);
        const combinedSchema = await this._combineSchemas(entityName, refSchema);
        const validate = this._ajv.compile(combinedSchema);
        const result = validate(data);

        return {
            result,
            errors: validate.errors
        };
    }

    _getEntityRulesFromSchema(schemaComponentName, refSchema) {
        const schemaWithInlinedRefs = refSchema.components.schemas[schemaComponentName];
        if (!schemaWithInlinedRefs) {
            throw new Error(`Schema with name ${schemaComponentName} is not found`);
        }
        return schemaWithInlinedRefs;
    }

    async _combineSchemas(schemaComponentName, refSchema) {
        const schemaWithInlinedRefs = this._getEntityRulesFromSchema(schemaComponentName, refSchema);
        const schemaWithMergedAllOf = mergeAll(schemaWithInlinedRefs, {ignoreAdditionalProperties: true});
        schemaWithMergedAllOf.additionalProperties = false;
        return schemaWithMergedAllOf;
    }
}

module.exports = Schema;
