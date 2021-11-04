const {assert} = require('chai');
const RecordClient = require('../../src').dynamodb.Record;
const mockData = require('./mockData');

describe('Test DynamoDB Record Client', async () => {
    const record = new RecordClient(mockData.getData().Records[0]);
    describe('test constructor', () => {
        it('ddb: client took event', () => {
            assert.equal(true, '_record' in record);
        });
    });
    describe('test eventID', () => {
        it('ddb: eventID returned', () => {
            assert.equal(record.eventID, '9a37c0d03eb60f7cf70cabc823de9907');
        });
    });
    describe('test eventName', () => {
        it('ddb: eventName returned', () => {
            assert.equal(record.eventName, 'INSERT');
        });
    });
    describe('test eventSource', () => {
        it('ddb: eventSource returned', () => {
            assert.deepEqual(record.eventSource, 'aws:dynamodb');
        });
    });
    describe('test keys', () => {
        it('ddb: keys returned', () => {
            assert.deepEqual(record.keys, {example_id: '123456789'});
        });
    });
    describe('test oldImage', () => {
        it('ddb: oldImage returned', () => {
            assert.deepEqual(record.oldImage, {});
        });
    });
    describe('test newImage', () => {
        it('ddb: newImage returned', () => {
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
        it('ddb: eventSourceARN returned', () => {
            assert.equal(
                record.eventSourceARN,
                'arn:aws:dynamodb:us-east-1:771875143460:table/test-example/stream/2019-10-04T23:18:26.340'
            );
        });
    });
    describe('test eventVersion', () => {
        it('ddb: eventVersion returned', () => {
            assert.equal(record.eventVersion, mockData.getData().Records[0].eventVersion);
        });
    });
    describe('test streamViewType', () => {
        it('ddb: streamViewType returned', () => {
            assert.equal(record.streamViewType, mockData.getData().Records[0].dynamodb.StreamViewType);
        });
    });
    describe('test sizeBytes', () => {
        it('ddb: sizeBytes returned', () => {
            assert.equal(record.sizeBytes, mockData.getData().Records[0].dynamodb.SizeBytes);
        });
    });
    describe('test approximateCreationDateTime', () => {
        it('ddb: approximateCreationDateTime returned', () => {
            assert.equal(
                record.approximateCreationDateTime,
                mockData.getData().Records[0].dynamodb.ApproximateCreationDateTime
            );
        });
    });
});
