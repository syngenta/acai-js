const Logger = require('./logger.js');
const DynamoDBRecord = require('../dynamodb/record');
const Schema = require('./schema.js');
const SQSRecord = require('../sqs/record');
const S3Record = require('../s3/record');

class Event {
    constructor(event, params = {}) {
        this.__before = params.before;
        this.__requiredBody = params.requiredBody;
        this.__requiredAttributes = params.requiredAttributes;
        this.__schemaPath = params.schemaPath;
        this.__dataClass = params.dataClass;
        this.__getObject = params.getObject;
        this.__jsonObject = params.json;
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
        const records = this.__getRecords();
        this.__assignDataClass(records);
        return records;
    }

    get rawRecords() {
        return this.__event.Records;
    }

    async getRecordsAsync() {
        this.__validateAdvanceParams();
        const records = this.__getRecords();
        this.__validateRecords(records);
        await this.__runBeforeSync(records);
        this.__assignDataClass(records);
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
            records = [];
            for (const record of records) {
                const dataClass = new this.__dataClass(record);
                records.push(dataClass);
            }
        }
    }

    __validateBasicParams() {
        if (this.__before || this.__requiredBody || this.__getObject) {
            throw new Error('Must use Event.getRecordsAsync() with these params & await the records');
        }
    }

    __validateAdvanceParams() {
        if (typeof this.__requiredBody === 'string' && !this.__schemaPath) {
            throw new Error('Must provide schemaPath if using requireBody as a reference');
        }
        if (this.__jsonObject && !this.__getObject) {
            throw new Error('Must enable getObject if using expecting JSON from S3 object');
        }
    }

    async __validateRecords(records) {
        const schema = this.__schemaPath
            ? Schema.fromFilePath(this.__schemaPath)
            : Schema.fromInlineSchema(this.__requiredBody);
        const validator = new Validator(schema);
        for (const record of records) {
            const errors = validator.isValidRecord();
        }
        return records;
    }

    async __runBefore(records) {
        if (this.__before && typeof this.__before === 'function') {
            this.__before(records);
        }
    }
}

module.exports = Event;
