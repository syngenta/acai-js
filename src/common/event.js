const Logger = require('../common/logger.js');
const DynamoDBRecord = require('../dynamodb/record');
const SQSRecord = require('../sqs/record');
const S3Record = require('../s3/record');

class Event {
    constructor(event, params = {}) {
        this.__event = event;
        this.__clients = {
            'aws:s3': S3Record,
            'aws:sqs': SQSRecord,
            'aws:dynamodb': DynamoDBRecord
        };
        Logger.setUpLogger(params.globalLogger);
    }

    get records() {
        const records = [];
        for (const record of this.__event.Records) {
            const source = record.eventSource;
            const client = new this.__clients[source](record);
            records.push(client);
        }
        return records;
    }

    get rawRecords() {
        return this.__event.Records;
    }
}

module.exports = Event;
