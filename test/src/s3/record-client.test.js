const {assert} = require('chai');
const RecordClient = require('../../../src').s3.Record;
const mockData = require('../../mocks/s3/mock-data');

describe('Test S3 Record Client', async () => {
    const record = new RecordClient(mockData.getData().Records[0]);
    describe('test eventName', () => {
        it('s3: eventName returned', () => {
            assert.equal(record.eventName, 'ObjectCreated:Put');
        });
    });
    describe('test eventSource', () => {
        it('s3: eventSource returned', () => {
            assert.deepEqual(record.eventSource, 'aws:s3');
        });
    });
    describe('test eventTime', () => {
        it('s3: eventTime returned', () => {
            assert.deepEqual(record.eventTime, '2018-09-20T21:10:13.821Z');
        });
    });
    describe('test awsRegion', () => {
        it('s3: awsRegion returned', () => {
            assert.deepEqual(record.awsRegion, 'us-east-1');
        });
    });
    describe('test requestParameters', () => {
        it('s3: requestParameters returned', () => {
            assert.deepEqual(record.requestParameters, {sourceIPAddress: '172.20.133.36'});
        });
    });
    describe('test responseElements', () => {
        it('s3: responseElements returned', () => {
            assert.deepEqual(record.responseElements, {
                'x-amz-request-id': '6B859DD0CE613FAE',
                'x-amz-id-2': 'EXLMfc9aiXZFzNwLKXpw35iaVvl/DkEA6GtbuxjfmuLN3kLPL/aGoa7NMSwpl3m7ICAtNbjJX4w='
            });
        });
    });
    describe('test configurationId', () => {
        it('s3: configurationId returned', () => {
            assert.equal(record.configurationId, 'exS3-v2--7cde234c7ff76c53c44990396aeddc6d');
        });
    });
    describe('test object', () => {
        it('s3: object returned', () => {
            assert.deepEqual(record.object, {
                key: '123456789/3c8e97105d5f462f8896a7189910ee16-original.jpg',
                size: 17545,
                eTag: 'b79ac2ef68c08fa9ac6013d53038a26c',
                sequencer: '005BA40CB5BD42013A'
            });
        });
    });
    describe('test key', () => {
        it('s3: object returned', () => {
            assert.equal(record.key, '123456789/3c8e97105d5f462f8896a7189910ee16-original.jpg');
        });
    });
    describe('test bucket', () => {
        it('s3: bucket returned', () => {
            assert.deepEqual(record.bucket, {
                name: 'deploy-workers-poc-photos',
                ownerIdentity: {
                    principalId: 'A32KFL0DQ3MH8X'
                },
                arn: 'arn:aws:s3:::deploy-workers-poc-photos'
            });
        });
    });
    describe('test s3SchemaVersion', () => {
        it('s3: s3SchemaVersion returned', () => {
            assert.equal(record.s3SchemaVersion, '1.0');
        });
    });
});
