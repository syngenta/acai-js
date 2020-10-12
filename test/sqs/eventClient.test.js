const {assert} = require('chai');
const EventClient = require('../../src').sqs.Event;
const mockData = require('./mockData');

describe('Test Event Client', async () => {
    const eventClient = await new EventClient(mockData.getData());
    describe('test constructor', () => {
        it('client took event', () => {
            eventClient.should.have.property('_event');
        });
    });
    describe('test records', () => {
        it('record object returned', () => {
            const {records} = eventClient;
            assert.deepEqual(records[0].body, {status: 'ok'});
        });
    });
    describe('test rawRecords', () => {
        it('rawRecords returned', () => {
            assert.deepEqual(eventClient.rawRecords, mockData.getData().Records);
        });
    });
});
