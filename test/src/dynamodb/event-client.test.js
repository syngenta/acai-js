const {assert} = require('chai');
const EventClient = require('../../../src').dynamodb.Event;
const mockData = require('./mockData');

describe('Test DynamoDB Event Client', async () => {
    const eventClient = await new EventClient(mockData.getData(), {globalLogger: true});
    describe('test constructor', () => {
        it('ddb: client took event', () => {
            assert.equal(true, '_event' in eventClient);
        });
    });
    describe('test records', () => {
        it('ddb: record object returned', () => {
            const {records} = eventClient;
            assert.equal(records[0].awsRegion, 'us-east-1');
        });
    });
    describe('test rawRecords', () => {
        it('ddb: rawRecords returned', () => {
            assert.deepEqual(eventClient.rawRecords, mockData.getData().Records);
        });
    });
});
