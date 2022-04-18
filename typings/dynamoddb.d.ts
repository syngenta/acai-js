import {DynamoDBStreamEvent, DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda/trigger/dynamodb-stream';

export type DynamoDBHandler = DynamoDBStreamHandler;

export namespace dynamodb {
    export class Record {
        constructor(record: DynamoDBRecord);

        /**
         * aws region of record
         */
        readonly awsRegion: DynamoDBRecord['awsRegion'];
        /**
         * event id of dynamodb record
         */
        readonly eventID: DynamoDBRecord['eventID'];
        /**
         * event name of dynamodb record
         */
        readonly eventName: DynamoDBRecord['eventName'];
        /**
         * event source of dynamodb record
         */
        readonly eventSource: DynamoDBRecord['eventSource'];
        /**
         * keys of dynamodb record (will convert ddb json)
         */
        readonly keys: DynamoDBRecord['dynamodb']['Keys'];
        /**
         * old image of dynamodb record
         */
        readonly oldImage: DynamoDBRecord['dynamodb']['OldImage'];
        /**
         * new image of dynamodb record
         */
        readonly newImage: DynamoDBRecord['dynamodb']['NewImage'];
        /**
         * event source ARN of dynamodb record
         */
        readonly eventSourceARN: DynamoDBRecord['eventSource'];
        /**
         * event version of dynamodb record
         */
        readonly eventVersion: DynamoDBRecord['eventVersion'];
        /**
         * stream view type version of dynamodb record
         */
        readonly streamViewType: DynamoDBRecord['dynamodb']['StreamViewType'];
        /**
         * size bytes of dynamodb record
         */
        readonly sizeBytes: DynamoDBRecord['dynamodb']['SizeBytes'];
        /**
         * approximate creation date time of dynamodb record
         */
        readonly approximateCreationDateTime: DynamoDBRecord['dynamodb']['ApproximateCreationDateTime'];
        /**
         * the user who cause the action (not always available populated)
         */
        readonly userIdentity: DynamoDBRecord['userIdentity'];
        /**
         * determines if the stream was invoked by a "time to live" expiring
         */
        readonly timeToLiveExpired: boolean;
    }

    export class Event {
        constructor(event: DynamoDBStreamEvent, params?: {globalLogger: boolean})

        rawRecords: DynamoDBRecord;
        records: Record[];
    }
}
