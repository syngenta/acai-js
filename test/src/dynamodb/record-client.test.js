const {assert} = require('chai');
const RecordClient = require('../../../src').dynamodb.Record;
const mockData = require('../../mocks/dynamodb/mock-data');

describe('Test DynamoDB Record Client', async () => {
    describe('test dynamoDB non-ttl stream', async () => {
        const record = new RecordClient(mockData.getData().Records[0]);
        it('ddb: eventID returned', () => {
            assert.equal(record.eventID, '9a37c0d03eb60f7cf70cabc823de9907');
        });
        it('ddb: eventName returned', () => {
            assert.equal(record.eventName, 'INSERT');
        });
        it('ddb: eventSource returned', () => {
            assert.deepEqual(record.eventSource, 'aws:dynamodb');
        });
        it('ddb: keys returned', () => {
            assert.deepEqual(record.keys, {example_id: '123456789'});
        });
        it('ddb: oldImage returned', () => {
            assert.deepEqual(record.oldImage, {});
        });
        it('ddb: newImage returned', () => {
            assert.deepEqual(record.newImage, {
                example_id: '123456789',
                note: 'Hosrawguw verrig zogupap ce so fajdis vub mos sif mawpowpug kif kihane.',
                active: true,
                personal: {gender: 'male', last_name: 'Mcneil', first_name: 'Mannix'},
                transportation: ['public-transit', 'car-access']
            });
        });
        it('ddb: eventSourceARN returned', () => {
            assert.equal(
                record.eventSourceARN,
                'arn:aws:dynamodb:us-east-1:771875143460:table/test-example/stream/2019-10-04T23:18:26.340'
            );
        });
        it('ddb: eventVersion returned', () => {
            assert.equal(record.eventVersion, mockData.getData().Records[0].eventVersion);
        });
        it('ddb: streamViewType returned', () => {
            assert.equal(record.streamViewType, mockData.getData().Records[0].dynamodb.StreamViewType);
        });
        it('ddb: sizeBytes returned', () => {
            assert.equal(record.sizeBytes, mockData.getData().Records[0].dynamodb.SizeBytes);
        });
        it('ddb: approximateCreationDateTime returned', () => {
            assert.equal(
                record.approximateCreationDateTime,
                mockData.getData().Records[0].dynamodb.ApproximateCreationDateTime
            );
        });
        it('ddb: userIdentity returned null', () => {
            assert.equal(record.userIdentity, mockData.getData().Records[0].dynamodb.userIdentity);
        });
        it('ddb: timeToLiveExpired returned false', () => {
            assert.equal(record.timeToLiveExpired, false);
        });
    });
    describe('test dynamoDB ttl stream', async () => {
        const record = new RecordClient(mockData.getTTLData().Records[0]);
        it('ddb: userIdentity returned object', () => {
            assert.deepEqual(record.userIdentity, mockData.getTTLData().Records[0].userIdentity);
        });
        it('ddb: timeToLiveExpired returned true', () => {
            assert.equal(record.timeToLiveExpired, true);
        });
    });
});
