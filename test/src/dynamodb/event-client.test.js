const {assert} = require('chai');
const EventClient = require('../../../src').dynamodb.Event;
const mockData = require('../../mocks/dynamodb/mock-data');

describe('Test DynamoDB Event Client', async () => {
    const eventClient = await new EventClient(mockData.getData(), {globalLogger: true});
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
