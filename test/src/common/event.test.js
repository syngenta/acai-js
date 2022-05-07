const {assert} = require('chai');
const DDBEvent = require('../../../src').dynamodb.Event;
const S3Event = require('../../../src').s3.Event;
const SQSEvent = require('../../../src').sqs.Event;
const mockDDBData = require('../../mocks/dynamodb/mock-data');
const mockSQSData = require('../../mocks/sqs/mock-data');
const mockS3Data = require('../../mocks/s3/mock-data');

describe('Test Generic Event', () => {
    describe('Test DynamoDB Event', () => {
        const ddbEvent = new DDBEvent(mockDDBData.getData(), {globalLogger: true});
        it('ddb: record object returned', () => {
            const {records} = ddbEvent;
            assert.equal(records[0].awsRegion, 'us-east-1');
        });
        it('ddb: rawRecords returned', () => {
            assert.deepEqual(ddbEvent.rawRecords, mockDDBData.getData().Records);
        });
    });
    describe('Test SQS Event', () => {
        const sqsEvent = new SQSEvent(mockSQSData.getData());
        it('sqs: record object returned', () => {
            const {records} = sqsEvent;
            assert.deepEqual(records[0].body, {status: 'ok'});
        });
        it('sqs: rawRecords returned', () => {
            assert.deepEqual(sqsEvent.rawRecords, mockSQSData.getData().Records);
        });
    });
    describe('Test S3 Event', () => {
        const s3Event = new S3Event(mockS3Data.getData(), {globalLogger: true});
        it('s3: record object returned', () => {
            const {records} = s3Event;
            assert.equal(records[0].awsRegion, 'us-east-1');
        });
        it('s3: rawRecords returned', () => {
            assert.deepEqual(s3Event.rawRecords, mockS3Data.getData().Records);
        });
    });
});
