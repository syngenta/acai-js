import {SQSEvent, SQSRecord} from 'aws-lambda/trigger/sqs';

export namespace sqs {
    export class Record {
        constructor(record: SQSRecord);

        /**
         * message id of sqs record
         */
        readonly messageId: SQSRecord['messageId'];
        /**
         * receipt handle of sqs record
         */
        readonly receiptHandle: SQSRecord['receiptHandle'];
        /**
         * body of sqs record (will automatically decode JSON)
         */
        readonly body: unknown;
        /**
         * body of sqs record
         */
        readonly rawBody: SQSRecord['body'];
        /**
         * attributes of sqs record
         */
        readonly attributes: SQSRecord['attributes'];
        /**
         * message attributes of sqs record
         */
        readonly messageAttributes: SQSRecord['messageAttributes'];
        /**
         * md5 of body of sqs record
         */
        readonly md5OfBody: SQSRecord['md5OfBody'];
        /**
         * source of sqs record
         */
        readonly source: SQSRecord['eventSource'];
        /**
         * source ARN of sqs record
         */
        readonly sourceARN: SQSRecord['eventSourceARN'];
        /**
         * region of sqs record
         */
        readonly region: SQSRecord['awsRegion'];
    }

    export class Event {
        constructor(event: SQSEvent, params?: {globalLogger: boolean})

        /**
         * just the raw record from the original request
         */
        rawRecords: SQSEvent['Records'];
        /**
         * list of record objects
         */
        records: Record[];
    }
}
