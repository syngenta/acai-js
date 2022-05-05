const {assert} = require('chai');
const EventClient = require('../../../src').sqs.Event;
const mockData = require('./mockData');

describe('Test SQS Event Client', async () => {
    const eventClient = await new EventClient(mockData.getData());
    describe('test constructor', () => {
        it('sqs: client took event', () => {
            assert.equal(true, '_event' in eventClient);
        });
    });
    describe('test records', () => {
        it('sqs: record object returned', () => {
            const {records} = eventClient;
            assert.deepEqual(records[0].body, {status: 'ok'});
        });
    });
    describe('test rawRecords', () => {
        it('sqs: rawRecords returned', () => {
            assert.deepEqual(eventClient.rawRecords, mockData.getData().Records);
        });
    });
});
