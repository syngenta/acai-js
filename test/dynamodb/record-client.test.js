const {assert} = require('chai');
const RecordClient = require('../../src').dynamodb.Record;
const mockData = require('./mockData');

describe('Test DynamoDB Record Client', async () => {
    const record = new RecordClient(mockData.getData().Records[0]);
    describe('test constructor', () => {
        it('client took event', () => {
            assert.equal(true, '_record' in record);
        });
    });
    describe('test eventID', () => {
        it('eventID returned', () => {
            assert.equal(record.eventID, '9a37c0d03eb60f7cf70cabc823de9907');
        });
    });
    describe('test eventName', () => {
        it('eventName returned', () => {
            assert.equal(record.eventName, 'INSERT');
        });
    });
    describe('test eventSource', () => {
        it('eventSource returned', () => {
            assert.deepEqual(record.eventSource, 'aws:dynamodb');
        });
    });
    describe('test keys', () => {
        it('keys returned', () => {
            assert.deepEqual(record.keys, {example_id: '123456789'});
        });
    });
    describe('test oldImage', () => {
        it('oldImage returned', () => {
            assert.deepEqual(record.oldImage, {});
        });
    });
    describe('test newImage', () => {
        it('newImage returned', () => {
            assert.deepEqual(record.newImage, {
                example_id: '123456789',
                note: 'Hosrawguw verrig zogupap ce so fajdis vub mos sif mawpowpug kif kihane.',
                active: true,
                personal: {gender: 'male', last_name: 'Mcneil', first_name: 'Mannix'},
                transportation: ['public-transit', 'car-access']
            });
        });
    });
    describe('test eventSourceARN', () => {
        it('eventSourceARN returned', () => {
            assert.equal(
                record.eventSourceARN,
                'arn:aws:dynamodb:us-east-1:771875143460:table/test-example/stream/2019-10-04T23:18:26.340'
            );
        });
    });
    describe('test eventVersion', () => {
        it('eventVersion returned', () => {
            assert.equal(record.eventVersion, mockData.getData().Records[0].eventVersion);
        });
    });
    describe('test streamViewType', () => {
        it('streamViewType returned', () => {
            assert.equal(record.streamViewType, mockData.getData().Records[0].dynamodb.StreamViewType);
        });
    });
    describe('test sizeBytes', () => {
        it('sizeBytes returned', () => {
            assert.equal(record.sizeBytes, mockData.getData().Records[0].dynamodb.SizeBytes);
        });
    });
    describe('test approximateCreationDateTime', () => {
        it('approximateCreationDateTime returned', () => {
            assert.equal(
                record.approximateCreationDateTime,
                mockData.getData().Records[0].dynamodb.ApproximateCreationDateTime
            );
        });
    });
});
