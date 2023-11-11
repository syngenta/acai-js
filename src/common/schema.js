const fs = require('fs');
const Ajv = require('ajv/dist/2020');
const mergeAll = require('json-schema-merge-allof');
const yaml = require('js-yaml');
const Reva = require('@apideck/reva').Reva;
const RefParser = require('json-schema-ref-parser');

class Schema {
    constructor(openAPISchema = {}, inlineSchema = {}, params = {}) {
        this.__refParser = RefParser;
        this.__openApliValidator = new Reva();
        this.__schemaPath = params.schemaPath;
        this.__strictValidation = params.strictValidation || false;
        this.__ajv = new Ajv({allErrors: true, validateFormats: this.__strictValidation});
        this.inlineSchema = inlineSchema;
        this.openAPISchema = openAPISchema;
    }

    static fromFilePath(schemaPath, params = {}) {
        const openAPISchema = yaml.load(fs.readFileSync(schemaPath, 'utf8'));
        return new Schema(openAPISchema, {}, params);
    }

    static fromInlineSchema(inlineSchema, params = {}) {
        return new Schema({}, inlineSchema, params);
    }

    autoLoad() {
        this.loadSchema();
    }

    loadSchema() {
        if (this.__schemaPath) {
            this.openAPISchema = yaml.load(fs.readFileSync(this.__schemaPath, 'utf8'));
        }
    }

    async validateOpenApi(path, method, request) {
        this.loadSchema();
        const refSchema = await this.__refParser.dereference(this.openAPISchema);
        const operation = this.__getOperationSchema(refSchema, path, method);
        const result = this.__openApliValidator.validate({operation, request});
        return result.errors || [];
    }

    async validate(entityName = '', data = {}) {
        this.loadSchema();
        const schema = await this.__getSchemaObject(entityName);
        const ajvValidate = this.__ajv.compile(schema);
        await ajvValidate(data);
        return ajvValidate.errors;
    }

    async __getSchemaObject(entityName) {
        if (Object.keys(this.openAPISchema).length && entityName) {
            const refSchema = await this.__refParser.dereference(this.openAPISchema);
            return await this.__combineSchemas(entityName, refSchema);
        } else {
            return this.inlineSchema;
        }
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
