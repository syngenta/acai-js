const {assert} = require('chai');
const DDBEvent = require('../../../src').dynamodb.Event;
const S3Event = require('../../../src').s3.Event;
const SQSEvent = require('../../../src').sqs.Event;
const mockDDBData = require('../../mocks/dynamodb/mock-data');
const mockSQSData = require('../../mocks/sqs/mock-data');
const mockS3Data = require('../../mocks/s3/mock-data');

describe('Test Generic Basic Event: src/common/event.js', () => {
    describe('Test DynamoDB Event', () => {
        const ddbEvent = new DDBEvent(mockDDBData.getData(), {globalLogger: true});
        it('should return ddb object with region', () => {
            const {records} = ddbEvent;
            assert.equal(records[0].awsRegion, 'us-east-1');
        });
        it('should return all raw records', () => {
            assert.deepEqual(ddbEvent.rawRecords, mockDDBData.getData().Records);
        });
    });
    describe('Test SQS Event', () => {
        const sqsEvent = new SQSEvent(mockSQSData.getData());
        it('it should return sqs body as an object', () => {
            const {records} = sqsEvent;
            assert.deepEqual(records[0].body, {status: 'ok'});
        });
        it('it should return all raw records', () => {
            assert.deepEqual(sqsEvent.rawRecords, mockSQSData.getData().Records);
        });
    });
    describe('Test S3 Event', () => {
        const s3Event = new S3Event(mockS3Data.getData(), {globalLogger: true});
        it('should return s3 record with region', () => {
            const {records} = s3Event;
            assert.equal(records[0].awsRegion, 'us-east-1');
        });
        it('should return all raw records', () => {
            assert.deepEqual(s3Event.rawRecords, mockS3Data.getData().Records);
        });
    });
});
