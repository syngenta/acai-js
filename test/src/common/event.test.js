const AWS = require('aws-sdk-mock');
const {assert} = require('chai');
const sinon = require('sinon');
const DDBEvent = require('../../../src').dynamodb.Event;
const S3Event = require('../../../src').s3.Event;
const SQSEvent = require('../../../src').sqs.Event;
const mockDDBData = require('../../mocks/dynamodb/mock-data');
const mockSQSData = require('../../mocks/sqs/mock-data');
const mockS3Data = require('../../mocks/s3/mock-data');

describe('Test Generic Event with Basic Settings: src/common/event.js', () => {
    describe('Test DynamoDB Event with Basic Settings', () => {
        const ddbEvent = new DDBEvent(mockDDBData.getData(), {globalLogger: true});
        it('should return ddb object with region', () => {
            const {records} = ddbEvent;
            assert.equal(records[0].awsRegion, 'us-east-1');
        });
        it('should return all raw records', () => {
            assert.deepEqual(ddbEvent.rawRecords, mockDDBData.getData().Records);
        });
        it('should throw error when calling operations not as an array', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                operations: 'create'
            });
            try {
                const records = await ddbEvent.records;
            } catch (error) {
                assert.equal(
                    error.message,
                    'operations must be an array, exclusively containing create, update, delete'
                );
            }
        });
    });
    describe('Test SQS Event with Basic Settings', () => {
        const sqsEvent = new SQSEvent(mockSQSData.getData());
        it('it should return sqs body as an object', () => {
            const {records} = sqsEvent;
            assert.deepEqual(records[0].body, {status: 'ok'});
        });
        it('it should return all raw records', () => {
            assert.deepEqual(sqsEvent.rawRecords, mockSQSData.getData().Records);
        });
    });
    describe('Test S3 Event with Basic Settings', () => {
        const s3Event = new S3Event(mockS3Data.getData(), {globalLogger: true});
        it('should return s3 record with region', () => {
            const {records} = s3Event;
            assert.equal(records[0].awsRegion, 'us-east-1');
        });
        it('should return all raw records', () => {
            assert.deepEqual(s3Event.rawRecords, mockS3Data.getData().Records);
        });
    });
});

describe('Test Generic Event with Advance Settings: src/common/event.js', () => {
    describe('Test Event with Advance Settings', () => {
        class DataClass {
            constructor(record) {
                this.record = record;
            }
        }
        it('should return records even with before function defined', async () => {
            const spyFn = sinon.fake();
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                before: spyFn
            });
            const records = await ddbEvent.getRecords();
            assert.equal(spyFn.callCount, 1);
        });
        it('should return records with schemaPath validation', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                requiredBody: 'v1-ddb-record',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 1);
        });
        it('should throw error with schemaPath validation', async () => {
            const mock = mockDDBData.getData();
            const ddbEvent = new DDBEvent(mock, {
                globalLogger: true,
                requiredBody: 'v1-ddb-record-fail',
                schemaPath: 'test/mocks/openapi.yml',
                strict: true
            });
            try {
                const records = await ddbEvent.getRecords();
            } catch (error) {
                assert.equal(
                    error.message,
                    '[{"path":"root","message":"must NOT have additional properties"},{"path":"/active","message":"must be number"}]'
                );
            }
        });
        it('should return records with requiredBody as object', async () => {
            const requiredBody = {
                type: 'object',
                required: ['example_id', 'note', 'active', 'personal', 'transportation'],
                additionalProperties: false,
                properties: {
                    example_id: {
                        type: 'string'
                    },
                    note: {
                        type: 'string'
                    },
                    active: {
                        type: 'boolean'
                    },
                    personal: {
                        type: 'object',
                        properties: {
                            gender: {
                                type: 'string'
                            },
                            last_name: {
                                type: 'string'
                            },
                            first_name: {
                                type: 'string'
                            }
                        }
                    },
                    transportation: {
                        type: 'array'
                    }
                }
            };
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                requiredBody
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 1);
        });
        it('should throw error with recordBody as object', async () => {
            const requiredBody = {
                type: 'object',
                required: ['example_id', 'note', 'active', 'personal', 'transportation'],
                additionalProperties: false,
                properties: {
                    example_id: {
                        type: 'string'
                    },
                    note: {
                        type: 'string'
                    },
                    active: {
                        type: 'number'
                    },
                    transportation: {
                        type: 'array'
                    }
                }
            };
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                requiredBody
            });
            try {
                const records = await ddbEvent.getRecords();
            } catch (error) {
                assert.equal(
                    error.message,
                    '[{"path":"root","message":"must NOT have additional properties"},{"path":"/active","message":"must be number"}]'
                );
            }
        });
        it('should throw error with when not including schemaPath', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                requiredBody: 'v1-ddb-record-fail'
            });
            try {
                const records = await ddbEvent.getRecords();
            } catch (error) {
                assert.equal(error.message, 'Must provide schemaPath if using requireBody as a reference');
            }
        });
        it('should throw error with calling wrong records with advance params', async () => {
            const spyFn = sinon.fake();
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                before: spyFn
            });
            try {
                const records = await ddbEvent.records;
            } catch (error) {
                assert.equal(error.message, 'Must use Event.getRecords() with these params & await the records');
            }
        });
        it('should assign dataClass', () => {
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                dataClass: DataClass
            });
            assert.isTrue(ddbEvent.records[0] instanceof DataClass);
        });
        it('should run ddb event when combined with all advance settings', async () => {
            const spyFn = sinon.fake();
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                before: spyFn,
                dataClass: DataClass,
                requiredBody: 'v1-ddb-record',
                schemaPath: 'test/mocks/openapi.yml'
            });
            const records = await ddbEvent.getRecords();
            assert.equal(spyFn.callCount, 1);
            assert.isTrue(records[0] instanceof DataClass);
        });
        it('should throw error when jsonObject is activated by getObject is not', async () => {
            const s3Event = new S3Event(mockS3Data.getData(), {jsonObject: true});
            try {
                const records = await s3Event.getRecords();
            } catch (error) {
                assert.equal(error.message, 'Must enable getObject if using expecting JSON from S3 object');
            }
        });
        it('should get object when getObject is activated', async () => {
            AWS.mock('S3', 'getObject', {
                Body: Buffer.from(require('fs').readFileSync('./test/mocks/s3/mock-object.json'))
            });
            const s3Event = new S3Event(mockS3Data.getJsonData(), {getObject: true});
            const records = await s3Event.getRecords();
            assert.isTrue(records[0].body.Body instanceof Buffer);
        });
        it('should get object and parse JSON when getObject and jsonObject is activated', async () => {
            AWS.mock('S3', 'getObject', {
                Body: Buffer.from(require('fs').readFileSync('./test/mocks/s3/mock-object.json'))
            });
            const s3Event = new S3Event(mockS3Data.getJsonData(), {getObject: true, jsonObject: true});
            const records = await s3Event.getRecords();
            assert.deepEqual(records[0].body, {id: 'true'});
        });
        it('should run s3 event when combined with all advance settings', async () => {
            const s3Event = new S3Event(mockS3Data.getJsonData(), {
                getObject: true,
                jsonObject: true,
                requiredBody: 'v1-response-result',
                schemaPath: 'test/mocks/openapi.yml',
                dataClass: DataClass
            });
            const records = await s3Event.getRecords();
            assert.isTrue(records[0] instanceof DataClass);
        });
        it('should throw error with s3 event when combined with all advance settings and invalid s3 body', async () => {
            const s3Event = new S3Event(mockS3Data.getJsonData(), {
                getObject: true,
                jsonObject: true,
                requiredBody: 'v1-response-fail',
                schemaPath: 'test/mocks/openapi.yml'
            });
            try {
                const records = await s3Event.getRecords();
            } catch (error) {
                assert.equal(error.message, '[{"path":"/id","message":"must be number"}]');
            }
        });
        it('should ignore error with validationError as false', async () => {
            const requiredBody = {
                type: 'object',
                required: ['example_id', 'note', 'active', 'personal', 'transportation'],
                additionalProperties: false,
                properties: {
                    example_id: {
                        type: 'string'
                    },
                    note: {
                        type: 'string'
                    },
                    active: {
                        type: 'number'
                    },
                    transportation: {
                        type: 'array'
                    }
                }
            };
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                validationError: false,
                requiredBody
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 0);
        });
        it('should return records since only looking for DDB create', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                operations: ['create'],
                operationError: false
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 1);
        });
        it('should return records since only looking for DDB update', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getUpdateData(), {
                globalLogger: true,
                operations: ['update'],
                operationError: false
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 1);
        });
        it('should return records since only looking for DDB delete', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getDeletedData(), {
                globalLogger: true,
                operations: ['delete'],
                operationError: false
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 1);
        });
        it('should return no records since only looking for DDB deletes', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                operations: ['delete'],
                operationError: false
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 0);
        });
        it('should return no records since only looking for DDB updates', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getUpdateData(), {
                globalLogger: true,
                operations: ['create'],
                operationError: false
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 0);
        });
        it('should return no records since only looking for DDB delete', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getDeletedData(), {
                globalLogger: true,
                operations: ['update'],
                operationError: false
            });
            const records = await ddbEvent.getRecords();
            assert.equal(records.length, 0);
        });
        it('should return throw exception since only looking for DDB deletes', async () => {
            const ddbEvent = new DDBEvent(mockDDBData.getData(), {
                globalLogger: true,
                operations: ['delete'],
                operationError: true
            });
            try {
                await ddbEvent.getRecords();
            } catch (error) {
                assert.equal(error.message, 'record is operation: create; only allowed delete');
            }
        });
    });
});
