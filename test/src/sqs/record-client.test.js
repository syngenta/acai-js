const {assert} = require('chai');
const RecordClient = require('../../../src').sqs.Record;
const mockData = require('./mockData');

describe('Test SQS Record Client', async () => {
    const record = new RecordClient(mockData.getData().Records[0]);
    it('sqs: client took event', () => {
        assert.equal(true, '_record' in record);
    });
    it('sqs: messageId returned', () => {
        assert.equal(record.messageId, '19dd0b57-b21e-4ac1-bd88-01bbb068cb78');
    });
    it('sqs: receiptHandle returned', () => {
        assert.equal(record.receiptHandle, 'MessageReceiptHandle');
    });
    it('sqs: body returned', () => {
        assert.deepEqual(record.body, {status: 'ok'});
    });
    it('sqs: attributes returned', () => {
        assert.deepEqual(record.attributes, mockData.getData().Records[0].attributes);
    });
    it('sqs: messageAttributes returned', () => {
        assert.deepEqual(record.messageAttributes, mockData.getData().Records[0].messageAttributes);
    });
    it('sqs: messageAttributes with actual attributes returned', () => {
        const record = new RecordClient(mockData.getDataWithAttributes().Records[0]);
        assert.deepEqual(record.messageAttributes, {attribute: 'this is an attribute'});
    });
    it('sqs: md5 returned', () => {
        assert.equal(record.md5OfBody, mockData.getData().Records[0].md5OfBody);
    });
    it('sqs: source returned', () => {
        assert.equal(record.source, mockData.getData().Records[0].eventSource);
    });
    it('sqs: sourceARN returned', () => {
        assert.equal(record.sourceARN, mockData.getData().Records[0].eventSourceARN);
    });
    it('sqs: region returned', () => {
        assert.equal(record.region, mockData.getData().Records[0].awsRegion);
    });
});
