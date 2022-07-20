const fs = require('fs');
const Ajv = require('ajv/dist/2020');
const mergeAll = require('json-schema-merge-allof');
const yaml = require('js-yaml');
const Reva = require('@apideck/reva').Reva;
const RefParser = require('json-schema-ref-parser');

class Schema {
    constructor(openAPISchema = {}, inlineSchema = {}, params = {}) {
        this.__refParser = RefParser;
        this.__openAPISchema = openAPISchema;
        this.__openApliValidator = new Reva();
        this.__inlineSchema = inlineSchema;
        this.__strictValidation = params.strictValidation || false;
        this.__ajv = new Ajv({allErrors: true, validateFormats: this.__strictValidation});
    }

    static fromFilePath(schemaPath, params = {}) {
        const openAPISchema = yaml.load(fs.readFileSync(schemaPath, 'utf8'));
        return new Schema(openAPISchema, {}, params);
    }

    static fromInlineSchema(inlineSchema, params = {}) {
        return new Schema({}, inlineSchema, params);
    }

    async validateOpenApi(path, method, request) {
        const refSchema = await this.__refParser.dereference(this.__openAPISchema);
        const operation = this.__getOperationSchema(refSchema, path, method);
        const result = this.__openApliValidator.validate({operation, request});
        return result.errors || [];
    }

    async validate(entityName = '', data = {}) {
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
        schemaWithMergedAllOf.additionalProperties = !this.__strictValidation;
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

    __getOperationSchema(refSchema, path, method) {
        try {
            const operation = refSchema.paths[path][method];
            if (!operation) {
                throw new Error();
            }
            return operation;
        } catch (error) {
            throw new Error(`problem with importing your schema for ${method}::${path}: ${error}`);
        }
    }
}

module.exports = Schema;
