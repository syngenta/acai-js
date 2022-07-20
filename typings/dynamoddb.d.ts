import {DynamoDBStreamEvent, DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda/trigger/dynamodb-stream';

export type DynamoDBHandler = DynamoDBStreamHandler;

export namespace dynamodb {
    export class Record {
        constructor(record: DynamoDBRecord);
        readonly awsRegion: DynamoDBRecord['awsRegion'];
        readonly eventID: DynamoDBRecord['eventID'];
        readonly eventName: DynamoDBRecord['eventName'];
        readonly eventSource: DynamoDBRecord['eventSource'];
        readonly keys: DynamoDBRecord['dynamodb']['Keys'];
        readonly oldImage: DynamoDBRecord['dynamodb']['OldImage'];
        readonly newImage: DynamoDBRecord['dynamodb']['NewImage'];
        readonly eventSourceARN: DynamoDBRecord['eventSource'];
        readonly eventVersion: DynamoDBRecord['eventVersion'];
        readonly streamViewType: DynamoDBRecord['dynamodb']['StreamViewType'];
        readonly sizeBytes: DynamoDBRecord['dynamodb']['SizeBytes'];
        readonly approximateCreationDateTime: DynamoDBRecord['dynamodb']['ApproximateCreationDateTime'];
        readonly userIdentity: DynamoDBRecord['userIdentity'];
        readonly timeToLiveExpired: boolean;
    }

    export class Event {
        constructor(event: DynamoDBStreamEvent, params?: {globalLogger: boolean})

        rawRecords: DynamoDBRecord;
        records: Record[];
    }
}
