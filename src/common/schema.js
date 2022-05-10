const fs = require('fs');
const Ajv = require('ajv/dist/2020');
const yaml = require('js-yaml');
const RefParser = require('json-schema-ref-parser');
const mergeAll = require('json-schema-merge-allof');

class Schema {
    constructor(openAPISchema = {}, inlineSchema = {}) {
        this.__refParser = RefParser;
        this.__openAPISchema = openAPISchema;
        this.__inlineSchema = inlineSchema;
        this.__ajv = new Ajv({allErrors: true});
    }

    static fromFilePath(schemaPath) {
        const openAPISchema = yaml.load(fs.readFileSync(schemaPath, 'utf8'));
        return new Schema(openAPISchema);
    }

    static fromInlineSchema(inlineSchema) {
        return new Schema({}, inlineSchema);
    }

    async validate(entityName = '', data) {
        let schema = {};
        if (this.__openAPISchema && entityName) {
            const refSchema = await this.__refParser.dereference(this.__openAPISchema);
            schema = await this.__combineSchemas(entityName, refSchema);
        } else {
            schema = this.__inlineSchema;
        }
        const ajvValidate = this.__ajv.compile(schema);
        await ajvValidate(data);
        return ajvValidate.errors;
    }

    __combineSchemas(schemaComponentName, refSchema) {
        const schemaWithInlinedRefs = this.__getEntityRulesFromSchema(schemaComponentName, refSchema);
        const schemaWithMergedAllOf = mergeAll(schemaWithInlinedRefs, {ignoreAdditionalProperties: true});
        schemaWithMergedAllOf.additionalProperties = false;
        return schemaWithMergedAllOf;
    }

    __getEntityRulesFromSchema(schemaComponentName, refSchema) {
        if (refSchema && refSchema.components && refSchema.components.schemas) {
            const schemaWithInlinedRefs = refSchema.components.schemas[schemaComponentName];
            if (schemaWithInlinedRefs) {
                return schemaWithInlinedRefs;
            }
        }
        throw new Error(`Schema with name ${schemaComponentName} is not found`);
    }
}

module.exports = Schema;
