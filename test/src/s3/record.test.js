const {assert} = require('chai');
const RecordClient = require('../../../src').s3.Record;
const mockData = require('../../mocks/s3/mock-data');

describe('Test S3 Record Client', async () => {
    const record = new RecordClient(mockData.getData().Records[0]);
    describe('test properties', () => {
        it('should have property for record', () => {
            assert.deepEqual(record.record, mockData.getData().Records[0]);
        });
        it('should have property of name', () => {
            assert.equal(record.name, 'ObjectCreated:Put');
        });
        it('should have property of source', () => {
            assert.deepEqual(record.source, 'aws:s3');
        });
        it('should have property of time', () => {
            assert.deepEqual(record.time, '2018-09-20T21:10:13.821Z');
        });
        it('should have property of region', () => {
            assert.deepEqual(record.region, 'us-east-1');
        });
        it('should have property of request', () => {
            assert.deepEqual(record.request, {sourceIPAddress: '172.20.133.36'});
        });
        it('should have property of response', () => {
            assert.deepEqual(record.response, {
                'x-amz-request-id': '6B859DD0CE613FAE',
                'x-amz-id-2': 'EXLMfc9aiXZFzNwLKXpw35iaVvl/DkEA6GtbuxjfmuLN3kLPL/aGoa7NMSwpl3m7ICAtNbjJX4w='
            });
        });
        it('should have property of id', () => {
            assert.equal(record.id, 'exS3-v2--7cde234c7ff76c53c44990396aeddc6d');
        });
        it('should have property of object', () => {
            assert.deepEqual(record.object, {
                key: '123456789/3c8e97105d5f462f8896a7189910ee16-original.jpg',
                size: 17545,
                eTag: 'b79ac2ef68c08fa9ac6013d53038a26c',
                sequencer: '005BA40CB5BD42013A'
            });
        });
        it('should have property of object', () => {
            assert.equal(record.key, '123456789/3c8e97105d5f462f8896a7189910ee16-original.jpg');
        });
        it('should have property of bucket', () => {
            assert.deepEqual(record.bucket, {
                name: 'deploy-workers-poc-photos',
                ownerIdentity: {
                    principalId: 'A32KFL0DQ3MH8X'
                },
                arn: 'arn:aws:s3:::deploy-workers-poc-photos'
            });
        });
        it('should have property of version', () => {
            assert.equal(record.version, '1.0');
        });
        it('should have default property of true for is valid', () => {
            assert.equal(record.isValid, true);
        });
        it('should have operation as create', () => {
            assert.equal(record.operation, 'create');
        });
        it('should have operation as unknown', () => {
            const rawRecord = mockData.getData().Records[0];
            rawRecord.eventName = 's3:ObjectRemoved:Delete';
            const record = new RecordClient(rawRecord);
            assert.equal(record.operation, 'delete');
        });
        it('should have operation as unknown', () => {
            const rawRecord = mockData.getData().Records[0];
            rawRecord.eventName = 'ERROR';
            const record = new RecordClient(rawRecord);
            assert.equal(record.operation, 'unknown');
        });
    });
});
