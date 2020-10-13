const {assert} = require('chai');
const RecordClient = require('../../src').sqs.Record;
const mockData = require('./mockData');

describe('Test SQS Record Client', async () => {
    const record = new RecordClient(mockData.getData().Records[0]);
    describe('test constructor', () => {
        it('client took event', () => {
            assert.equal(true, '_record' in record);
        });
    });
    describe('test messageId', () => {
        it('messageId returned', () => {
            assert.equal(record.messageId, '19dd0b57-b21e-4ac1-bd88-01bbb068cb78');
        });
    });
    describe('test receiptHandle', () => {
        it('receiptHandle returned', () => {
            assert.equal(record.receiptHandle, 'MessageReceiptHandle');
        });
    });
    describe('test body', () => {
        it('body returned', () => {
            assert.deepEqual(record.body, {status: 'ok'});
        });
    });
    describe('test attributes', () => {
        it('attributes returned', () => {
            assert.deepEqual(record.attributes, mockData.getData().Records[0].attributes);
        });
    });
    describe('test messageAttributes', () => {
        it('messageAttributes returned', () => {
            assert.deepEqual(record.messageAttributes, mockData.getData().Records[0].messageAttributes);
        });
    });
    describe('test messageAttributes', () => {
        it('messageAttributes returned', () => {
            assert.equal(record.md5OfBody, mockData.getData().Records[0].md5OfBody);
        });
    });
    describe('test source', () => {
        it('source returned', () => {
            assert.equal(record.source, mockData.getData().Records[0].eventSource);
        });
    });
    describe('test sourceARN', () => {
        it('sourceARN returned', () => {
            assert.equal(record.sourceARN, mockData.getData().Records[0].eventSourceARN);
        });
    });
    describe('test region', () => {
        it('region returned', () => {
            assert.equal(record.region, mockData.getData().Records[0].awsRegion);
        });
    });
});
