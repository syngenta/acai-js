const AWS = require('aws-sdk');

class RecordClient {
    constructor(record) {
        this._record = record;
        this._converter = AWS.DynamoDB.Converter.unmarshall;
    }

    get awsRegion() {
        return this._record.awsRegion;
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

    get body() {
        return this.newImage;
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

    get userIdentity() {
        return this._record.userIdentity;
    }

    get timeToLiveExpired() {
        return Boolean(
            this._record.userIdentity && this._record.userIdentity.type && this._record.userIdentity.principalId
        );
    }
}

module.exports = RecordClient;
