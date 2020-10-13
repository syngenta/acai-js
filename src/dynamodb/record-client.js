const AWS = require('aws-sdk');

class RecordClient {
    constructor(record) {
        this._record = record;
        this._converter = AWS.DynamoDB.Converter.unmarshall;
    }

    get eventID() {
        return this._record.eventID;
    }

    get eventName() {
        return this._record.eventName;
    }

    get eventSource() {
        return this._record.eventSource;
    }

    get keys() {
        return this._converter(this._record.dynamodb.Keys);
    }

    get oldImage() {
        return this._converter(this._record.dynamodb.OldImage);
    }

    get newImage() {
        return this._converter(this._record.dynamodb.NewImage);
    }

    get rawBody() {
        return this._record.body;
    }

    get eventSourceARN() {
        return this._record.eventSourceARN;
    }

    get eventVersion() {
        return this._record.eventVersion;
    }

    get streamViewType() {
        return this._record.dynamodb.StreamViewType;
    }

    get sizeBytes() {
        return this._record.dynamodb.SizeBytes;
    }

    get approximateCreationDateTime() {
        return this._record.dynamodb.ApproximateCreationDateTime;
    }
}

module.exports = RecordClient;
