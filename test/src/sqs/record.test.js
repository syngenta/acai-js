const {assert} = require('chai');
const RecordClient = require('../../../src').sqs.Record;
const mockData = require('../../mocks/sqs/mock-data');

describe('Test SQS Record Client', async () => {
    describe('basic positive tests', async () => {
        const record = new RecordClient(mockData.getData().Records[0]);
        it('should have property of id', () => {
            assert.equal(record.id, '19dd0b57-b21e-4ac1-bd88-01bbb068cb78');
        });
        it('should have property of receipt', () => {
            assert.equal(record.receiptHandle, 'MessageReceiptHandle');
        });
        it('should have property of body', () => {
            assert.deepEqual(record.body, {status: 'ok'});
        });
        it('should have property of attributes', () => {
            assert.deepEqual(record.attributes, mockData.getData().Records[0].attributes);
        });
        it('should have property of messageAttributes', () => {
            assert.deepEqual(record.messageAttributes, mockData.getData().Records[0].messageAttributes);
        });
        it('should have property of messageAttributes with actual attributes', () => {
            const record = new RecordClient(mockData.getDataWithAttributes().Records[0]);
            assert.deepEqual(record.messageAttributes, {attribute: 'this is an attribute'});
        });
        it('should have property of md5', () => {
            assert.equal(record.md5, mockData.getData().Records[0].md5OfBody);
        });
        it('should have property of source', () => {
            assert.equal(record.source, mockData.getData().Records[0].eventSource);
        });
        it('should have property of sourceARN', () => {
            assert.equal(record.sourceARN, mockData.getData().Records[0].eventSourceARN);
        });
        it('should have property of region', () => {
            assert.equal(record.region, mockData.getData().Records[0].awsRegion);
        });
        it('should have default property of true for is valid', () => {
            assert.equal(record.isValid, true);
        });
        it('should be able to mutate property', () => {
            record.isValid = false;
            assert.equal(record.isValid, false);
        });
        it('should have operation as create', () => {
            assert.equal(record.operation, 'create');
        });
    });
    describe('basic negative tests', async () => {
        const record = new RecordClient(mockData.getNonJsonData().Records[0]);
        it('should have property of body', () => {
            assert.deepEqual(record.body, {status: 'ok'});
        });
        it('should have property of raw body', () => {
            assert.deepEqual(record.raw, {status: 'ok'});
        });
    });
});
