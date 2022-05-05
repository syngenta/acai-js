const {assert} = require('chai');
const EventClient = require('../../../src').s3.Event;
const mockData = require('../../mocks/s3/mock-data');

describe('Test S3 Event Client', async () => {
    const eventClient = await new EventClient(mockData.getData(), {globalLogger: true});
    describe('test constructor', () => {
        it('s3: client took event', () => {
            assert.equal(true, '_event' in eventClient);
        });
    });
    describe('test records', () => {
        it('s3: record object returned', () => {
            const {records} = eventClient;
            assert.equal(records[0].awsRegion, 'us-east-1');
        });
    });
    describe('test rawRecords', () => {
        it('s3: rawRecords returned', () => {
            assert.deepEqual(eventClient.rawRecords, mockData.getData().Records);
        });
    });
});
