const fs = require('fs');
const Ajv = require('ajv/dist/2020');
const yaml = require('js-yaml');
const RefParser = require('json-schema-ref-parser');
const mergeAll = require('json-schema-merge-allof');

class SchemaValidator {
    constructor(openAPISchema) {
        this.__refParser = RefParser;
        this.__openAPISchema = openAPISchema;
        this.__ajv = new Ajv({allErrors: true});
    }

    static fromFilePath(schemaPath) {
        const openAPISchema = yaml.load(fs.readFileSync(schemaPath, 'utf8'));
        return new SchemaValidator(openAPISchema);
    }

    static fromObjectDefinition(schemaPath) {
        return new SchemaValidator(schemaPath);
    }

    async validate(entityName, data) {
        const refSchema = await this.__refParser.dereference(this.__openAPISchema);
        const combinedSchema = await this.__combineSchemas(entityName, refSchema);
        const ajvValidate = this.__ajv.compile(combinedSchema);
        await ajvValidate(data);
        return ajvValidate.errors;
    }

    __getEntityRulesFromSchema(schemaComponentName, refSchema) {
        const schemaWithInlinedRefs = refSchema.components.schemas[schemaComponentName];
        if (!schemaWithInlinedRefs) {
            throw new Error(`Schema with name ${schemaComponentName} is not found`);
        }
        return schemaWithInlinedRefs;
    }

    async __combineSchemas(schemaComponentName, refSchema) {
        const schemaWithInlinedRefs = this.__getEntityRulesFromSchema(schemaComponentName, refSchema);
        const schemaWithMergedAllOf = mergeAll(schemaWithInlinedRefs, {ignoreAdditionalProperties: true});
        schemaWithMergedAllOf.additionalProperties = false;
        return schemaWithMergedAllOf;
    }
}

module.exports = SchemaValidator;
