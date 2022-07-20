import {SQSEvent, SQSRecord} from 'aws-lambda/trigger/sqs';

export namespace sqs {
    export class Record {
        constructor(record: SQSRecord);
        readonly messageId: SQSRecord['messageId'];
        readonly receiptHandle: SQSRecord['receiptHandle'];
        readonly body: unknown;
        readonly rawBody: SQSRecord['body'];
        readonly attributes: SQSRecord['attributes'];
        readonly messageAttributes: SQSRecord['messageAttributes'];
        readonly md5OfBody: SQSRecord['md5OfBody'];
        readonly source: SQSRecord['eventSource'];
        readonly sourceARN: SQSRecord['eventSourceARN'];
        readonly region: SQSRecord['awsRegion'];
    }

    export class Event {
        constructor(event: SQSEvent, params?: {globalLogger: boolean})
        rawRecords: SQSEvent['Records'];
        records: Record[];
    }
}
