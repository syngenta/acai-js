const {assert} = require('chai');
const RecordClient = require('../../../src').dynamodb.Record;
const mockData = require('../../mocks/dynamodb/mock-data');

describe('Test DynamoDB Record Client: src/dynamodb/record.js', () => {
    describe('test dynamoDB non-ttl stream', () => {
        const record = new RecordClient(mockData.getData().Records[0]);
        it('should have property for id', () => {
            assert.equal(record.id, '9a37c0d03eb60f7cf70cabc823de9907');
        });
        it('should have property for name', () => {
            assert.equal(record.name, 'INSERT');
        });
        it('should have property for source', () => {
            assert.deepEqual(record.source, 'aws:dynamodb');
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
        it('should have property for sourceARN', () => {
            assert.equal(
                record.sourceARN,
                'arn:aws:dynamodb:us-east-1:771875143460:table/test-example/stream/2019-10-04T23:18:26.340'
            );
        });
        it('should have property for version', () => {
            assert.equal(record.version, mockData.getData().Records[0].eventVersion);
        });
        it('should have property for streamType', () => {
            assert.equal(record.streamType, mockData.getData().Records[0].dynamodb.StreamViewType);
        });
        it('should have property for size', () => {
            assert.equal(record.size, mockData.getData().Records[0].dynamodb.SizeBytes);
        });
        it('should have property for created', () => {
            assert.equal(record.created, mockData.getData().Records[0].dynamodb.ApproximateCreationDateTime);
        });
        it('should have property for identity as null', () => {
            assert.equal(record.identity, mockData.getData().Records[0].dynamodb.userIdentity);
        });
        it('should have property for ttl as false', () => {
            assert.equal(record.expired, false);
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
        it('should have property for identity as object', () => {
            assert.deepEqual(record.identity, mockData.getTTLData().Records[0].userIdentity);
        });
        it('should have property for ttl as false', () => {
            assert.equal(record.expired, true);
        });
    });
});
