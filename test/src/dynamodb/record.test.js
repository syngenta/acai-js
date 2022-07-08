const {assert} = require('chai');
const RecordClient = require('../../../src').dynamodb.Record;
const mockData = require('../../mocks/dynamodb/mock-data');

describe('Test DynamoDB Record Client: src/dynamodb/record.js', () => {
    describe('test dynamoDB non-ttl stream', () => {
        const record = new RecordClient(mockData.getData().Records[0]);
        it('should have property for eventID', () => {
            assert.equal(record.eventID, '9a37c0d03eb60f7cf70cabc823de9907');
        });
        it('should have property for eventName', () => {
            assert.equal(record.eventName, 'INSERT');
        });
        it('should have property for eventSource', () => {
            assert.deepEqual(record.eventSource, 'aws:dynamodb');
        });
        it('should have property for keys', () => {
            assert.deepEqual(record.keys, {example_id: '123456789'});
        });
        it('should have property for old image', () => {
            assert.deepEqual(record.oldImage, {});
        });
        it('should have default property of true for is valid', () => {
            assert.equal(record.isValid, true);
        });
        it('should have property for new image', () => {
            assert.deepEqual(record.newImage, {
                example_id: '123456789',
                note: 'Hosrawguw verrig zogupap ce so fajdis vub mos sif mawpowpug kif kihane.',
                active: true,
                personal: {gender: 'male', last_name: 'Mcneil', first_name: 'Mannix'},
                transportation: ['public-transit', 'car-access']
            });
        });
        it('should have property for body (which is new image)', () => {
            assert.deepEqual(record.body, {
                example_id: '123456789',
                note: 'Hosrawguw verrig zogupap ce so fajdis vub mos sif mawpowpug kif kihane.',
                active: true,
                personal: {gender: 'male', last_name: 'Mcneil', first_name: 'Mannix'},
                transportation: ['public-transit', 'car-access']
            });
        });
        it('should have property for eventSourceARN', () => {
            assert.equal(
                record.eventSourceARN,
                'arn:aws:dynamodb:us-east-1:771875143460:table/test-example/stream/2019-10-04T23:18:26.340'
            );
        });
        it('should have property for eventVersion', () => {
            assert.equal(record.eventVersion, mockData.getData().Records[0].eventVersion);
        });
        it('should have property for streamViewType', () => {
            assert.equal(record.streamViewType, mockData.getData().Records[0].dynamodb.StreamViewType);
        });
        it('should have property for sizeBytes', () => {
            assert.equal(record.sizeBytes, mockData.getData().Records[0].dynamodb.SizeBytes);
        });
        it('should have property for approximateCreationDateTime', () => {
            assert.equal(
                record.approximateCreationDateTime,
                mockData.getData().Records[0].dynamodb.ApproximateCreationDateTime
            );
        });
        it('should have property for userIdentity as null', () => {
            assert.equal(record.userIdentity, mockData.getData().Records[0].dynamodb.userIdentity);
        });
        it('should have property for ttl as false', () => {
            assert.equal(record.timeToLiveExpired, false);
        });
        it('should have operation as create', () => {
            assert.equal(record.operation, 'create');
        });
        it('should have operation as unknown', () => {
            const rawRecord = mockData.getData().Records[0];
            delete rawRecord.dynamodb.OldImage;
            delete rawRecord.dynamodb.NewImage;
            const record = new RecordClient(rawRecord);
            assert.equal(record.operation, 'unknown');
        });
    });
    describe('test dynamoDB ttl stream', () => {
        const record = new RecordClient(mockData.getTTLData().Records[0]);
        it('should have property for userIdentity as object', () => {
            assert.deepEqual(record.userIdentity, mockData.getTTLData().Records[0].userIdentity);
        });
        it('should have property for ttl as false', () => {
            assert.equal(record.timeToLiveExpired, true);
        });
    });
});
