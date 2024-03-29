const AWS = require('aws-sdk');
const CSV = require('csv-parse/sync');
const Logger = require('./logger.js');
const DynamoDBRecord = require('../dynamodb/record');
const Schema = require('./schema.js');
const SQSRecord = require('../sqs/record');
const S3Record = require('../s3/record');
const Validator = require('./validator');

class Event {
    constructor(event, params = {}) {
        this.__params = params;
        this.__before = params.before;
        this.__requiredBody = params.requiredBody;
        this.__schemaPath = params.schemaPath;
        this.__dataClass = params.dataClass;
        this.__getObject = params.getObject;
        this.__isJSON = params.isJSON;
        this.__isCSV = params.isCSV;
        this.__csvParser = CSV.parse;
        this.__operations = params.operations || ['create', 'update', 'delete'];
        this.__validationError = params.validationError === undefined ? true : params.validationError;
        this.__operationError = params.operationError === undefined ? false : params.operationError;
        this.__event = event;
        this.__clients = {
            'aws:s3': S3Record,
            'aws:sqs': SQSRecord,
            'aws:dynamodb': DynamoDBRecord
        };
        Logger.setUpGlobal(params.globalLogger);
    }

    get records() {
        this.__validateBasicParams();
        let records = this.__getRecords();
        records = this.__filterOperationRecords(records);
        records = this.__assignDataClass(records);
        return records;
    }

    get rawRecords() {
        return this.__event.Records;
    }

    async getRecords() {
        this.__validateAdvanceParams();
        let records = this.__getRecords();
        records = await this.__getObjectFromS3(records);
        await this.__validateRecords(records);
        await this.__runBefore(records);
        records = this.__filterValidRecords(records);
        records = this.__filterOperationRecords(records);
        records = this.__assignDataClass(records);
        return records;
    }

    __getRecords() {
        const records = [];
        for (const record of this.__event.Records) {
            const source = record.eventSource;
            const client = new this.__clients[source](record);
            records.push(client);
        }
        return records;
    }

    __assignDataClass(records) {
        if (this.__dataClass) {
            const dataClassRecords = [];
            for (const record of records) {
                const dataClass = new this.__dataClass(record);
                dataClassRecords.push(dataClass);
            }
            return dataClassRecords;
        }
        return records;
    }

    __filterValidRecords(records) {
        const validRecords = [];
        for (const record of records) {
            if (record.isValid) {
                validRecords.push(record);
            }
        }
        return validRecords;
    }

    __filterOperationRecords(records) {
        const operationRecords = [];
        for (const record of records) {
            if (this.__operations.includes(record.operation)) {
                operationRecords.push(record);
            } else if (this.__operationError) {
                throw new Error(`record is operation: ${record.operation}; only allowed ${this.__operations.join(',')}`);
            }
        }
        return operationRecords;
    }

    __validateBasicParams() {
        if (this.__before || this.__requiredBody || this.__getObject) {
            throw new Error('Must use Event.getRecords() with these params & await the records');
        }
        if (!Array.isArray(this.__operations)) {
            throw new Error('operations must be an array, exclusively containing create, update, delete');
        }
    }

    __validateAdvanceParams() {
        if (typeof this.__requiredBody === 'string' && !this.__schemaPath) {
            throw new Error('Must provide schemaPath if using requireBody as a reference');
        }
        if (this.__isJSON && !this.__getObject) {
            throw new Error('Must enable getObject if using expecting JSON from S3 object');
        }
    }

    async __getObjectFromS3(records) {
        if (this.__getObject) {
            const s3 = new AWS.S3();
            const s3Records = [];
            for (const record of records) {
                if (record.source === 'aws:s3') {
                    const s3Object = await s3.getObject({Bucket: record.bucket.name, Key: record.key}).promise();
                    if (this.__isJSON) {
                        record.body = JSON.parse(s3Object.Body.toString('utf-8'));
                    } else if (this.__isCSV) {
                        record.body = this.__csvParser(s3Object.Body.toString('utf-8'), {columns: true, relax_quotes: true});
                    } else {
                        record.body = s3Object;
                    }
                    s3Records.push(record);
                }
            }
            return s3Records;
        }
        return records;
    }

    async __validateRecords(records) {
        const schema = this.__schemaPath
            ? Schema.fromFilePath(this.__schemaPath, this.__params)
            : Schema.fromInlineSchema(this.__requiredBody, this.__params);
        const entityName = typeof this.__requiredBody === 'string' ? this.__requiredBody : null;
        const validator = new Validator(schema, this.__validationError);
        for (const record of records) {
            record.isValid = await validator.validateWithRequirementsRecord(entityName, record);
        }
    }

    async __runBefore(records) {
        if (this.__before && typeof this.__before === 'function') {
            this.__before(records);
        }
    }
}

module.exports = Event;
