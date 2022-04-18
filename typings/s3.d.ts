import {S3Event, S3EventRecord, S3Handler as AWSS3Handler} from 'aws-lambda/trigger/s3';

export type S3Handler = AWSS3Handler

export namespace s3 {
    export class Record {
        constructor(record: S3EventRecord);

        readonly eventName: S3EventRecord['eventName'];
        readonly eventSource: S3EventRecord['eventSource'];
        readonly eventTime: S3EventRecord['eventTime'];
        readonly awsRegion: S3EventRecord['awsRegion'];
        readonly requestParameters: S3EventRecord['requestParameters'];
        readonly responseElements: S3EventRecord['responseElements'];
        readonly configurationId: S3EventRecord['s3']['configurationId'];
        readonly object: S3EventRecord['s3']['object'];
        readonly bucket: S3EventRecord['s3']['bucket'];
        readonly key: S3EventRecord['s3']['object']['key'];
        readonly s3SchemaVersion: S3EventRecord['s3']['s3SchemaVersion'];
    }

    export class Event {
        constructor(event: S3Event, params?: {globalLogger: boolean})

        /**
         * just the raw record from the original request
         */
        rawRecords: S3Event['Records'];
        /**
         * list of record objects
         */
        records: Record[];
    }
}
